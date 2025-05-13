import { getAllSalasAbiertasPorJugadorId, getAllSalasCerradasPorJugadorId } from '@/core/db/queries/select'
import { getUser } from '@/features/auth/actions'
import ListaItemSala from '@/features/salas/components/sala/lista-item-sala'

export default async function ListaSalas () {
  const { data: user } = await getUser()
  const jugadorId = user?.id

  if (!jugadorId) return null

  // Utilizamos Promise.all para ejecutar ambas consultas en paralelo y mejorar el rendimiento
  const [salas, historialSalas] = await Promise.all([
    getAllSalasAbiertasPorJugadorId(jugadorId),
    getAllSalasCerradasPorJugadorId(jugadorId)
  ])

  const tieneSalas = salas.length > 0 || historialSalas.length > 0

  return (
    <section className='flex flex-col gap-5 grow'>
      {!tieneSalas && (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <p className="text-muted-foreground mb-2">No tienes salas activas ni historial de salas.</p>
          <p className="text-muted-foreground">Puedes crear una nueva sala o ingresar a una existente utilizando las opciones de arriba.</p>
        </div>
      )}

      {salas.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2>Salas activas</h2>

          <ul className='flex flex-col gap-5'>
            {salas.map((sala) => (
              <li key={sala.id}>
                <ListaItemSala sala={sala} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {historialSalas.length > 0 && (
        <section className='flex flex-col gap-2'>
          <h2>Historial de salas</h2>

          <ul className='flex flex-col gap-5'>
            {historialSalas.map((sala) => (
              <li key={sala.id}>
                <ListaItemSala sala={sala} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
