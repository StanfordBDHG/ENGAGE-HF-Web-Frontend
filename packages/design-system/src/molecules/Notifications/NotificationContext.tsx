import { createContext, useContext } from 'react'

export interface Notification {
  isRead: boolean
}

export const NotificationContext = createContext<Notification | null>(null)

export const useNotificationContext = () => {
  const notification = useContext(NotificationContext)
  if (!notification) {
    throw new Error('Missing NotificationContext provider.')
  }
  return notification
}
