import { useMutation } from '@tanstack/react-query'
import { useMemo } from 'react'
import { callables } from '@/modules/firebase/app'
import { type UserMessage } from '@/modules/firebase/models'
import { useUser } from '@/modules/firebase/UserProvider'
import { isMessageRead } from '@/modules/notifications/helpers'
import { notificationQueries } from '@/modules/notifications/queries'
import { queryClient } from '@/modules/query/queryClient'
import { Button } from '@/packages/design-system/src/components/Button'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'

interface MarkAllAsReadButtonProps {
  notifications: UserMessage[]
}

export const MarkAllAsReadButton = ({
  notifications,
}: MarkAllAsReadButtonProps) => {
  const { auth } = useUser()

  const dismissibleNotifications = useMemo(
    () =>
      notifications.filter(
        (notification) =>
          notification.isDismissible && !isMessageRead(notification),
      ),
    [notifications],
  )
  const hasDismissibleNotifications = dismissibleNotifications.length > 0

  const markNotificationsAsRead = useMutation({
    mutationFn: () =>
      Promise.all(
        dismissibleNotifications.map((notification) =>
          callables.dismissMessage({
            userId: auth.uid,
            messageId: notification.id,
          }),
        ),
      ),
    onSuccess: async () =>
      queryClient.invalidateQueries(
        notificationQueries.list({ userId: auth.uid }),
      ),
  })

  return (
    <Tooltip
      tooltip="No unread notifications"
      open={hasDismissibleNotifications ? false : undefined}
    >
      <Button
        size="sm"
        onClick={() => markNotificationsAsRead.mutate()}
        isPending={markNotificationsAsRead.isPending}
        disabled={!hasDismissibleNotifications}
        className="disabled:pointer-events-auto"
      >
        Mark all as read
      </Button>
    </Tooltip>
  )
}