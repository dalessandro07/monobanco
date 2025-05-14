import { Loader2Icon } from 'lucide-react'

export default function LoadingSalaDetalle () {
  return (
    <main className="flex flex-col gap-5 grow items-center justify-center">
      <h1 className="text-3xl font-bold">Cargando sala...</h1>
      <p className="text-gray-500">Por favor, espera un momento.</p>
      <div className="animate-pulse">
        <Loader2Icon className="w-16 h-16 text-gray-500 animate-spin" />
      </div>
    </main>
  )
}
