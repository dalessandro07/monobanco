import { getAllSalas } from '@/core/db/queries/select'

export default async function ListaSalas () {
  const salas = await getAllSalas()

  return (
    <section className='flex flex-col grow gap-5'>
      <h2>Salas activas</h2>

      <ul className='flex flex-col gap-5'>
        {salas.map((sala) => (
          <li key={sala.salas_table.id} className='flex flex-col gap-2'>
            <h3>{sala.salas_table.nombre}</h3>
            <p>Creada por: {sala.jugadores_table.nombre}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
