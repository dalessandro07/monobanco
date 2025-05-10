import { db } from '@/core/db'
import { jugadoresSalasTable, jugadoresTable, salasTable } from '@/core/db/schema'
import { and, desc, eq } from 'drizzle-orm'

//! SALAS
export async function getAllSalasActivas () {
  const salas = await db.select()
    .from(salasTable)
    .innerJoin(jugadoresTable, eq(salasTable.created_by, jugadoresTable.id))
    .where(eq(salasTable.estado, 'ABIERTA'))
    .orderBy(desc(salasTable.created_at))
  return salas
}

export async function getAllSalasCerradasPorJugadorId (jugadorId: string) {
  const salas = await db.select()
    .from(salasTable)
    .innerJoin(jugadoresTable, eq(salasTable.created_by, jugadoresTable.id))
    .where(and(
      eq(salasTable.created_by, jugadorId),
      eq(salasTable.estado, 'CERRADA')
    ))
    .orderBy(desc(salasTable.created_at))

  return salas
}

export async function getAllSalasAbiertasPorJugadorId (jugadorId: string) {
  const salas = await db.select()
    .from(salasTable)
    .innerJoin(jugadoresTable, eq(salasTable.created_by, jugadoresTable.id))
    .where(and(
      eq(salasTable.created_by, jugadorId),
      eq(salasTable.estado, 'ABIERTA')
    ))
    .orderBy(desc(salasTable.created_at))

  return salas
}

export async function getSalaPorId (salaId: string) {
  const sala = await db.select()
    .from(salasTable)
    .where(eq(salasTable.id, salaId))
    .limit(1)

  return sala[0]
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
