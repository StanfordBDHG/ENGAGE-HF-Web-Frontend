//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { isObject } from 'lodash'
import { type LocalizedText } from '@/modules/firebase/models'
import { Nil } from '@/packages/design-system/src/utils/misc'
import { isNil } from 'es-toolkit'

const locale = 'en'

export const parseLocalizedText = (text: LocalizedText) =>
  isObject(text) ? text[locale] : text

export const parseNilLocalizedText = (text: Nil<LocalizedText>) =>
  isNil(text) ? null : parseLocalizedText(text)
