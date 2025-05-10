import { db } from '@/core/db'
import { jugadoresSalasTable, jugadoresTable, salasTable } from '@/core/db/schema'
import { desc, eq } from 'drizzle-orm'

//! SALAS
export async function getAllSalas () {
  const salas = await db.select()
    .from(salasTable)
    .innerJoin(jugadoresTable, eq(salasTable.created_by, jugadoresTable.id))
    .orderBy(desc(salasTable.created_at))
  return salas
}

export async function getAllSalasPorJugadorId (jugadorId: string) {
  const salas = await db.select()
    .from(salasTable)
    .where(eq(salasTable.created_by, jugadorId))
    .orderBy(desc(salasTable.created_at))

  return salas
}

//! JUGADORES
export async function getAllJugadoresPorSalaId (salaId: string) {
  const jugadores = await db.select()
    .from(jugadoresSalasTable)
    .innerJoin(jugadoresTable, eq(jugadoresSalasTable.jugador_id, jugadoresTable.id))
    .where(eq(jugadoresSalasTable.sala_id, salaId))
    .orderBy(desc(jugadoresSalasTable.created_at))

  return jugadores
}

export async function getJugadorPorId (jugadorId: string) {
  const jugador = await db.select()
    .from(jugadoresTable)
    .where(eq(jugadoresTable.id, jugadorId))
    .limit(1)

  return jugador[0]
}
