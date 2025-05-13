'use client'

import { Button } from '@/core/components/ui/button'
import useToastMessage from '@/core/hooks/useToastMessage'
import { SALA_VISUALIZACION } from '@/core/lib/constants'
import { actionCambiarVisualizacionSala } from '@/features/salas/actions'
import { EyeClosedIcon, EyeIcon } from 'lucide-react'
import Form from 'next/form'
import { useActionState } from 'react'

export default function BtnCambiarVisualizacion (
  {
    salaId,
    visualizacion
  }: {
    salaId: string
    visualizacion: SALA_VISUALIZACION
  }) {
  const visualizacionNueva = visualizacion === SALA_VISUALIZACION.PUBLICA
    ? SALA_VISUALIZACION.PRIVADA
    : SALA_VISUALIZACION.PUBLICA

  const [state, formAction, isPending] = useActionState(() => actionCambiarVisualizacionSala(salaId, visualizacionNueva), null)

  useToastMessage(state)

  if (!salaId) return null

  return (
    <Form action={formAction} className="flex items-center">
      <Button size='icon' variant='ghost' disabled={isPending}>
        {visualizacion === SALA_VISUALIZACION.PUBLICA ? (
          <EyeIcon className="w-4 h-4 text-muted-foreground" />
        ) : (
          <EyeClosedIcon className="w-4 h-4 text-muted-foreground" />
        )}
        <span className="sr-only">
          Cambiar visualización de sala
        </span>
      </Button>
    </Form>
  )
}
