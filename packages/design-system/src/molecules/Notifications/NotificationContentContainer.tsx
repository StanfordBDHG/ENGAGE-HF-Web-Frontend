import type { HTMLProps } from 'react'
import { cn } from '../../utils/className'

interface NotificationContentContainerProps extends HTMLProps<HTMLDivElement> {}

export const NotificationContentContainer = ({
  className,
  ...props
}: NotificationContentContainerProps) => (
  <div className={cn('flex flex-1 flex-col gap-1', className)} {...props} />
)
