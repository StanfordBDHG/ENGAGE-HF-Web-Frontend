//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createFileRoute } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { Helmet } from 'react-helmet'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { DashboardLayout } from './DashboardLayout'
import { Notification } from '@/modules/notifications/Notification'
import { notificationQueries } from '@/modules/notifications/queries'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useUser } from '@/modules/firebase/UserProvider'
import {
  DataTable,
  DataTableBasicView,
} from '@/packages/design-system/src/components/DataTable'
import { createColumnHelper } from '@tanstack/table-core'
import { UserMessage } from '@/modules/firebase/models'
import { parseNilLocalizedText } from '@/modules/firebase/localizedText'
import { isMessageRead } from '@/modules/notifications/helpers'
import { Button } from '@/packages/design-system/src/components/Button'
import { callables } from '@/modules/firebase/app'
import { queryClient } from '@/modules/query/queryClient'
import { useMemo } from 'react'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'
import { SideLabel } from '@/packages/design-system/src/components/SideLabel'
import { Switch } from '@/packages/design-system/src/components/Switch'

const columnHelper = createColumnHelper<UserMessage>()

const columnIds = {
  isRead: 'isRead',
}

const columns = [
  columnHelper.accessor(
    (notification) => parseNilLocalizedText(notification.description),
    { id: 'description' },
  ),
  columnHelper.accessor(
    (notification) => parseNilLocalizedText(notification.title),
    { id: 'title' },
  ),
  columnHelper.accessor((notification) => new Date(notification.creationDate), {
    id: 'creationDate',
  }),
  columnHelper.accessor((notification) => isMessageRead(notification), {
    id: columnIds.isRead,
    filterFn: 'equals',
  }),
]

const NotificationsPage = () => {
  const { auth } = useUser()

  const { data: notifications = [] } = useQuery(
    notificationQueries.list({ userId: auth.uid }),
  )

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
    <DashboardLayout
      title={<PageTitle title="Notifications" icon={<Bell />} />}
    >
      <Helmet>
        <title>Notifications</title>
      </Helmet>
      <DataTable
        columns={columns}
        data={notifications}
        entityName="notifications"
        pageSize={10}
        header={({ table }) => {
          const showsUnreadOnly = table
            .getState()
            .columnFilters.some(
              (filter) =>
                filter.id === columnIds.isRead && filter.value === false,
            )
          return (
            <div className="ml-auto flex gap-4">
              <SideLabel label="Show unread only">
                <Switch
                  checked={showsUnreadOnly}
                  onCheckedChange={() =>
                    table.setColumnFilters((filters) =>
                      showsUnreadOnly ?
                        filters.filter(
                          (filter) => filter.id !== columnIds.isRead,
                        )
                      : [...filters, { id: columnIds.isRead, value: false }],
                    )
                  }
                />
              </SideLabel>
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
            </div>
          )
        }}
      >
        {(props) => (
          <DataTableBasicView {...props}>
            {(notification) => <Notification notification={notification} />}
          </DataTableBasicView>
        )}
      </DataTable>
    </DashboardLayout>
  )
}

export const Route = createFileRoute('/_dashboard/notifications')({
  component: NotificationsPage,
})
