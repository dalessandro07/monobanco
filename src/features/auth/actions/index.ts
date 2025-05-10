'use server'

import { createClient } from '@/core/lib/supabase/server'
import { getURL } from '@/core/lib/utils'
import type { User } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

export async function login () {
  let callbackUrl = getURL()

  try {
    const supabase = await createClient()
    const provider = 'google'

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl,
        queryParams: {
          prompt: 'consent',
          access_type: 'offline'
        }
      },
    })

    if (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`)
    }

    if (data.url) {
      callbackUrl = data.url
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return {
      success: false,
      message,
    }
  } finally {
    redirect(callbackUrl)
  }
}

export async function logout () {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(`Error al cerrar sesión: ${error.message}`)
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return {
      success: false,
      message,
    }
  } finally {
    redirect('/login')
  }
}

export async function getUser () {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      throw new Error(`Error al obtener el usuario: ${error.message}`)
    }

    return {
      success: true,
      data: user as User,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error desconocido'
    return {
      success: false,
      message,
    }
  }
}
