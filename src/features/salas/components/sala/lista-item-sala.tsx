import { Avatar, AvatarFallback } from '@/core/components/ui/avatar'
import { Badge } from '@/core/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/core/components/ui/card'
import { getAllJugadoresPorSalaId } from '@/core/db/queries/select'
import type { SelectSala } from '@/core/db/schema'
import { SALA_ESTADO } from '@/core/lib/constants'
import { formatAmount, formatDate, tiempoJuego } from '@/core/lib/utils'
import { getUser } from '@/features/auth/actions'
import BtnCerrar from '@/features/salas/components/sala/btn-cerrar'
import BtnEliminar from '@/features/salas/components/sala/btn-eliminar'
import BtnIngresar from '@/features/salas/components/sala/btn-ingresar'

export default async function ListaItemSala ({
  sala
}: {
  sala: SelectSala
}) {
  const { data: user } = await getUser()

  const jugadores = await getAllJugadoresPorSalaId(sala.id)
  const isOwner = user?.id === sala.created_by
  const isPlayer = jugadores.some((jugador) => jugador.id === user?.id)

  const { minutosJuego, finalTextoJuego } = tiempoJuego(sala.closed_at, sala.created_at)

  const creadorNombre = jugadores.find((jugador) => jugador.id === sala.created_by)?.nombre || 'Desconocido'

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <CardTitle>
            Sala: {sala.nombre}
            {isOwner && (
              <Badge className="ml-2" variant="outline">
                Código: {sala.codigo_sala}
              </Badge>
            )}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Creada por: {creadorNombre} el {formatDate(sala.created_at)}
          </p>
          {sala.closed_at && (
            <p className="text-sm text-muted-foreground">
              Cerrada por: {creadorNombre} el {formatDate(sala.closed_at)}
            </p>
          )}
          {minutosJuego > 0 && (
            <p className="text-sm text-muted-foreground">
              Tiempo de juego: {finalTextoJuego}
            </p>
          )}

          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Estado:</p>
              <Badge variant={sala.estado === SALA_ESTADO.ABIERTA ? 'default' : 'destructive'}>
                {sala.estado}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Visualización:</p>
              <Badge className='uppercase'>
                {sala.visualizacion}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-2'>
          <h4 className="text-sm font-semibold">Jugadores:</h4>          <div className="space-y-2">
            {jugadores.map((jugador, index) => (
              <div key={jugador.id} className="flex items-center gap-2">
                <p>{index + 1}. </p>
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs">{jugador.nombre.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">
                  {jugador.nombre}
                </span>
                {/* Mostrar saldo del jugador si está disponible */}
                <span className="text-xs text-muted-foreground ml-auto">
                  Saldo: {formatAmount(jugador.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {/* Si el jugador no está en la sala y está abierta, se muestra el botón de ingresar a la sala */}
      {!isPlayer && sala.estado === SALA_ESTADO.ABIERTA && user?.id && (
        <CardFooter className="flex justify-end">
          <BtnIngresar codigoSala={sala.codigo_sala} jugadorId={user?.id} />
        </CardFooter>
      )}

      {/* Si el jugador es creador o participante de la sala, se muestra el botón de cerrar o abandonar sala */}
      {(isOwner || isPlayer) && sala.estado === SALA_ESTADO.ABIERTA && (
        <CardFooter className="flex justify-end">
          <BtnCerrar salaId={sala.id} jugadorId={user?.id} isOwner={isOwner} />
        </CardFooter>
      )}

      {/* Si el jugador es el creador de la sala y la sala está cerrada, se muestra el botón de eliminar sala */}
      {isOwner && sala.estado === SALA_ESTADO.CERRADA && (
        <CardFooter className="flex justify-end">
          <BtnEliminar salaId={sala.id} jugadorId={user?.id} />
        </CardFooter>
      )}
    </Card>
  )
}
