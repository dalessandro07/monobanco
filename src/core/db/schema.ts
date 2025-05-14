import { JUGADOR_SALA_ESTADO, SALA_ESTADO, SALA_VISUALIZACION, TRANSACCION_TIPO } from '@/core/lib/constants'
import { sql } from 'drizzle-orm'
import { check, integer, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core'

//! Tablas para MonoBanco (Banca electrónica para Monopoly)

//* 1. Jugadores
export const jugadoresTable = pgTable('jugadores_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  email: text('email').notNull().unique(),
  created_at: timestamp('created_at').notNull().defaultNow(),
})

//* 2. Salas
export const salasTable = pgTable('salas_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  nombre: text('nombre').notNull(),
  codigo_sala: text('codigo_sala').notNull().unique().$defaultFn(() => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    return randomCode
  }),
  visualizacion: text('visualizacion', { enum: [SALA_VISUALIZACION.PUBLICA, SALA_VISUALIZACION.PRIVADA] }).notNull().default(SALA_VISUALIZACION.PUBLICA),
  estado: text('estado', { enum: [SALA_ESTADO.ABIERTA, SALA_ESTADO.CERRADA] }).notNull().default(SALA_ESTADO.ABIERTA),
  created_by: uuid('created_by').references(() => jugadoresTable.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  closed_at: timestamp('closed_at').$type<Date | null>().default(null),
})

//* 3. Jugadores de sala + saldo
export const jugadoresSalasTable = pgTable('jugadores_salas_table', {
  sala_id: uuid('sala_id').references(() => salasTable.id, { onDelete: 'cascade' }).notNull(),
  jugador_id: uuid('jugador_id').references(() => jugadoresTable.id).notNull(),
  balance: integer('balance').notNull().default(1500),
  estado: integer('estado').notNull().default(JUGADOR_SALA_ESTADO.ACTIVO),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => [
  primaryKey({ columns: [table.sala_id, table.jugador_id] }),
  check("balance_check1", sql`${table.balance} >= 0`),
])

//* 4. Transacciones
// 1. DEPOSITO-BANCO: Deposito del banco a un jugador
// 2. RETIRO-BANCO: Retiro de un jugador al banco
// 3. TRANSFERENCIA: Transferencia de dinero entre dos jugadores
export const transaccionesTable = pgTable('transacciones_table', {
  id: uuid('id').primaryKey().defaultRandom(),
  sala_id: uuid('sala_id').references(() => salasTable.id),
  jugador_origen_id: uuid('jugador_origen_id').notNull().references(() => jugadoresTable.id),
  jugador_destino_id: uuid('jugador_destino_id').references(() => jugadoresTable.id),
  monto: integer('monto').notNull(),
  tipo: text('tipo', { enum: [TRANSACCION_TIPO.DEPOSITO_BANCO, TRANSACCION_TIPO.RETIRO_BANCO, TRANSACCION_TIPO.TRANSFERENCIA] }).default(TRANSACCION_TIPO.TRANSFERENCIA).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})

export type InsertJugador = typeof jugadoresTable.$inferInsert
export type SelectJugador = typeof jugadoresTable.$inferSelect

export type InsertSala = typeof salasTable.$inferInsert
export type SelectSala = typeof salasTable.$inferSelect

export type SelectJugadoresSalas = typeof jugadoresSalasTable.$inferSelect
export type InsertJugadoresSalas = typeof jugadoresSalasTable.$inferInsert

export type SelectTransacciones = typeof transaccionesTable.$inferSelect
export type InsertTransacciones = typeof transaccionesTable.$inferInsert
