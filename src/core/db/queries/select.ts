import { db } from '@/core/db'
import { jugadoresSalasTable, jugadoresTable, salasTable, transaccionesTable } from '@/core/db/schema'
import { JUGADOR_SALA_ESTADO, SALA_ESTADO, SALA_VISUALIZACION } from '@/core/lib/constants'
import { and, desc, eq, exists, or } from 'drizzle-orm'

//! SALAS
export async function getSalaPorId (salaId: string) {
  const sala = await db.select()
    .from(salasTable)
    .where(eq(salasTable.id, salaId))
    .limit(1)

  return sala[0]
}

export async function getSalaPorCodigo (codigoSala: string) {
  const sala = await db.select()
    .from(salasTable)
    .where(eq(salasTable.codigo_sala, codigoSala))
    .limit(1)

  return sala[0]
}

export async function getAllSalasActivas () {
  // Usamos SALA_ESTADO y SALA_VISUALIZACION para mayor claridad y consistencia
  const salas = await db.select({
    sala: salasTable,
    creador: {
      id: jugadoresTable.id,
      nombre: jugadoresTable.nombre
    }
  })
    .from(salasTable)
    .innerJoin(jugadoresTable, eq(salasTable.created_by, jugadoresTable.id))
    .where(
      and(
        eq(salasTable.estado, SALA_ESTADO.ABIERTA),
        eq(salasTable.visualizacion, SALA_VISUALIZACION.PUBLICA)
      )
    )
    .orderBy(desc(salasTable.created_at))
    .limit(20) // Limitamos para mejorar el rendimiento

  return salas
}

export async function getAllSalasAbiertasPorJugadorId (jugadorId: string) {
  // Salas públicas abiertas
  const esSalaPublica = and(
    eq(salasTable.estado, SALA_ESTADO.ABIERTA),
    eq(salasTable.visualizacion, SALA_VISUALIZACION.PUBLICA)
  )

  // Salas privadas que el usuario creó
  const esSalaPrivadaCreada = and(
    eq(salasTable.estado, SALA_ESTADO.ABIERTA),
    eq(salasTable.visualizacion, SALA_VISUALIZACION.PRIVADA),
    eq(salasTable.created_by, jugadorId)
  )

  // Salas privadas donde el usuario es participante
  const esSalaPrivadaParticipante = and(
    eq(salasTable.estado, SALA_ESTADO.ABIERTA),
    eq(salasTable.visualizacion, SALA_VISUALIZACION.PRIVADA),
    exists(
      db.select()
        .from(jugadoresSalasTable)
        .where(
          and(
            eq(jugadoresSalasTable.sala_id, salasTable.id),
            eq(jugadoresSalasTable.jugador_id, jugadorId)
          )
        )
    )
  )

  // Consulta optimizada que combina todos los casos en una sola consulta
  const salas = await db
    .select()
    .from(salasTable)
    .where(
      or(
        esSalaPublica,
        esSalaPrivadaCreada,
        esSalaPrivadaParticipante
      )
    )
    .orderBy(desc(salasTable.created_at))
    .limit(10)

  return salas
}

export async function getAllSalasCerradasPorJugadorId (jugadorId: string) {
  // Salas cerradas creadas por el usuario
  const esSalaCerradaCreada = and(
    eq(salasTable.estado, SALA_ESTADO.CERRADA),
    eq(salasTable.created_by, jugadorId)
  )

  // Salas cerradas donde el usuario participó
  const esSalaCerradaParticipante = and(
    eq(salasTable.estado, SALA_ESTADO.CERRADA),
    exists(
      db.select()
        .from(jugadoresSalasTable)
        .where(
          and(
            eq(jugadoresSalasTable.sala_id, salasTable.id),
            eq(jugadoresSalasTable.jugador_id, jugadorId)
          )
        )
    )
  )

  // Consulta optimizada que combina ambos casos
  const salas = await db
    .select()
    .from(salasTable)
    .where(
      or(
        esSalaCerradaCreada,
        esSalaCerradaParticipante
      )
    )
    .orderBy(desc(salasTable.created_at))
    .limit(10)

  return salas
}

