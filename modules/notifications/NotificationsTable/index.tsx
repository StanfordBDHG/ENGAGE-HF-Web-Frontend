//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import {
  DataTable,
  DataTableBasicView,
} from '@stanfordbdhg/spezi-web-design-system/components/DataTable'
import { parseNilLocalizedText } from '@/modules/firebase/localizedText'
import { type UserMessage } from '@/modules/firebase/models'
import { isMessageRead } from '@/modules/notifications/helpers'
import { Notification } from '@/modules/notifications/Notification'
import { columnHelper, columnIds } from './helpers'
import { MarkAllAsReadButton } from './MarkAllAsReadButton'
import { ShowUnreadOnlySwitch } from './ShowUnreadOnlySwitch'

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

interface NotificationsTableProps {
  notifications: UserMessage[]
}

export const NotificationsTable = ({
  notifications,
}: NotificationsTableProps) => (
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
    initialState={{
      columnFilters: [{ id: columnIds.isRead, value: false }],
    }}
  >
    {(props) => (
      <DataTableBasicView {...props}>
        {(rows) =>
          rows.map((row) => {
            const notification = row.original
            return (
              <Notification key={notification.id} notification={notification} />
            )
          })
        }
      </DataTableBasicView>
    )}
  </DataTable>
)
