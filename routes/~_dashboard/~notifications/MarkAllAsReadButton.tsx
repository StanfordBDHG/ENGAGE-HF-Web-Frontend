import { useUser } from '@/modules/firebase/UserProvider'
import { useMemo } from 'react'
import { isMessageRead } from '@/modules/notifications/helpers'
import { useMutation } from '@tanstack/react-query'
import { callables } from '@/modules/firebase/app'
import { queryClient } from '@/modules/query/queryClient'
import { notificationQueries } from '@/modules/notifications/queries'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'
import { Button } from '@/packages/design-system/src/components/Button'
import { UserMessage } from '@/modules/firebase/models'

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
