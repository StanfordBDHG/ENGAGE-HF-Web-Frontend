//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import type { UrlObject } from 'url'
import { toast } from '../../components/Toaster'

/**
 * Negates value
 * Useful for functional patterns and state callbacks
 * */
export const not = <T>(value: T) => !value

export type InitialState<T> = T | (() => T)

export type Nil<T> = T | null | undefined

export type Url = string | UrlObject

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

/**
 * Makes first letter uppercased
 * @example upperFirst("lorem ipsum") => "Lorem ipsum"
 * */
export const upperFirst = (value: string) =>
  `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`

/**
 * Generates array with specified length
 * */
export const times = <T>(length: number, callback: (index: number) => T) =>
  new Array(length).fill(undefined).map((_, index) => callback(index))
