'use client'

import OneTapComponent from '@/core/components/one-tap-google'
import { Button } from '@/core/components/ui/button'
import useToastMessage from '@/core/hooks/useToastMessage'
import { login } from '@/features/auth/actions'
import Form from 'next/form'
import { useActionState } from 'react'

export default function LoginForm () {
  const [state, formAction, isPending] = useActionState(login, null)

  useToastMessage(state)

  return (
    <Form action={formAction}>
      <Button type='submit' disabled={isPending}>
        {isPending ? 'Ingresando...' : 'Ingresar con Google'}
      </Button>
      <OneTapComponent />
    </Form>
  )
}
