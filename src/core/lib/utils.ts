import { diffMinutes, format, type DateInput, type Format } from '@formkit/tempo'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//* Vercel URL
export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
    'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`

  return `${url}/auth/callback`
}

//* Strings
export const randomName = (length: number) => {
  const shortName = uniqueNamesGenerator({
    dictionaries: [colors, animals],
    length,
    separator: ' ',
  })

  return shortName
}

export const formatAmount = (amount: number | string) => {
  const amountString = amount.toString() ?? '0'

  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amountString))
}

//* Dates
export const formatDate = (date: DateInput, formatStyle?: Format) => {
  let finalStyle: Format = {
    date: 'full',
    time: 'short',
  }

  if (formatStyle) {
    finalStyle = formatStyle
  }

  return format(date, finalStyle)
}

export const tiempoJuego = (closedAt: Date | null, createdAt: Date) => {
  if (!closedAt) {
    return {
      minutosJuego: 0,
      finalTextoJuego: 'Sin tiempo de juego'
    }
  }

  // Calcular horas de juego
  const minutosJuego = diffMinutes(closedAt, createdAt)
  const horasJuego = Math.floor(minutosJuego / 60)

  const finalTextoJuego = horasJuego > 0
    ? `${horasJuego} hora${horasJuego > 1 ? 's' : ''} y ${minutosJuego % 60} minuto${minutosJuego % 60 > 1 ? 's' : ''}`
    : 'Sin tiempo de juego'

  return {
    minutosJuego,
    finalTextoJuego
  }
}

//* Validaciones
export const isValidCodigoSala = (codigo: string) => {
  const regex = /^[a-zA-Z0-9]{6}$/
  return regex.test(codigo)
}
