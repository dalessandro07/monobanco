import { APP_LEGAL } from '@/core/lib/constants/legal'
import Link from 'next/link'

export default function PageCondiciones () {
  return (
    <main className='flex flex-col gap-5 grow max-w-prose mx-auto'>
      <h1 className='text-3xl font-bold text-center'>Términos y Condiciones</h1>

      <section className='flex flex-col grow gap-5'>
        {APP_LEGAL.condiciones.map((section, index) => (
          <section key={index}>
            <h2 className='text-xl font-bold'>{section.title}</h2>
            <p className='text-sm text-muted-foreground'>{section.content}</p>
          </section>
        ))}
      </section>

      <Link href='/legal/privacidad' className='text-sm w-max mx-auto text-muted-foreground hover:text-primary underline'>
        Política de Privacidad
      </Link>
    </main>
  )
}
