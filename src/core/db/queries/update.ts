import { db } from '@/core/db'
import { salasTable } from '@/core/db/schema'
import { SALA_ESTADO, type SALA_VISUALIZACION } from '@/core/lib/constants'
import { and, eq } from 'drizzle-orm'

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
