import type { HTMLProps } from 'react'
import { cn } from '@/packages/design-system/src'
import { useNotificationContext } from '@/packages/design-system/src/molecules/Notifications/NotificationContext'

interface NotificationTitleProps extends HTMLProps<HTMLHeadingElement> {}

export const NotificationTitle = ({
  className,
  ...props
}: NotificationTitleProps) => {
  const notification = useNotificationContext()
  return (
    <h5
      className={cn(
        'flex-1 text-sm',
        notification.isRead ?
          'font-medium text-foreground/70'
        : 'font-semibold',
        className,
      )}
      {...props}
    />
  )
}