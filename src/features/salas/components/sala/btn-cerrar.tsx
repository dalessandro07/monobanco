'use client'

import { Button } from '@/core/components/ui/button'
import useToastMessage from '@/core/hooks/useToastMessage'
import { actionAbandonarSala, actionCerrarSala } from '@/features/salas/actions'
import { LogOutIcon, Trash2Icon } from 'lucide-react'
import Form from 'next/form'
import { useActionState } from 'react'

interface IBtnCerrarProps {
  salaId: string
  jugadorId: string
  isOwner: boolean
}

export default function BtnCerrar ({
  salaId,
  jugadorId,
  isOwner
}: IBtnCerrarProps) {
  let handleAction = () => actionCerrarSala(salaId, jugadorId)

  if (!isOwner) {
    handleAction = () => actionAbandonarSala(salaId, jugadorId)
  }

  const [state, formAction, isPending] = useActionState(handleAction, null)

  useToastMessage(state)

  const btnText = isOwner ? 'Cerrar sala' : 'Abandonar sala'
  const btnTextPending = isOwner ? 'Cerrando...' : 'Abandonando...'

  return (
    <Form action={formAction} className="flex gap-2">
      <Button size="sm" variant="destructive" type="submit" disabled={isPending}>
        {isOwner ? <Trash2Icon className="w-4 h-4" /> : <LogOutIcon className="w-4 h-4" />}
        {isPending ? btnTextPending : btnText}
      </Button>
    </Form>
  )
}
