import type { HTMLProps } from 'react'
import { cn } from '../../utils/className'

interface NotificationHeaderProps extends HTMLProps<HTMLDivElement> {}

export const NotificationHeader = ({
  className,
  ...props
}: NotificationHeaderProps) => (
  <header className={cn('flex flex-1 gap-1', className)} {...props} />
)
