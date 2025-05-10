import { db } from '@/core/db'
import { jugadoresSalasTable, jugadoresTable, salasTable } from '@/core/db/schema'
import { and, eq } from 'drizzle-orm'

//! SALAS
export async function eliminarSala (salaId: string, jugadorId: string) {
  const eliminada = await db.delete(salasTable)
    .where(and(
      eq(salasTable.id, salaId),
      eq(salasTable.created_by, jugadorId)
    ))
    .returning()

  return eliminada
}

//! JUGADORES
export async function eliminarJugador (jugadorId: string) {
  const eliminado = await db.delete(jugadoresTable)
    .where(eq(jugadoresTable.id, jugadorId))
    .returning()

  return eliminado
}

//! SALAS y JUGADORES
export async function eliminarJugadorDeSala (salaId: string, jugadorId: string) {
  const eliminado = await db.delete(jugadoresSalasTable)
    .where(and(
      eq(jugadoresSalasTable.jugador_id, jugadorId),
      eq(jugadoresSalasTable.sala_id, salaId)
    ))
    .returning()

  return eliminado
}
