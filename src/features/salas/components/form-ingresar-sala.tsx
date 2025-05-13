'use client'

import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import useToastMessage from '@/core/hooks/useToastMessage'
import { actionIngresarSala } from '@/features/salas/actions'
import Form from 'next/form'
import { useActionState, useState } from 'react'

export default function FormIngresarSala ({ idJugador }: { idJugador: string }) {
  const [codigoSala, setCodigoSala] = useState('')

  const [state, formAction, isPending] = useActionState(() => actionIngresarSala(codigoSala, idJugador), null)

  useToastMessage(state)

  return (
    <article>
      <p>Ingresar a una sala</p>

      <Form className='flex flex-col gap-2' action={formAction}>
        <Input
          type='text'
          required
          name='codigo_sala'
          placeholder='Código de la sala'
          value={codigoSala}
          onChange={(e) => setCodigoSala(e.target.value)} />

        <Button type='submit' disabled={isPending}>
          {isPending ? 'Ingresando sala...' : 'Ingresar sala'}
        </Button>
      </Form>
    </article>
  )
}
