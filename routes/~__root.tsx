//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import '../modules/globals.css'
import { createRootRoute, Outlet, redirect } from '@tanstack/react-router'
import { NextIntlClientProvider } from 'next-intl'
import { useLayoutEffect } from 'react'
import { Helmet } from 'react-helmet'
import { auth } from '@/modules/firebase/app'
import { AuthProvider } from '@/modules/firebase/AuthProvider'
import messages from '@/modules/messages/translations/en.json'
import { ReactQueryClientProvider } from '@/modules/query/ReactQueryClientProvider'
import { routes } from '@/modules/routes'
import { lightTheme } from '@/packages/design-system/src'
import { Toaster } from '@/packages/design-system/src/components/Toaster'

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
          <Helmet defaultTitle="ENGAGE-HF" titleTemplate="%s - ENGAGE-HF" />
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
