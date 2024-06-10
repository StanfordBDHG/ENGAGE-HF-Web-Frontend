/* eslint-disable import/no-default-export */
import { getRequestConfig } from 'next-intl/server'
import { type AbstractIntlMessages } from 'use-intl'

export default getRequestConfig(async () => {
  const locale = 'en'
  const messages = (await import(`./messages/${locale}.json`)) as {
    default: AbstractIntlMessages
  }

  return {
    locale,
    messages: messages.default,
  }
})
