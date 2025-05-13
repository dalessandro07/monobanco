import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

config({ path: '.env.local' })

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('No se encontró la variable de entorno DATABASE_URL.')
}

const client = postgres(DATABASE_URL, { prepare: false })
export const db = drizzle({ client })
