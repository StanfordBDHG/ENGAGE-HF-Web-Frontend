import { isObject } from 'lodash'
import { type LocalizedText } from '@/modules/firebase/models/medication'

// TODO: Implement actual locale check
const locale = 'en'
export const parseLocalizedText = (text: LocalizedText) =>
  isObject(text) ? text[locale] : text
