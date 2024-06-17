//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import type { ReactNode } from 'react'
import '@stanfordbdhg/design-system/main.css'
import { themeToCSSVariables, lightTheme } from '@stanfordbdhg/design-system'
import './globals.css'
import { AuthProvider } from '../modules/firebase/AuthProvider'

export const metadata: Metadata = {
  title: 'ENGAGE-HF Web Frontend',
  description: 'Stanford Biodesign Digital Health ENGAGE-HF Web Frontend',
}

export const dynamic = 'force-dynamic'

interface RootLayoutProps {
  children: ReactNode
}

const RootLayout = async ({ children }: RootLayoutProps) => {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <head>
        <style>
          {`
          :root { ${themeToCSSVariables(lightTheme)} }
          `}
        </style>
      </head>
      <body>
        <AuthProvider />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
