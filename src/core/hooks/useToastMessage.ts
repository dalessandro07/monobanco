'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'

type TStateAction = {
  success: boolean
  message?: string
  data?: unknown
} | null

export default function useToastMessage (state: TStateAction) {
  useEffect(() => {
    if (state?.message) {
      toast[state.success ? 'success' : 'error'](state.message, {
        id: 'login-toast-message'
      })
    }
  }, [state])

  return null
}
