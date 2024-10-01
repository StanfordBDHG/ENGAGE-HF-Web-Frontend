//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Table } from '@tanstack/table-core'
import { type UserMessage } from '@/modules/firebase/models'
import { SideLabel } from '@/packages/design-system/src/components/SideLabel'
import { Switch } from '@/packages/design-system/src/components/Switch'
import { columnIds } from './helpers'

interface ShowUnreadOnlySwitchProps {
  table: Table<UserMessage>
}

export const ShowUnreadOnlySwitch = ({ table }: ShowUnreadOnlySwitchProps) => {
  const showsUnreadOnly = table
    .getState()
    .columnFilters.some(
      (filter) => filter.id === columnIds.isRead && filter.value === false,
    )

  return (
    <SideLabel label="Show unread only">
      <Switch
        checked={showsUnreadOnly}
        onCheckedChange={() =>
          table.setColumnFilters((filters) =>
            showsUnreadOnly ?
              filters.filter((filter) => filter.id !== columnIds.isRead)
            : [...filters, { id: columnIds.isRead, value: false }],
          )
        }
      />
    </SideLabel>
  )
}