'use client'

import { Button } from '@/core/components/ui/button'
import useToastMessage from '@/core/hooks/useToastMessage'
import { actionIngresarSala } from '@/features/salas/actions'
import Form from 'next/form'
import { useActionState } from 'react'

export default function BtnIngresar ({
  codigoSala,
  jugadorId,
  withRedirect = true
}: {
  codigoSala: string,
  jugadorId: string,
  withRedirect?: boolean
}) {
  const [state, formAction, isPending] = useActionState(() => actionIngresarSala(codigoSala, jugadorId, withRedirect), null)

  useToastMessage(state)

  return (
    <Form action={formAction} className="flex gap-2">
      <Button size="sm" type="submit" disabled={isPending}>
        {isPending ? 'Uniendo...' : 'Unirme a la sala'}
      </Button>
    </Form>
  )
}
