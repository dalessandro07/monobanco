'use client'

import { Button } from '@/core/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/core/components/ui/dialog'
import useToastMessage from '@/core/hooks/useToastMessage'
import { actionRetirarJugadorDeSala } from '@/features/salas/actions'
import { Loader2Icon, XIcon } from 'lucide-react'
import Form from 'next/form'
import { useActionState, useState } from 'react'

export default function BtnEliminarJugador ({
  salaId,
  jugadorId,
  jugadorNombre
}: {
  salaId: string,
  jugadorId: string,
  jugadorNombre: string
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [state, formAction, isPending] = useActionState(
    async () => {
      const result = await actionRetirarJugadorDeSala(salaId, jugadorId)
      if (result.success) {
        setIsDialogOpen(false)
      }
      return result
    },
    null
  )

  useToastMessage(state)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>      <DialogTrigger asChild>
      <Button
        size="sm"
        variant="ghost"
        type="button"
        title={`Eliminar a ${jugadorNombre} de la sala`}
        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-0.5 h-auto min-w-0"
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar a {jugadorNombre}</DialogTitle>
          <DialogDescription>
            ¿Estás seguro que deseas eliminar a <span className="font-medium">{jugadorNombre}</span> de la sala? <br /> Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row w-full items-center sm:justify-between">
          <Button
            className='grow'
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancelar
          </Button>

          <Form action={formAction} className="flex grow">
            <Button
              className='grow'
              variant="destructive"
              type="submit"
              disabled={isPending}
            >
              {isPending ? <Loader2Icon className='animate-spin mr-2' /> : null}
              Confirmar eliminación
            </Button>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
