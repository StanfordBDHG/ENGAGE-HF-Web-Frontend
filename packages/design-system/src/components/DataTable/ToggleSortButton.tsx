import { type HeaderContext } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { type ReactNode } from 'react'
import { Button } from '../Button'

interface ToggleSortButtonProps {
  children?: ReactNode
  header: HeaderContext<unknown, unknown>
}

export const ToggleSortButton = ({
  children,
  header,
}: ToggleSortButtonProps) => {
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
      className="relative -left-2 !px-2"
      onClick={header.column.getToggleSortingHandler()}
      aria-label={label}
    >
      {children}
      {isSorted === 'asc' ?
        <ArrowDown className="size-4" />
      : isSorted === 'desc' ?
        <ArrowUp className="size-4" />
      : null}
    </Button>
  )
}
