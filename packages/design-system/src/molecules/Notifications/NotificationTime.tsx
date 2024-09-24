import { type HTMLProps } from 'react'
import { cn } from '@/packages/design-system/src'
import { useNotificationContext } from '@/packages/design-system/src/molecules/Notifications/NotificationContext'
import { formatDateTime } from '@/packages/design-system/src/utils/date'

interface NotificationTimeProps extends HTMLProps<HTMLTimeElement> {
  time: Date
}

export const NotificationTime = ({ time, ...props }: NotificationTimeProps) => {
  const notification = useNotificationContext()
  return (
    <time
      className={cn(
        'shrink-0 text-xs',
        !notification.isRead && 'font-semibold',
      )}
      {...props}
    >
      {formatDateTime(time)}
    </time>
  )
}