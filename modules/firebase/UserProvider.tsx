//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/modules/firebase/guards'
import { getUserInfo } from '@/packages/design-system/src/modules/auth/user'

export const currentUserQueryOptions = () =>
  queryOptions({
    queryKey: ['getUser'],
    queryFn: async () => {
      const { currentUser, user } = await getCurrentUser()
      return {
        auth: getUserInfo(currentUser),
        user,
      }
    },
  })

export const useUser = () => useSuspenseQuery(currentUserQueryOptions()).data
