import { getTransaccionesPorSalaId } from '@/core/db/queries/select'
import type { SelectSala, TJugador } from '@/core/db/schema'
import { formatAmount, formatDate } from '@/core/lib/utils'

export default async function ListaTransacciones ({
  sala,
  jugadoresPorSala
}: {
  sala: SelectSala
  jugadoresPorSala: TJugador[]
}) {
  // Obtener las transacciones de la sala
  const transacciones = await getTransaccionesPorSalaId(sala.id)

  return (
    <article className='flex flex-col gap-2'>
      <h2 className="font-bold text-xl">Transacciones</h2>

      {transacciones.length === 0 ? (
        <p className="text-gray-500 italic">No hay transacciones en esta sala.</p>
      ) : (
        <ul className="grid gap-2">
          {transacciones.map((transaccion) => (
            <li key={transaccion.id} className="p-4 border rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-muted-foreground">{formatDate(transaccion.created_at, {
                  date: 'short',
                  time: 'medium'
                })}</span>
                <span className="font-mono font-bold text-lg">{formatAmount(transaccion.monto)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>De: {jugadoresPorSala.find(jugador => jugador.id === transaccion.jugador_origen_id)?.nombre || 'Jugador eliminado'}</span>
                <span className="text-gray-400">→</span>
                <span>Para: {jugadoresPorSala.find(jugador => jugador.id === transaccion.jugador_destino_id)?.nombre || 'Jugador eliminado'}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
