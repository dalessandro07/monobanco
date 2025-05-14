export const APP_NAME = "MonoBanco"
export const APP_DESCRIPTION = "Aplicación web para gestionar el dinero de una partida de Monopoly."
export const APP_EMAIL = "dev.alessandro@outlook.com"

//* BASE DE DATOS
export const JUGADORES_TABLE_NAME = "jugadores_table"
export const SALAS_TABLE_NAME = "salas_table"
export const JUGADORES_SALAS_TABLE_NAME = "jugadores_salas_table"
export const TRANSACCIONES_TABLE_NAME = "transacciones_table"

//* SALAS
export enum SALA_ESTADO {
  ABIERTA = 'ABIERTA',
  CERRADA = 'CERRADA'
}

export enum SALA_VISUALIZACION {
  PUBLICA = 'PUBLICA',
  PRIVADA = 'PRIVADA'
}

export enum TRANSACCION_TIPO {
  DEPOSITO_BANCO = 'DEPOSITO-BANCO',
  RETIRO_BANCO = 'RETIRO-BANCO',
  TRANSFERENCIA = 'TRANSFERENCIA'
}

export enum JUGADOR_SALA_ESTADO {
  ACTIVO = 1,
  INACTIVO = 0
}

//* JUEGO
export const MONTO_INICIAL_BANCO = 200_000
export const MONTO_INICIAL_JUGADOR = 1500
