//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { type TableOptions } from '@tanstack/table-core'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { fuzzyFilter } from './DataTable.utils'
import { GlobalFilterInput } from './GlobalFilterInput'
import { ToggleSortButton } from './ToggleSortButton'
import { cn } from '../../utils/className'
import { type PartialSome } from '../../utils/misc'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../Table'

interface DataTableProps<Data>
  extends PartialSome<TableOptions<Data>, 'getCoreRowModel' | 'filterFns'> {
  className?: string
}

export const DataTable = <Data,>({
  className,
  columns,
  ...props
}: DataTableProps<Data>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const setGlobalFilterDebounced = useDebouncedCallback(
    (value: string) => setGlobalFilter(value),
    200,
  )

  const table = useReactTable({
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    globalFilterFn: 'fuzzy',
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    ...props,
  })
  const rows = table.getRowModel().rows

  return (
    <div className={cn('rounded-md border bg-surface-primary', className)}>
      <header className="flex border-b p-4">
        <GlobalFilterInput
          onChange={(event) => setGlobalFilterDebounced(event.target.value)}
        />
      </header>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} isHoverable={false}>
              {headerGroup.headers.map((header) => {
                const columnContent =
                  header.isPlaceholder ? null : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  )
                return (
                  <TableHead key={header.id}>
                    {header.column.getCanFilter() ?
                      <ToggleSortButton header={header}>
                        {columnContent}
                      </ToggleSortButton>
                    : columnContent}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {!rows.length ?
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          : rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}
