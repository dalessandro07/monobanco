import LoginForm from '@/features/auth/components/login-form'

export default function LoginPage () {
  return (
    <main className='flex flex-col grow gap-5 items-center justify-center'>
      <h1 className='text-2xl font-bold text-balance'>Inicia sesión para empezar a jugar</h1>
      <LoginForm />
    </main>
  )
}
