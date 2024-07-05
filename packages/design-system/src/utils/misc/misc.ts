//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

/**
 * Negates value
 * Useful for functional patterns and state callbacks
 * */
export const not = <T>(value: T) => !value

export type InitialState<T> = T | (() => T)

export type Nil<T> = T | null | undefined
