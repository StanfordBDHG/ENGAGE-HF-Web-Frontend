import type { HTMLProps } from 'react'
import { cn } from '@/packages/design-system/src'
import { useNotificationContext } from '@/packages/design-system/src/molecules/Notifications/NotificationContext'

interface NotificationMessageProps extends HTMLProps<HTMLParagraphElement> {}

export const NotificationMessage = ({
  className,
  ...props
}: NotificationMessageProps) => {
  const notification = useNotificationContext()
  return (
    <p
      className={cn(
        'flex-1 text-sm',
        notification.isRead && 'text-foreground/70',
        className,
      )}
      {...props}
    />
  )
}