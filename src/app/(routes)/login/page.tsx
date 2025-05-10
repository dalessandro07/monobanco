import LoginForm from '@/features/auth/components/login-form'
import Link from 'next/link'

export default function LoginPage () {
  return (
    <main className='flex flex-col items-center justify-center gap-5 grow'>
      <h1 className='text-2xl font-bold text-balance'>Inicia sesión para empezar a jugar</h1>
      <LoginForm />

      <footer className='flex items-center gap-2'>
        <Link href='/legal/condiciones' className='mx-auto text-sm underline w-max text-muted-foreground hover:text-primary'>
          Términos y condiciones
        </Link>

        <Link href='/legal/privacidad' className='mx-auto text-sm underline w-max text-muted-foreground hover:text-primary'>
          Política de Privacidad
        </Link>
      </footer>
    </main>
  )
}
