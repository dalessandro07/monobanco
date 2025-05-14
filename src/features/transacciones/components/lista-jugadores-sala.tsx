import type { SelectJugador } from '@/core/db/schema'
import { JUGADOR_SALA_ESTADO } from '@/core/lib/constants'
import { formatAmount } from '@/core/lib/utils'

export default function ListaJugadoresSala ({
  jugadoresPorSala
}: {
  jugadoresPorSala: (SelectJugador & { balance: number, estado: number })[]
}) {
  return (
    <article className='flex flex-col gap-2'>
      <h2 className="font-bold text-xl">Jugadores en la sala</h2>
      {jugadoresPorSala.length === 0 ? (
        <p className="text-gray-500 italic">No hay jugadores en esta sala.</p>
      ) : (
        <ul className="grid gap-2">
          {jugadoresPorSala.map((jugador) => (
            <li key={jugador.id} className="p-3 border rounded-md flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">{jugador.nombre}</span>
                {jugador.estado === JUGADOR_SALA_ESTADO.INACTIVO && (
                  <span className="text-destructive text-sm italic">
                    (Ya no está en la sala)
                  </span>
                )}
              </div>
              <span className="font-mono">{formatAmount(jugador.balance)}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}
