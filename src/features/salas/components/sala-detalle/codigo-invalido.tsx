import Link from 'next/link'

export default function CodigoInvalido ({ codigoSala }: { codigoSala: string }) {
  const aproximadoCodigoSala = codigoSala?.length > 6 ? codigoSala.slice(0, 6) : null

  return (
    <main className="container mx-auto py-6 flex flex-col gap-3 grow">
      <h1 className="font-bold text-2xl text-red-600">Código de sala inválido</h1>
      <p>El código de la sala debe tener al menos 6 caracteres.</p>

      {aproximadoCodigoSala && (
        <Link
          href={`/salas/${aproximadoCodigoSala}`}
          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
        >
          ¿Quisiste escribir: {aproximadoCodigoSala}?
        </Link>
      )}

      <Link href="/salas" className="mt-4 text-blue-600 hover:underline">
        ← Volver a la lista de salas
      </Link>
    </main>
  )
}
