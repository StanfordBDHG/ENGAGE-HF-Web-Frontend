//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { toast } from '../../components/Toaster'

/**
 * Negates value
 * Useful for functional patterns and state callbacks
 * */
export const not = <T>(value: T) => !value

export type InitialState<T> = T | (() => T)

export type Nil<T> = T | null | undefined

/**
 * Make some fields in the object partial
 *
 * @example
 * PartialSome<{ a: string, b: string, c: string }, 'a'> => { a?: string, b: string, c: string }
 * */
export type PartialSome<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Handles copying to clipboard and show confirmation toast
 * */
export const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    toast('Copied to clipboard')
  } catch (error) {
    console.log('Copying failed')
  }
}
