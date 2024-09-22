import { Slot } from '@radix-ui/react-slot'
import { type ReactNode } from 'react'

import { cn } from '@/packages/design-system/src'
import {
  Notification as NotificationType,
  NotificationContext,
} from './NotificationContext'

export interface NotificationProps {
  notification: NotificationType
  children: ReactNode
  className?: string
  asChild?: boolean
}

export const Notification = ({
  notification,
  children,
  className,
  asChild,
}: NotificationProps) => {
  const Component = asChild ? Slot : 'article'
  return (
    <NotificationContext.Provider value={notification}>
      <Component
        className={cn(
          'flex gap-x-4 border-b border-b-neutral-200 p-5 last:border-b-0',
          className,
        )}
      >
        {children}
      </Component>
    </NotificationContext.Provider>
  )
}
