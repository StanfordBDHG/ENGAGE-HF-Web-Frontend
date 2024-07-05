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