export async function getJugadorTieneSalaActiva (jugadorId: string) {
  // Primero, obtener el ID de la sala más reciente donde el usuario participa
  const salaActiva = await db
    .select({ id: salasTable.id })
    .from(salasTable)
    .innerJoin(jugadoresSalasTable, eq(salasTable.id, jugadoresSalasTable.sala_id))
    .where(and(
      eq(jugadoresSalasTable.jugador_id, jugadorId),
      eq(jugadoresSalasTable.estado, JUGADOR_SALA_ESTADO.ACTIVO),
      eq(salasTable.estado, SALA_ESTADO.ABIERTA)
    ))
    .orderBy(desc(salasTable.created_at))
    .limit(1)

  return Boolean(salaActiva[0])
}

//! JUGADORES
export async function getCreadorDeSalaPorId (salaId: string) {
  const creador = await db.select({
    id: jugadoresTable.id,
    nombre: jugadoresTable.nombre,
    email: jugadoresTable.email
  })
    .from(salasTable)
    .innerJoin(jugadoresTable, eq(salasTable.created_by, jugadoresTable.id))
    .where(eq(salasTable.id, salaId))
    .limit(1)

  return creador[0]
}

export async function getJugadorPorId (jugadorId: string) {
  const jugador = await db.select()
    .from(jugadoresTable)
    .where(eq(jugadoresTable.id, jugadorId))
    .limit(1)

  return jugador[0]
}

//! JUGADORES y SALAS
export async function getAllJugadoresActivosPorSalaId (salaId: string) {
  // Optimizando la selección para traer solo los campos necesarios
  const jugadores = await db.select({
    id: jugadoresTable.id,
    nombre: jugadoresTable.nombre,
    email: jugadoresTable.email,
    balance: jugadoresSalasTable.balance,
    created_at: jugadoresSalasTable.created_at,
  })
    .from(jugadoresSalasTable)
    .innerJoin(jugadoresTable, eq(jugadoresSalasTable.jugador_id, jugadoresTable.id))
    .where(
      and(
        eq(jugadoresSalasTable.sala_id, salaId),
        eq(jugadoresSalasTable.estado, JUGADOR_SALA_ESTADO.ACTIVO)
      )
    )
    .orderBy(desc(jugadoresSalasTable.created_at))

  return jugadores
}

export async function getAllJugadoresPorSalaId (salaId: string) {
  // Optimizando la selección para traer solo los campos necesarios
  const jugadores = await db.select({
    id: jugadoresTable.id,
    nombre: jugadoresTable.nombre,
    email: jugadoresTable.email,
    balance: jugadoresSalasTable.balance,
    estado: jugadoresSalasTable.estado,
    created_at: jugadoresSalasTable.created_at,
  })
    .from(jugadoresSalasTable)
    .innerJoin(jugadoresTable, eq(jugadoresSalasTable.jugador_id, jugadoresTable.id))
    .where(
      and(
        eq(jugadoresSalasTable.sala_id, salaId)
      )
    )
    .orderBy(desc(jugadoresSalasTable.created_at))

  return jugadores
}

export async function getJugadorPorSalaId (salaId: string, jugadorId: string) {
  const jugador = await db.select()
    .from(jugadoresSalasTable)
    .where(
      and(
        eq(jugadoresSalasTable.sala_id, salaId),
        eq(jugadoresSalasTable.jugador_id, jugadorId)
      )
    )
    .limit(1)

  return jugador[0]
}

//! TRANSACCIONES
export async function getTransaccionesPorJugadorId (jugadorId: string) {
  const transacciones = await db
    .select()
    .from(transaccionesTable)
    .where(
      or(
        eq(transaccionesTable.jugador_origen_id, jugadorId),
        eq(transaccionesTable.jugador_destino_id, jugadorId)
      )
    )
    .orderBy(desc(transaccionesTable.created_at))

  return transacciones
}

export async function getTransaccionesPorSalaId (salaId: string) {
  const transacciones = await db
    .select()
    .from(transaccionesTable)
    .where(eq(transaccionesTable.sala_id, salaId))
    .orderBy(desc(transaccionesTable.created_at))

  return transacciones
}
