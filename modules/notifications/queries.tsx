import { queryOptions, useQuery } from '@tanstack/react-query'
import { query, orderBy } from 'firebase/firestore'
import { refs } from '@/modules/firebase/app'
import { useUser } from '@/modules/firebase/UserProvider'
import { getDocsData } from '@/modules/firebase/utils'
import { filterUnreadNotifications } from '@/modules/notifications/helpers'

interface ListNotificationsPayload {
  userId: string
}

export const notificationQueries = {
  namespace: 'notifications',
  list: (payload: ListNotificationsPayload) =>
    queryOptions({
      queryKey: [notificationQueries.namespace, payload],
      queryFn: () =>
        getDocsData(
          query(
            refs.userMessages({ userId: payload.userId }),
            orderBy('creationDate', 'desc'),
          ),
        ),
    }),
}

export const useHasUnreadNotification = () => {
  const { auth } = useUser()
  const { data: hasUnreadNotification } = useQuery({
    ...notificationQueries.list({ userId: auth.uid }),
    select: (notifications) =>
      filterUnreadNotifications(notifications).length > 0,
  })

  return { hasUnreadNotification }
}
