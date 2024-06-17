import { NextIntlClientProvider } from 'next-intl'
import { type ReactNode } from 'react'
import messages from '../../../../modules/messages/translations/en.json'

interface ProvidersProps {
  children?: ReactNode
}

export const Providers = ({ children }: ProvidersProps) => (
  <NextIntlClientProvider messages={messages} locale="en">
    {children}
  </NextIntlClientProvider>
)
