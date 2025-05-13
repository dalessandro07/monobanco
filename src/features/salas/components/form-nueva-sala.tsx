'use client'

import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select"
import useToastMessage from '@/core/hooks/useToastMessage'
import { SALA_VISUALIZACION } from '@/core/lib/constants'
import { actionCrearSala } from '@/features/salas/actions'
import Form from 'next/form'
import { useActionState } from 'react'

export default function FormNuevaSala ({ idJugador }: { idJugador: string }) {
  const [state, formAction, isPending] = useActionState(actionCrearSala, null)

  useToastMessage(state)

  return (
    <article>
      <p>Crear una nueva sala de juego.</p>

      <Form className='flex flex-col gap-2' action={formAction}>
        <Input type='text' required name='nombre' placeholder='Nombre de la sala' />
        <Select required name='visualizacion' defaultValue={SALA_VISUALIZACION.PUBLICA}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Visualización (Pública o Privada)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={SALA_VISUALIZACION.PUBLICA}>Pública</SelectItem>
            <SelectItem value={SALA_VISUALIZACION.PRIVADA}>Privada</SelectItem>
          </SelectContent>
        </Select>

        {state?.data && (
          <p>
            Código de sala: {state.data.codigo_sala}
          </p>
        )}
        <Input type='hidden' name='jugador_id' value={idJugador} />

        <Button type='submit' disabled={isPending}>
          {isPending ? 'Creando sala...' : 'Crear sala'}
        </Button>
      </Form>
    </article>
  )
}
