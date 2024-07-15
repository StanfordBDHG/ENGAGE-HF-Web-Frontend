import { type Header } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { type ReactNode } from 'react'
import { Button } from '../Button'

interface ToggleSortButtonProps<Data> {
  children?: ReactNode
  header: Header<Data, unknown>
}

export const ToggleSortButton = <Data,>({
  children,
  header,
}: ToggleSortButtonProps<Data>) => {
  const isSorted = header.column.getIsSorted()

  const label = [
    isSorted === 'asc' ? 'Sort descending'
    : isSorted === false ? 'Sort ascending'
    : 'Disable sorting',
    'by',
    typeof children === 'string' ? children : null,
    'column',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Button
      size="sm"
      variant="ghost"
      className="relative -left-2 w-full !justify-start !px-2"
      onClick={header.column.getToggleSortingHandler()}
      aria-label={label}
    >
      {children}
      {isSorted === 'asc' ?
        <ArrowDown className="size-4" />
      : isSorted === 'desc' ?
        <ArrowUp className="size-4" />
      : <div aria-hidden className="size-4" />}
    </Button>
  )
}
