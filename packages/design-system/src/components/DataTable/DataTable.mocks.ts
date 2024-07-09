//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import type { ColumnDef } from '@tanstack/react-table'

export const peopleData = [
  { name: 'John', age: 52 },
  { name: 'Doe', age: 19 },
  { name: 'Lorem', age: 24 },
]

type Person = (typeof peopleData)[number]

export const peopleColumns: Array<ColumnDef<Person>> = [
  { accessorFn: (item) => item.name, header: 'Name' },
  { accessorFn: (item) => item.age, header: 'Age' },
]
