import { queryOptions, useQuery } from '@tanstack/react-query'
import { refs } from '@/modules/firebase/app'
import { useUser } from '@/modules/firebase/UserProvider'
import { getDocsData } from '@/modules/firebase/utils'
import { isMessageRead } from '@/modules/notifications/helpers'

interface ListNotificationsPayload {
  userId: string
}

export const notificationQueries = {
  namespace: 'notifications',
  list: (payload: ListNotificationsPayload) =>
    queryOptions({
      queryKey: [notificationQueries.namespace],
      queryFn: () => getDocsData(refs.userMessages({ userId: payload.userId })),
    }),
}

export const useHasUnreadNotification = () => {
  const { auth } = useUser()
  const { data: hasUnreadNotification } = useQuery({
    ...notificationQueries.list({ userId: auth.uid }),
    select: (notifications) =>
      notifications.some((notification) => !isMessageRead(notification)),
  })

  return { hasUnreadNotification }
}
