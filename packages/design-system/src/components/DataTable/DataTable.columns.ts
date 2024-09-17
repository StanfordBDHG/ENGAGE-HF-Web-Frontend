//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type CellContext } from '@tanstack/react-table'
import { type Nil } from '../../utils/misc'
import { formatISODateTime } from '../../utils/date'

export const dateColumn = <T>(props: CellContext<T, Nil<string>>) => {
  const value = props.getValue()
  const date = value ? new Date(value) : undefined
  return date?.toLocaleDateString() ?? ''
}

export const dateTimeColumn = <T>(props: CellContext<T, Nil<string>>) => {
  const value = props.getValue()
  return value ? formatISODateTime(value) : ''
}
