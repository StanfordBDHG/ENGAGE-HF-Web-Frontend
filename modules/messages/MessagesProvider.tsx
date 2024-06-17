//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { type ReactNode } from 'react'

interface MessagesProviderProps {
  children?: ReactNode
}

export const MessagesProvider = async ({ children }: MessagesProviderProps) => {
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}
