//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react'
import { useUser } from '@/modules/firebase/UserProvider'
import { filterUnreadNotifications } from '@/modules/notifications/helpers'
import { Notification } from '@/modules/notifications/Notification'
import { notificationQueries } from '@/modules/notifications/queries'
import { routes } from '@/modules/routes'
import { Button } from '@/packages/design-system/src/components/Button'
import { Card, CardTitle } from '@/packages/design-system/src/components/Card'
import { EmptyState } from '@/packages/design-system/src/components/EmptyState'

export const NotificationsCard = () => {
  const { auth } = useUser()

  const { data: notifications = [], isLoading } = useQuery({
    ...notificationQueries.list({ userId: auth.uid }),
    select: (notifications) =>
      filterUnreadNotifications(notifications).slice(0, 4),
  })

  return (
    <Card>
      <CardTitle className="px-5 pt-4">Notifications</CardTitle>
      {isLoading ?
        <div className="flex-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      : notifications.length === 0 ?
        <EmptyState entityName="unread notifications" className="py-8" />
      : notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))
      }
      <Button
        asChild
        variant="ghostPrimary"
        className="!h-16 w-full !rounded-none hover:!bg-accent/50"
      >
        <Link to={routes.notifications}>View all notifications</Link>
      </Button>
    </Card>
  )
}
