import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/modules/firebase/UserProvider'
import { getNotificationPatientId } from '@/modules/notifications/helpers'
import { NotificationsTable } from '@/modules/notifications/NotificationsTable'
import { notificationQueries } from '@/modules/notifications/queries'

interface NotificationsProps {
  userId: string
}

export const Notifications = ({ userId }: NotificationsProps) => {
  const { auth } = useUser()

  const { data: notifications = [] } = useQuery({
    ...notificationQueries.list({ userId: auth.uid }),
    select: (notifications) =>
      notifications.filter(
        (notification) => getNotificationPatientId(notification) === userId,
      ),
  })

  return <NotificationsTable notifications={notifications} />
}
