//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { routes } from '@/modules/routes'
import {
  useAuthUser,
  useRegisterAuthServiceWorker,
} from '@stanfordbdhg/design-system/modules/auth/hooks'
import { auth } from './clientApp'
import { firebaseConfig } from './config'

export const AuthProvider = () => {
  const router = useRouter()
  const user = useAuthUser(auth)

  useRegisterAuthServiceWorker(firebaseConfig)

  useEffect(() => {
    const isSignIn = window.location.pathname === routes.signIn
    if (isSignIn && user) {
      window.location.assign(routes.home)
    } else if (!isSignIn && user === null) {
      window.location.assign(routes.signIn)
    }
  }, [router, user])

  return null
}
