'use server'

import { eliminarJugadorDeSala, eliminarSala } from '@/core/db/queries/delete'
import { agregarJugadorASala, crearJugador, crearSala } from '@/core/db/queries/insert'
import { getAllSalasAbiertasPorJugadorId, getJugadorPorId } from '@/core/db/queries/select'
import { cerrarSala } from '@/core/db/queries/update'
import type { SelectSala } from '@/core/db/schema'
import { getUser } from '@/features/auth/actions'
import { revalidatePath } from 'next/cache'

//! GESTIONAR SALAS

async function verificarUsuario () {
  // Obtenemos datos del usuario autenticado
  const { data: usuario } = await getUser()

  // Validamos que existe un usuario autenticado
  if (!usuario) {
    return {
      success: false,
      message: 'Sesión no encontrada. Por favor, inicia sesión nuevamente.'
    }
  }

  return {
    success: true,
    data: usuario
  }
}

export async function actionCrearSala (initialState: unknown, formData: FormData) {
  try {
    const { data: usuario } = await verificarUsuario()

    const nombre = (formData.get('nombre') as string)?.trim()
    const visualizacion = (formData.get('visualizacion') as string)?.trim()
    const creadorId = usuario?.id

    // Validamos que no faltan datos
    if (!nombre || !visualizacion || !creadorId) {
      return {
        success: false,
        message: 'Faltan datos para crear la sala.'
      }
    }

    // Validamos que el usuario no tenga salas activas
    const salasPrevias = await getAllSalasAbiertasPorJugadorId(creadorId)
    if (salasPrevias.length > 0) {
      return {
        success: false,
        message: 'Ya tienes una sala activa. Puedes crear una nueva sala cuando abandones la actual.'
      }
    }

    // Creamos la sala (ID único y código de sala aleatorio)
    const sala = {
      id: crypto.randomUUID(),
      nombre,
      visualizacion,
      codigo_sala: Math.random().toString(36).substring(2, 8),
      created_by: creadorId
    } as SelectSala

    // Buscamos o creamos el perfil de jugador
    let jugador = await getJugadorPorId(creadorId)

    if (!jugador) {
      jugador = await crearJugador(usuario)
    }

    // Creamos la sala y agregamos al jugador
    await crearSala(sala)

    // Vinculamos el jugador a la sala
    await agregarJugadorASala(sala.id, jugador.id)

    return {
      success: true,
      data: sala
    }
  } catch (error) {
    console.error('Error al crear sala:', error)
    const message = error instanceof Error ? error.message : 'Error inesperado al crear la sala'

    return {
      success: false,
      message
    }
  } finally {
    revalidatePath('/')
  }
}

export async function actionIngresarSala (initialState: unknown, formData: FormData) {
  const { data: usuario } = await verificarUsuario()

  const codigoSala = formData.get('codigo_sala') as string
  const jugadorId = formData.get('jugador_id') as string

  // Validamos que no faltan datos
  if (!codigoSala || !jugadorId || !usuario) {
    return {
      success: false,
      message: 'Faltan datos para ingresar a la sala'
    }
  }

  try {
    // Validamos que el usuario no tenga salas activas
    const salasPrevias = await getAllSalasAbiertasPorJugadorId(usuario.id)
    if (salasPrevias.length > 0) {
      return {
        success: false,
        message: 'Ya tienes una sala activa. Puedes ingresar a una nueva sala cuando abandones la actual.'
      }
    }

    let jugador = await getJugadorPorId(jugadorId)

    if (!jugador) {
      jugador = await crearJugador(usuario)
    }

    const data = await agregarJugadorASala(codigoSala, jugador.id)

    if (!data) throw new Error('No se pudo ingresar a la sala')

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error al ingresar a la sala:', error)
    const message = error instanceof Error ? error.message : 'Error al ingresar a la sala'

    return {
      success: false,
      message
    }
  } finally {
    revalidatePath('/')
  }
}

export async function actionAbandonarSala (salaId: string, jugadorId: string) {
  if (!salaId || !jugadorId) {
    return {
      success: false,
      message: 'Faltan datos para abandonar la sala'
    }
  }

  try {
    await eliminarJugadorDeSala(salaId, jugadorId)

    return {
      success: true,
      message: 'Has abandonado la sala correctamente'
    }
  } catch (error) {
    console.error('Error al abandonar la sala:', error)
    const message = error instanceof Error ? error.message : 'Error al abandonar la sala'

    return {
      success: false,
      message
    }
  } finally {
    revalidatePath('/')
  }
}

export async function actionCerrarSala (salaId: string, jugadorId: string) {
  if (!salaId || !jugadorId) {
    return {
      success: false,
      message: 'Faltan datos para cerrar la sala'
    }
  }

  try {
    await cerrarSala(salaId, jugadorId)

    return {
      success: true,
      message: 'Has cerrado la sala correctamente'
    }
  } catch (error) {
    console.error('Error al cerrar la sala:', error)
    const message = error instanceof Error ? error.message : 'Error al cerrar la sala'

    return {
      success: false,
      message
    }
  } finally {
    revalidatePath('/')
  }
}

export async function actionEliminarSala (salaId: string, jugadorId: string) {
  if (!salaId || !jugadorId) {
    return {
      success: false,
      message: 'Faltan datos para eliminar la sala'
    }
  }

  try {
    const data = await eliminarSala(salaId, jugadorId)

    if (!data) throw new Error('No se pudo eliminar la sala')

    return {
      success: true,
      data
    }
  } catch (error) {
    console.error('Error al eliminar la sala:', error)
    const message = error instanceof Error ? error.message : 'Error al eliminar la sala'

    return {
      success: false,
      message
    }
  } finally {
    revalidatePath('/')
  }
}
