'use client'

import { useEffect } from 'react'
import { firebaseConfig } from '../modules/firebase/config'

export const RegisterWorker = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig),
      )
      const serviceWorkerUrl = `/authServiceWorker.js?firebaseConfig=${serializedFirebaseConfig}`

      void navigator.serviceWorker.register(serviceWorkerUrl)
    }
  }, [])

  return null
}
