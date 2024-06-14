//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import type { User } from '@firebase/auth-types'
import { type FirebaseOptions } from 'firebase/app'
import { type Auth, onAuthStateChanged } from 'firebase/auth'
import { useEffect, useState } from 'react'

/**
 * Registers Auth Service Worker
 * */
export const useRegisterAuthServiceWorker = (
  firebaseOptions: FirebaseOptions,
) => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseOptions),
      )
      const serviceWorkerUrl = `/authServiceWorker.js?firebaseConfig=${serializedFirebaseConfig}`

      navigator.serviceWorker.register(serviceWorkerUrl).catch(() => {
        console.error(
          'Registering service worker failed. Make sure public/authServiceWorker.js exists',
        )
      })
    }
  }, [firebaseOptions])
}

/**
 * Returns currently authenticated user
 * null = no user is authenticated
 * undefined = initial state
 * */
export const useAuthUser = (auth: Auth) => {
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // @ts-expect-error Nested methods are not used anyway
      setUser(user)
    })
    return () => unsubscribe()
  }, [auth])

  return user
}
