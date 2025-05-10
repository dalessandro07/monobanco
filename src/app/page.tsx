import { getUser } from '@/features/auth/actions'
import LogoutForm from '@/features/auth/components/logout-form'
import FormNuevaSala from '@/features/salas/components/form-nueva-sala'
import ListaSalas from '@/features/salas/components/lista-salas'
import { redirect } from 'next/navigation'

export default async function Home () {
  const { data: user } = await getUser()

  if (!user?.id) redirect('/login')

  return (
    <main className='flex flex-col gap-5 grow'>
      <header className='flex flex-col xxs:flex-row items-center justify-between'>
        <h1 className='grow'>MonoBanco</h1>

        <div className="flex gap-5 items-center">
          {user?.user_metadata?.full_name && <h2>{user?.user_metadata?.full_name}</h2>}
          <LogoutForm />
        </div>
      </header>

      <section className='flex flex-col grow gap-5'>
        <h2>Salas</h2>

        <FormNuevaSala idJugador={user?.id} />
        <ListaSalas />
      </section>
    </main>
  )
}
