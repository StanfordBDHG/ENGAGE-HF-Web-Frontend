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
import { Notification } from '@/modules/notifications/Notification'
import { notificationQueries } from '@/modules/notifications/queries'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/modules/firebase/UserProvider'
import {
  DataTable,
  DataTableBasicView,
} from '@/packages/design-system/src/components/DataTable'
import { parseNilLocalizedText } from '@/modules/firebase/localizedText'
import { isMessageRead } from '@/modules/notifications/helpers'
import { DashboardLayout } from '../DashboardLayout'
import { MarkAllAsReadButton } from '@/routes/~_dashboard/~notifications/MarkAllAsReadButton'
import { ShowUnreadOnlySwitch } from '@/routes/~_dashboard/~notifications/ShowUnreadOnlySwitch'
import { columnHelper, columnIds } from './helpers'

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
        header={({ table }) => (
          <div className="ml-auto flex gap-4">
            <ShowUnreadOnlySwitch table={table} />
            <MarkAllAsReadButton notifications={notifications} />
          </div>
        )}
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

export const Route = createFileRoute('/_dashboard/notifications/')({
  component: NotificationsPage,
})
