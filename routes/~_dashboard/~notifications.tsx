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
import { useSuspenseQuery } from '@tanstack/react-query'
import { useUser } from '@/modules/firebase/UserProvider'
import {
  DataTable,
  DataTableBasicView,
} from '@/packages/design-system/src/components/DataTable'
import { createColumnHelper } from '@tanstack/table-core'
import { UserMessage } from '@/modules/firebase/models'
import { parseNilLocalizedText } from '@/modules/firebase/localizedText'
import { isMessageRead } from '@/modules/notifications/helpers'

const columnHelper = createColumnHelper<UserMessage>()

const columns = [
  columnHelper.accessor(
    (notification) => parseNilLocalizedText(notification.description),
    { id: 'description' },
  ),
  columnHelper.accessor(
    (notification) => parseNilLocalizedText(notification.title),
    { id: 'title' },
  ),
  columnHelper.accessor((notification) => isMessageRead(notification), {
    id: 'isRead',
  }),
]

const NotificationsPage = () => {
  const { auth } = useUser()

  const { data: notifications } = useSuspenseQuery(
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
