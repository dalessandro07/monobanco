import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/core/components/ui/tabs"
import { getUser } from '@/features/auth/actions'
import FormIngresarSala from '@/features/salas/components/form-ingresar-sala'
import FormNuevaSala from '@/features/salas/components/form-nueva-sala'
import ListaSalas from '@/features/salas/components/lista-salas'
import { redirect } from 'next/navigation'

export default async function Home () {
  const { data: user } = await getUser()

  if (!user?.id) redirect('/login')

  return (
    <main className='flex flex-col gap-5 grow'>
      <section className='flex flex-col gap-5 grow'>
        <h2>Salas</h2>

        <Tabs defaultValue="nueva">
          <TabsList className="w-full">
            <TabsTrigger value="nueva">Crear Sala</TabsTrigger>
            <TabsTrigger value="ingresar">Ingresar a Sala</TabsTrigger>
          </TabsList>
          <TabsContent value="nueva" className="mt-2">
            <FormNuevaSala idJugador={user?.id} />
          </TabsContent>
          <TabsContent value="ingresar" className="mt-2">
            <FormIngresarSala idJugador={user?.id} />
          </TabsContent>
        </Tabs>

        <ListaSalas />
      </section>
    </main>
  )
}
