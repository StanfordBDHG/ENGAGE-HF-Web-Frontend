//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { not } from './misc'

describe('not', () => {
  it('negates value', () => {
    expect(not(true)).toBe(false)
    expect(not(false)).toBe(true)
    expect(not('')).toBe(true)
    expect(not(5)).toBe(false)
  })
})
