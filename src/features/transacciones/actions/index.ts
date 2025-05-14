'use server'

import { crearTransaccion } from '@/core/db/queries/insert'
import { aumentarMontoJugador, disminuirMontoJugador } from '@/core/db/queries/update'
import type { InsertTransacciones } from '@/core/db/schema'
import { TRANSACCION_TIPO } from '@/core/lib/constants'
import { verificarUsuario } from '@/features/salas/actions'
import { revalidatePath } from 'next/cache'

export async function actionCrearTransaccion (initialState: unknown, formData: FormData) {
  try {
    const { data: usuario } = await verificarUsuario()
    const jugadorOrigenId = usuario?.id

    // Datos del formulario
    const salaId = formData.get('salaId') as string
    const jugadorDestinoId = formData.get('jugadorDestinoId') as string
    const monto = parseInt(formData.get('monto') as string)
    const tipo = formData.get('tipo') as string ?? TRANSACCION_TIPO.TRANSFERENCIA

    // Validamos que no faltan datos
    if (!salaId || !tipo || !monto || !jugadorOrigenId || !jugadorDestinoId) {
      return {
        success: false,
        message: 'Faltan datos para crear la transacción.'
      }
    }

    // Creamos la transacción
    const transaccion = {
      sala_id: salaId,
      jugador_origen_id: jugadorOrigenId,
      jugador_destino_id: jugadorDestinoId,
      monto: Number(monto),
      tipo
    } as InsertTransacciones

    const nuevaTransaccion = await crearTransaccion(transaccion)

    // Actualizamos el saldo del jugador origen y destino
    await aumentarMontoJugador(jugadorDestinoId, Number(monto))
    await disminuirMontoJugador(jugadorOrigenId, Number(monto))

    return {
      success: true,
      data: nuevaTransaccion
    }
  } catch (error) {
    console.error('Error al crear transacción:', error)
    const message = error instanceof Error ? error.message : 'Error inesperado al crear la transacción'

    return {
      success: false,
      message
    }
  } finally {
    revalidatePath('/')
  }
}
