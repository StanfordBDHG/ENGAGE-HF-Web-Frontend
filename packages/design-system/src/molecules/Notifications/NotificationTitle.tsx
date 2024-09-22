import { useNotificationContext } from '@/packages/design-system/src/molecules/Notifications/NotificationContext'
import { cn } from '@/packages/design-system/src'
import type { HTMLProps } from 'react'

interface NotificationTitleProps extends HTMLProps<HTMLHeadingElement> {}

export const NotificationTitle = ({
  className,
  ...props
}: NotificationTitleProps) => {
  const notification = useNotificationContext()
  return (
    <h5
      className={cn(
        'text-landing flex-1 text-sm font-bold',
        notification.isRead && 'font-bold',
        className,
      )}
      {...props}
    />
  )
}
