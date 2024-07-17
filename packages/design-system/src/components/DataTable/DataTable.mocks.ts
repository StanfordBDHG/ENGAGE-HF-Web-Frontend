//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createColumnHelper } from '@tanstack/react-table'

export const peopleData = [
  { name: 'John', age: 52 },
  { name: 'Doe', age: 19 },
  { name: 'Lorem', age: 24 },
  { name: 'Anna', age: 47 },
  { name: 'Mark', age: 18 },
  { name: 'Ralph', age: 12 },
  { name: 'Jasmine', age: 34 },
]

export type Person = (typeof peopleData)[number]

export const columnHelper = createColumnHelper<Person>()

export const peopleColumns = [
  columnHelper.accessor('name', { header: 'Name' }),
  columnHelper.accessor('age', { header: 'Age' }),
]
