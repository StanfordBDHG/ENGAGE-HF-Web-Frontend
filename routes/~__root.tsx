//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import '../app/globals.css'
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { NextIntlClientProvider } from 'next-intl'
import { useLayoutEffect } from 'react'
import { ReactQueryClientProvider } from '@/app/ReactQueryClientProvider'
import { AuthProvider } from '@/modules/firebase/AuthProvider'
import { auth } from '@/modules/firebase/guards'
import messages from '@/modules/messages/translations/en.json'
import { routes } from '@/modules/routes'
import { lightTheme } from '@/packages/design-system/src'
import { Toaster } from '@/packages/design-system/src/components/Toaster'

/**
 * TODO
 * metadata
 * favicon
 * */

const Root = () => {
  useLayoutEffect(() => {
    Object.entries(lightTheme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value)
    })
  }, [])

  return (
    <AuthProvider>
      <ReactQueryClientProvider>
        <NextIntlClientProvider
          locale="en"
          timeZone="Europe/Warsaw"
          messages={messages}
        >
          <Outlet />
          <Toaster />
        </NextIntlClientProvider>
      </ReactQueryClientProvider>
    </AuthProvider>
  )
}

export const Route = createRootRoute({
  component: Root,
  beforeLoad: async ({ location }) => {
    await auth.authStateReady()
    const user = auth.currentUser
    const isSignIn = location.pathname === routes.signIn
    if (isSignIn && user) {
      throw redirect({ to: routes.home })
    } else if (!isSignIn && !user) {
      throw redirect({ to: routes.signIn })
    }
  },
})
