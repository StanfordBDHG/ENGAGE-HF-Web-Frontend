import { isObject } from 'lodash'
import { type LocalizedText } from '@/modules/firebase/models/medication'

const locale = 'en'

export const parseLocalizedText = (text: LocalizedText) =>
  isObject(text) ? text[locale] : text
