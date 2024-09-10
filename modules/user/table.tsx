//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createColumnHelper } from '@tanstack/table-core'
import { Mail } from 'lucide-react'
import { CopyText } from '@/packages/design-system/src/components/CopyText'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'
import { type Nil } from '@/packages/design-system/src/utils/misc'

interface SharedUser {
  resourceType: 'invitation' | 'user'
  uid: Nil<string>
  displayName: Nil<string>
  email: Nil<string>
  organization: Nil<{ name: string }>
}

export const userColumnIds = {
  organization: 'organization',
}

export const createSharedUserColumns = <User extends SharedUser>() => {
  const columnHelper = createColumnHelper<User>()
  return {
    id: columnHelper.accessor(
      (user) => (user.resourceType === 'invitation' ? 'invitation' : user.uid),
      {
        header: 'Id',
        cell: (props) => {
          const user = props.row.original
          return (
            user.resourceType === 'invitation' ?
              <Tooltip tooltip="User hasn't logged in yet">
                <div className="flex items-center gap-2">
                  <Mail className="size-5 text-muted-foreground" />
                  Invitation
                </div>
              </Tooltip>
            : user.uid ?
              <CopyText className="max-w-[7rem]">{user.uid}</CopyText>
            : '-'
          )
        },
      },
    ),
    displayName: columnHelper.accessor((user) => user.displayName, {
      header: 'Name',
      cell: (props) => props.getValue() ?? '-',
    }),
    email: columnHelper.accessor((user) => user.email, { header: 'Email' }),
    organization: columnHelper.accessor((user) => user.organization?.name, {
      id: userColumnIds.organization,
      header: 'Organization',
    }),
  }
}
