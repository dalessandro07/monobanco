'use client'

import { Button } from '@/core/components/ui/button'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select"
import type { SelectJugador } from '@/core/db/schema'
import useToastMessage from '@/core/hooks/useToastMessage'
import { actionCrearTransaccion } from '@/features/transacciones/actions'
import { BanknoteArrowUpIcon } from 'lucide-react'
import Form from 'next/form'
import { startTransition, useActionState } from 'react'

export default function FormNuevaTransaccion ({
  jugadoresPorSala,
  jugadorId,
  salaId
}: {
  jugadoresPorSala: SelectJugador[]
  jugadorId?: string
  salaId: string
}) {
  const [state, formAction, isPending] = useActionState(actionCrearTransaccion, null)
  useToastMessage(state)

  // Obtener los jugadores diferentes al usuario que está creando la transacción
  const jugadoresDestino = jugadoresPorSala.filter((jugador) => jugador.id !== jugadorId)

  // Función para manejar la acción de crear una transacción
  function handleAction (formData: FormData) {
    formData.append('salaId', salaId)

    startTransition(() => {
      formAction(formData)
    })
  }

  return (
    <Form className='sticky bottom-0 bg-background p-2 border-t shadow' action={handleAction}>
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">Nueva transacción</h2>

        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="salaId" className="text-sm font-semibold">Jugador</Label>
            {jugadoresDestino.length > 0 ? (
              <Select name='jugadorDestinoId'>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder="Jugador" />
                </SelectTrigger>
                <SelectContent>
                  {jugadoresDestino.map((jugador) => (
                    <SelectItem key={jugador.id} value={jugador.id}>
                      {jugador.nombre}
                    </SelectItem>
                  ))
                  }
                </SelectContent>
              </Select>
            ) : (
              <p className="text-sm text-gray-500">No hay jugadores disponibles</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="monto" className="text-sm font-semibold">Monto</Label>
            <Input type="number" name="monto" id="monto" placeholder="Monto" min={1} />
          </div>
        </div>

        <Button type="submit" disabled={isPending}>
          <BanknoteArrowUpIcon />
          {isPending ? 'Enviando...' : 'Enviar dinero'}
        </Button>
      </div>
    </Form>
  )
}
