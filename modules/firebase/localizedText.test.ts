//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createLocalizationHelpers } from '@/modules/firebase/localizedText'

describe('parseLocalizedText', () => {
  const plPL = 'pl-PL'
  const pl = 'pl'
  const en = 'en'
  const de = 'de'
  const { parseLocalizedText } = createLocalizationHelpers('pl-PL')

  it('supports plain string', () => {
    expect(parseLocalizedText(en)).toBe(en)
  })

  describe('localized text object', () => {
    it('fallbacks to empty string when no localizations', () => {
      expect(parseLocalizedText({})).toBe('')
    })

    it('fallbacks to "en" if no matching client languages', () => {
      expect(parseLocalizedText({ de, en })).toBe(en)
    })

    it('fallbacks to any translation if there is no "en" available', () => {
      expect(parseLocalizedText({ de })).toBe(de)
    })

    it('resolves ISO-639-1 standard', () => {
      expect(parseLocalizedText({ pl, en })).toBe(pl)
    })

    it('prioritizes ISO-639-2 if exists', () => {
      expect(parseLocalizedText({ 'pl-PL': plPL, pl, en })).toBe(plPL)
    })
  })
})
