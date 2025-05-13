import { buttonVariants } from '@/core/components/ui/button'
import { getAllJugadoresPorSalaId, getCreadorDeSalaPorId, getSalaPorCodigo } from '@/core/db/queries/select'
import { SALA_ESTADO } from '@/core/lib/constants'
import { cn, formatAmount, isValidCodigoSala } from '@/core/lib/utils'
import CodigoInvalido from '@/features/salas/components/sala-detalle/codigo-invalido'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageSalaProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata ({ params }: PageSalaProps): Promise<Metadata> {
  const { id: codigoSala } = await params
  const sala = await getSalaPorCodigo(codigoSala)

  // Verificamos si la sala existe
  if (!sala) {
    return {
      title: 'Sala no encontrada'
    }
  }

  const creador = await getCreadorDeSalaPorId(sala.id)

  const nombreCreador = creador ? creador.nombre : 'Desconocido'

  const title = sala ? `Sala ${sala.nombre} - Creada por ${nombreCreador}` : 'Sala no encontrada'

  return {
    title
  }
}

export default async function PageSala ({ params }: PageSalaProps) {
  const { id: codigoSala } = await params

  // Verificamos si el código de la sala es válido
  if (!codigoSala || !isValidCodigoSala(codigoSala)) {
    return <CodigoInvalido codigoSala={codigoSala} />
  }

  const sala = await getSalaPorCodigo(codigoSala)

  // Verificamos si la sala existe
  if (!sala) return notFound()

  // Verificamos si la sala está activa
  if (sala.estado !== SALA_ESTADO.ABIERTA) {
    return (
      <div className="flex flex-col gap-4 grow">
        <h2 className="font-bold text-xl mb-2">Sala no activa</h2>
        <p className="text-sm text-muted-foreground">
          ¡La sala fue cerrada! El juego terminó.
        </p>

        <Link href="/" className={cn(buttonVariants(), 'w-max')}>
          ¡Crea una nueva sala!
        </Link>
      </div>
    )
  }

  const jugadoresPorSala = await getAllJugadoresPorSalaId(sala.id)

  return (
    <main className="flex flex-col gap-4 grow">
      <header className="border-b pb-4 mb-2">
        <h1 className="font-bold text-3xl mb-2">{sala.nombre}</h1>
        <div className="flex gap-3 text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">Código: {sala.codigo_sala}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">Estado: {sala.estado}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">Visualización: {sala.visualizacion}</span>
        </div>
      </header>

      <section>
        <h2 className="font-bold text-xl mb-3">Jugadores en la sala</h2>
        {jugadoresPorSala.length === 0 ? (
          <p className="text-gray-500 italic">No hay jugadores en esta sala.</p>
        ) : (
          <ul className="grid gap-2">
            {jugadoresPorSala.map((jugador) => (
              <li key={jugador.id} className="p-3 border rounded-md flex justify-between items-center">
                <span className="font-medium">{jugador.nombre}</span>
                <span className="font-mono">{formatAmount(jugador.balance)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
