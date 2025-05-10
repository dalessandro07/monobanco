import { db } from '@/core/db'
import { jugadoresSalasTable, jugadoresTable, salasTable, type InsertSala } from '@/core/db/schema'
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

  const nuevoJugador = await db.insert(jugadoresSalasTable)
    .values({
      jugador_id: jugadorId,
      sala_id: sala[0].id
    })
    .returning()

  return nuevoJugador[0]
}
