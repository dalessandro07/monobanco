'use client'

import { Button } from '@/core/components/ui/button'
import useToastMessage from '@/core/hooks/useToastMessage'
import { actionEliminarSala } from '@/features/salas/actions'
import Form from 'next/form'
import { useActionState } from 'react'

export default function BtnEliminar ({ salaId, jugadorId }: { salaId: string, jugadorId: string }) {
  const [state, formAction, isPending] = useActionState(() => actionEliminarSala(salaId, jugadorId), null)

  useToastMessage(state)

  return (
    <Form action={formAction} className="flex gap-2">
      <Button size="sm" variant="destructive" type="submit" disabled={isPending}>
        {isPending ? 'Eliminando...' : 'Eliminar sala'}
      </Button>
    </Form>
  )
}
