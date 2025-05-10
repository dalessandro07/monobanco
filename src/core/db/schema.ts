import { sql } from 'drizzle-orm'
import { check, pgTable, primaryKey, real, text, timestamp, uuid } from 'drizzle-orm/pg-core'

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
  visualizacion: text('visualizacion', { enum: ['PUBLICA', 'PRIVADA'] }).notNull().default('PUBLICA'),
  estado: text('estado', { enum: ['ABIERTA', 'CERRADA'] }).notNull().default('ABIERTA'),
  created_by: uuid('created_by').references(() => jugadoresTable.id),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
  closed_at: timestamp('closed_at').$type<Date | null>().default(null),
})

//* 3. Jugadores de sala + saldo
export const jugadoresSalasTable = pgTable('jugadores_salas_table', {
  sala_id: uuid('sala_id').references(() => salasTable.id, { onDelete: 'cascade' }),
  jugador_id: uuid('jugador_id').references(() => jugadoresTable.id),
  balance: real('balance').notNull().default(0.0),
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
  monto: real('monto').notNull(),
  tipo: text('tipo', { enum: ['DEPOSITO-BANCO', 'RETIRO-BANCO', 'TRANSFERENCIA'] }).notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow().$onUpdate(() => new Date()),
})

export type InsertUsuario = typeof jugadoresTable.$inferInsert
export type SelectUsuario = typeof jugadoresTable.$inferSelect

export type InsertSala = typeof salasTable.$inferInsert
export type SelectSala = typeof salasTable.$inferSelect
