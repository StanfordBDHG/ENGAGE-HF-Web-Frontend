//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type CellContext } from '@tanstack/react-table'
import { type Nil } from '../../utils/misc'

export const localeDateStringColumn = <T>(
  props: CellContext<T, Nil<string>>,
) => {
  const value = props.getValue()
  const date = value ? new Date(value) : undefined
  return date?.toLocaleDateString() ?? ''
}

export const localeDateTimeStringColumn = <T>(
  props: CellContext<T, Nil<string>>,
) => {
  const value = props.getValue()
  const date = value ? new Date(value) : undefined
  return date ?
      `${date.toLocaleDateString()} ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`
    : ''
}
