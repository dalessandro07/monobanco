import { db } from '@/core/db'
import { jugadoresSalasTable, jugadoresTable, salasTable, type InsertSala } from '@/core/db/schema'
import type { User } from '@supabase/supabase-js'
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

const shortName = uniqueNamesGenerator({
  dictionaries: [colors, animals],
  length: 2
})

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
      nombre: jugador.user_metadata.full_name ?? shortName,
      email: jugador.email ?? ''
    })
    .returning()

  return nuevoJugador[0]
}

//! SALAS y JUGADORES
export async function agregarJugadorASala (salaId: string, jugadorId: string) {
  const nuevoJugador = await db.insert(jugadoresSalasTable)
    .values({
      jugador_id: jugadorId,
      sala_id: salaId
    })
    .returning()

  return nuevoJugador[0]
}
