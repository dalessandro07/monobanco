'use client'

import { createClient } from '@/core/lib/supabase/client'
import google, { CredentialResponse } from 'google-one-tap'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useEffect } from 'react'
import { toast } from 'sonner'

const OneTapComponent = () => {
  const supabase = createClient()
  const router = useRouter()

  // generate nonce to use for google id token sign-in
  const generateNonce = async (): Promise<string[]> => {
    const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
    const encoder = new TextEncoder()
    const encodedNonce = encoder.encode(nonce)
    const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return [nonce, hashedNonce]
  }

  useEffect(() => {
    const initializeGoogleOneTap = () => {
      window.addEventListener('load', async () => {
        const [nonce, hashedNonce] = await generateNonce()

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          toast.error(`Error al obtener la sesión: ${error.message}`)
        }

        if (data.session) {
          router.push('/')
          return
        }

        google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          callback: async (response: CredentialResponse) => {
            try {
              // send id token returned in response.credential to supabase
              const { error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.credential,
                nonce,
              })

              if (error) throw error

              // redirect to protected page
              router.push('/')
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Error desconocido'
              toast.error(`Error al iniciar sesión: ${message}`)
            }
          },
          nonce: hashedNonce,
          // with chrome's removal of third-party cookies, we need to use FedCM instead (https://developers.google.com/identity/gsi/web/guides/fedcm-migration)
          use_fedcm_for_prompt: true,
        })
        google.accounts.id.prompt() // Display the One Tap UI
      })
    }

    initializeGoogleOneTap()

    return () => window.removeEventListener('load', initializeGoogleOneTap)
  }, [router, supabase.auth])

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" />
      <div id="oneTap" className="fixed top-0 right-0 z-[100]" />
    </>
  )
}

export default OneTapComponent
