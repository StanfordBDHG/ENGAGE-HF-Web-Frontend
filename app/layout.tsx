//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import '@stanfordbdhg/design-system/main.css'
import { themeToCSSVariables, lightTheme } from '@stanfordbdhg/design-system'

export const metadata: Metadata = {
  title: 'ENGAGE-HF Web Frontend',
  description: 'Stanford Biodesign Digital Health ENGAGE-HF Web Frontend',
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <style>
          {`
          :root { ${themeToCSSVariables(lightTheme)} }
          `}
        </style>
      </head>

      <body>{children}</body>
    </html>
  )
}
