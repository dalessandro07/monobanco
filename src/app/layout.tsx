import Header from '@/core/components/layout/header'
import { Toaster } from '@/core/components/ui/sonner'
import { APP_DESCRIPTION, APP_NAME } from '@/core/lib/constants'
import type { Metadata } from "next"
import MonopolyFont from 'next/font/local'
import "./globals.css"

const monopolyFont = MonopolyFont({
  src: [
    {
      path: './fonts/monopoly/Monopoly Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/monopoly/Monopoly Bold.ttf',
      weight: '700',
      style: 'normal',
    }
  ]
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      </head>
      <body className={`${monopolyFont.className}`}>
        <div className='flex flex-col gap-5 p-5 min-h-dvh'>
          <Header />

          {children}

          <footer className='flex flex-col items-center justify-center'>
            <p className='text-xs text-muted-foreground'>Desarrollador por AR</p>
          </footer>
        </div>

        <Toaster richColors position='top-center' />
      </body>
    </html>
  )
}
