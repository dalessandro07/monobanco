import { Avatar, AvatarFallback } from '@/core/components/ui/avatar'
import { Badge } from '@/core/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/core/components/ui/card'
import { getAllJugadoresPorSalaId } from '@/core/db/queries/select'
import type { SelectJugador, SelectSala } from '@/core/db/schema'
import { SALA_ESTADO } from '@/core/lib/constants'
import { formatDate, tiempoJuego } from '@/core/lib/utils'
import { getUser } from '@/features/auth/actions'
import BtnCerrar from '@/features/salas/components/sala/btn-cerrar'
import BtnEliminar from '@/features/salas/components/sala/btn-eliminar'

export default async function ListaItemSala ({
  sala
}: {
  sala: {
    salas_table: SelectSala
    jugadores_table: SelectJugador
  }
}) {
  const { data: user } = await getUser()
  const isOwner = user?.id === sala.salas_table.created_by

  const jugadores = await getAllJugadoresPorSalaId(sala.salas_table.id)

  const { minutosJuego, finalTextoJuego } = tiempoJuego(sala.salas_table.closed_at, sala.salas_table.created_at)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>
            Sala: {sala.salas_table.nombre}
            {isOwner && (
              <Badge className="ml-2" variant="outline">
                Código: {sala.salas_table.codigo_sala}
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Creada por: {sala.jugadores_table.nombre} el {formatDate(sala.salas_table.created_at)}
          </p>
          {sala.salas_table.closed_at && (
            <p className="text-sm text-muted-foreground">
              Cerrada por: {sala.jugadores_table.nombre} el {formatDate(sala.salas_table.closed_at)}
            </p>
          )}
          {minutosJuego > 0 && (
            <p className="text-sm text-muted-foreground">
              Tiempo de juego: {finalTextoJuego}
            </p>
          )}
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Estado:</p>
            <Badge variant={sala.salas_table.estado === SALA_ESTADO.ABIERTA ? 'default' : 'destructive'}>
              {sala.salas_table.estado}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-2'>
          <h4 className="text-sm font-semibold">Jugadores:</h4>

          <div className="space-y-2">
            {jugadores.map((jugador, index) => (
              <div key={jugador.jugadores_table.id} className="flex items-center gap-2">
                <p>{index + 1}. </p>
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">{jugador.jugadores_table.nombre.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {jugador.jugadores_table.nombre}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {sala.salas_table.estado === SALA_ESTADO.ABIERTA && user?.id && (
        <CardFooter className="flex justify-end">
          <BtnCerrar salaId={sala.salas_table.id} jugadorId={user?.id} isOwner={isOwner} />
        </CardFooter>
      )}

      {isOwner && sala.salas_table.estado === SALA_ESTADO.CERRADA && (
        <CardFooter className="flex justify-end">
          <BtnEliminar salaId={sala.salas_table.id} jugadorId={user?.id} />
        </CardFooter>
      )}
    </Card>
  )
}
