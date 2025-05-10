import { getAllSalasActivas, getAllSalasCerradasPorJugadorId } from '@/core/db/queries/select'
import { getUser } from '@/features/auth/actions'
import ListaItemSala from '@/features/salas/components/sala/lista-item-sala'

export default async function ListaSalas () {
  const { data: user } = await getUser()
  const jugadorId = user?.id

  if (!jugadorId) return null

  const [salas, historialSalas] = await Promise.all([
    getAllSalasActivas(),
    getAllSalasCerradasPorJugadorId(jugadorId)
  ])

  return (
    <section className='flex flex-col gap-5 grow'>
      {salas.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2>Salas activas</h2>

          <ul className='flex flex-col gap-5'>
            {salas.map((sala) => (
              <ListaItemSala key={sala.salas_table.id} sala={sala} />
            ))}
          </ul>
        </section>
      )}

      {historialSalas.length > 0 && (
        <section className='flex flex-col gap-2'>
          <h2>Historial de salas</h2>

          <ul className='flex flex-col gap-5'>
            {historialSalas.map((sala) => (
              <ListaItemSala key={sala.salas_table.id} sala={sala} />
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
