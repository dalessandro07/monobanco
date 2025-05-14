import { getAllJugadoresPorSalaId, getCreadorDeSalaPorId, getSalaPorCodigo } from '@/core/db/queries/select'
import { JUGADOR_SALA_ESTADO, MONTO_INICIAL_BANCO, SALA_ESTADO } from '@/core/lib/constants'
import { formatAmount, isValidCodigoSala } from '@/core/lib/utils'
import { getUser } from '@/features/auth/actions'
import BtnIngresar from '@/features/salas/components/sala/btn-ingresar'
import CodigoInvalido from '@/features/transacciones/components/codigo-invalido'
import FormNuevaTransaccion from '@/features/transacciones/components/form-nueva-transaccion'
import ListaJugadoresSala from '@/features/transacciones/components/lista-jugadores-sala'
import ListaTransacciones from '@/features/transacciones/components/lista-transacciones'
import SalaCerrada from '@/features/transacciones/components/sala-cerrada'
import type { Metadata } from 'next'
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

  const { data: user } = await getUser()

  // Verificamos si el código de la sala es válido
  if (!codigoSala || !isValidCodigoSala(codigoSala)) {
    return <CodigoInvalido codigoSala={codigoSala} />
  }

  const sala = await getSalaPorCodigo(codigoSala)

  // Verificamos si la sala existe
  if (!sala) return notFound()

  // Verificamos si la sala está activa
  if (sala.estado !== SALA_ESTADO.ABIERTA) return <SalaCerrada />

  const jugadoresPorSala = await getAllJugadoresPorSalaId(sala.id)
  const jugadorActual = jugadoresPorSala.find((jugador) => (
    jugador.id === user?.id && jugador.estado === JUGADOR_SALA_ESTADO.ACTIVO
  ))

  // Verificamos si el usuario está en la sala
  if (!jugadorActual && user?.id) {
    return (
      <main className="flex flex-col gap-5 grow items-center justify-center">
        <h1 className="text-3xl text-center text-balance font-bold">Todavía no estás en la sala de <br />&quot;{sala.nombre}&quot;</h1>
        <p className="text-center text-muted-foreground">Para ingresar a la sala, haz clic en el botón de abajo</p>

        <BtnIngresar codigoSala={codigoSala} jugadorId={user.id} withRedirect={false} />
      </main>
    )
  }

  return (
    <main className="flex flex-col gap-5 grow">
      <header className="border-b flex flex-wrap justify-between items-center gap-5">
        <p className="text-sm">Bienvenido a la sala: {sala.nombre}</p>
        <p className="text-sm text-muted-foreground">#{sala.codigo_sala}</p>
      </header>

      <section className='sticky top-0 z-10 flex flex-col items-center justify-center gap-2 rounded-md bg-background p-5'>
        <h1 className="font-bold text-2xl text-muted-foreground">
          {jugadorActual ? jugadorActual.nombre : 'No estás en la sala'}
        </h1>
        <p className='text-5xl font-bold text-muted-foreground'>
          {formatAmount(jugadorActual?.balance || 0)}
        </p>
      </section>

      <section className="flex flex-col gap-5">
        <article>
          <h2 className="font-bold text-xl">Banco</h2>
          <p className="text-sm text-muted-foreground">
            El banco tiene {formatAmount(MONTO_INICIAL_BANCO)}
          </p>
        </article>

        <ListaJugadoresSala jugadoresPorSala={jugadoresPorSala} />

        <ListaTransacciones sala={sala} jugadoresPorSala={jugadoresPorSala} />

        <FormNuevaTransaccion jugadoresPorSala={jugadoresPorSala} jugadorId={user?.id} salaId={sala.id} />
      </section>
    </main>
  )
}
