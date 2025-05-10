import { db } from '@/core/db'
import { salasTable } from '@/core/db/schema'
import { and, eq } from 'drizzle-orm'

//! SALAS
export async function cerrarSala (salaId: string, jugadorId: string) {
  const cerrada = await db.update(salasTable)
    .set({ estado: 'CERRADA', closed_at: new Date() })
    .where(and(
      eq(salasTable.id, salaId),
      eq(salasTable.created_by, jugadorId)
    ))
    .returning()

  return cerrada
}
