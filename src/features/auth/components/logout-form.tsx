'use client'

import { Button } from '@/core/components/ui/button'
import useToastMessage from '@/core/hooks/useToastMessage'
import { logout } from '@/features/auth/actions'
import Form from 'next/form'
import { useActionState } from 'react'

export default function LogoutForm () {
  const [state, formAction, isPending] = useActionState(logout, null)

  useToastMessage(state)

  return (
    <Form action={formAction}>
      <Button variant='destructive' type='submit' disabled={isPending}>
        {isPending ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </Button>
    </Form>
  )
}
