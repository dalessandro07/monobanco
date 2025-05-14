import { db } from '@/core/db'
import { jugadoresSalasTable, salasTable } from '@/core/db/schema'
import { JUGADOR_SALA_ESTADO, SALA_ESTADO, type SALA_VISUALIZACION } from '@/core/lib/constants'
import { and, eq, sql, type AnyColumn } from 'drizzle-orm'

const increment = (column: AnyColumn, value = 200) => {
  return sql`${column} + ${value}`
}

//! SALAS
export async function cerrarSala (salaId: string, jugadorId: string) {
  const cerrada = await db.update(salasTable)
    .set({ estado: SALA_ESTADO.CERRADA, closed_at: new Date() })
    .where(and(
      eq(salasTable.id, salaId),
      eq(salasTable.created_by, jugadorId)
    ))
    .returning()

  return cerrada
}

export async function cambiarVisualizacionSala (salaId: string, visualizacion: SALA_VISUALIZACION) {
  const actualizada = await db.update(salasTable)
    .set({ visualizacion })
    .where(eq(salasTable.id, salaId))
    .returning()

  return actualizada
}

//! JUGADORES
export async function retirarJugadorDeSala (salaId: string, jugadorId: string) {
  const actualizado = await db
    .update(jugadoresSalasTable)
    .set({ estado: JUGADOR_SALA_ESTADO.INACTIVO })
    .where(and(
      eq(jugadoresSalasTable.jugador_id, jugadorId),
      eq(jugadoresSalasTable.sala_id, salaId)
    ))
    .returning()

  return actualizado
}

export async function cambiarEstadoJugador (salaId: string, jugadorId: string, estado: JUGADOR_SALA_ESTADO) {
  const actualizado = await db.update(jugadoresSalasTable)
    .set({ estado })
    .where(and(
      eq(jugadoresSalasTable.jugador_id, jugadorId),
      eq(jugadoresSalasTable.sala_id, salaId)
    ))
    .returning()

  return actualizado
}

//! TRANSACCIONES
export async function actualizarMontoJugador (jugadorId: string, monto: number) {
  const actualizado = await db.update(jugadoresSalasTable)
    .set({ balance: monto })
    .where(eq(jugadoresSalasTable.jugador_id, jugadorId))
    .returning()

  return actualizado
}

export async function aumentarMontoJugador (jugadorId: string, monto: number) {
  const actualizado = await db.update(jugadoresSalasTable)
    .set({ balance: increment(jugadoresSalasTable.balance, monto) })
    .where(eq(jugadoresSalasTable.jugador_id, jugadorId))
    .returning()

  return actualizado
}

export async function disminuirMontoJugador (jugadorId: string, monto: number) {
  const actualizado = await db.update(jugadoresSalasTable)
    .set({ balance: increment(jugadoresSalasTable.balance, -monto) })
    .where(eq(jugadoresSalasTable.jugador_id, jugadorId))
    .returning()

  return actualizado
}
