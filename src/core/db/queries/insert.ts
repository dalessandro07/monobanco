import { db } from '@/core/db'
import { getJugadorPorSalaId } from '@/core/db/queries/select'
import { cambiarEstadoJugador } from '@/core/db/queries/update'
import { jugadoresSalasTable, jugadoresTable, salasTable, transaccionesTable, type InsertSala, type InsertTransacciones } from '@/core/db/schema'
import { JUGADOR_SALA_ESTADO } from '@/core/lib/constants'
import { randomName } from '@/core/lib/utils'
import type { User } from '@supabase/supabase-js'
import { eq } from 'drizzle-orm'


//! SALAS
export async function crearSala (sala: InsertSala) {
  const nuevaSala = await db.insert(salasTable).values(sala)
    .returning()

  return nuevaSala[0]
}

//! JUGADORES
export async function crearJugador (jugador: User) {
  const nuevoJugador = await db.insert(jugadoresTable)
    .values({
      id: jugador.id,
      nombre: jugador.user_metadata.full_name ?? randomName(2),
      email: jugador.email ?? ''
    })
    .returning()

  return nuevoJugador[0]
}

//! SALAS y JUGADORES
export async function agregarJugadorASala (codigoSala: string, jugadorId: string) {
  const sala = await db.select()
    .from(salasTable)
    .where(eq(salasTable.codigo_sala, codigoSala))
    .limit(1)

  if (!sala[0]) {
    throw new Error('No existe la sala')
  }

  if (sala[0].estado !== 'ABIERTA') {
    throw new Error('La sala no está abierta')
  }

  // Verificamos si el jugador ya está en la sala
  const jugadorEnSala = await getJugadorPorSalaId(sala[0].id, jugadorId)

  if (jugadorEnSala) {
    // Si el jugador ya está en la sala, verificamos si está activo
    if (jugadorEnSala.estado === JUGADOR_SALA_ESTADO.ACTIVO) {
      throw new Error('El jugador ya está en la sala')
    }

    // Si el jugador no está activo, lo activamos y retornamos
    await cambiarEstadoJugador(sala[0].id, jugadorId, JUGADOR_SALA_ESTADO.ACTIVO)

    return jugadorEnSala
  }

  const nuevoJugador = await db
    .insert(jugadoresSalasTable)
    .values({
      jugador_id: jugadorId,
      sala_id: sala[0].id,
      estado: JUGADOR_SALA_ESTADO.ACTIVO
    })
    .returning()

  return nuevoJugador[0]
}

//! TRANSACCIONES
export async function crearTransaccion (transaccion: InsertTransacciones) {
  const nuevaTransaccion = await db
    .insert(transaccionesTable)
    .values(transaccion)
    .returning()

  return nuevaTransaccion[0]
}
