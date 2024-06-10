//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { type User } from '@firebase/auth-types'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { auth } from '../modules/firebase/clientApp'
import { firebaseConfig } from '../modules/firebase/config'
import { routes } from '../modules/routes'

export const RegisterWorker = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(
        JSON.stringify(firebaseConfig),
      )
      const serviceWorkerUrl = `/authServiceWorker.js?firebaseConfig=${serializedFirebaseConfig}`

      void navigator.serviceWorker.register(serviceWorkerUrl)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // @ts-expect-error Nested methods are not used anyway
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    // TODO: This is not ideal, results with double redirect. To investigate
    const isSignIn = window.location.pathname === '/sign-in'
    if (isSignIn && user) {
      window.location.assign(routes.home)
    } else if (!isSignIn && user === null) {
      window.location.assign(routes.signIn)
    }
  }, [router, user])

  return null
}
