//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
/* eslint-disable import/no-default-export */
import { getRequestConfig } from 'next-intl/server'
import { type AbstractIntlMessages } from 'use-intl'

export default getRequestConfig(async () => {
  const locale = 'en'
  const messages = (await import(`./translations/${locale}.json`)) as {
    default: AbstractIntlMessages
  }

  return {
    locale,
    messages: messages.default,
  }
})
