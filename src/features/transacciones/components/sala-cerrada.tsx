import { buttonVariants } from '@/core/components/ui/button'
import { cn } from '@/core/lib/utils'
import Link from 'next/link'

export default function SalaCerrada () {
  return (
    <main className="flex flex-col gap-4 grow">
      <h2 className="font-bold text-xl mb-2">Sala no activa</h2>
      <p className="text-sm text-muted-foreground">
        ¡La sala fue cerrada! El juego terminó.
      </p>

      <Link href="/" className={cn(buttonVariants(), 'w-max')}>
        ¡Crea una nueva sala!
      </Link>
    </main>
  )
}
