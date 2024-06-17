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
