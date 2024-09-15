//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { createFileRoute } from '@tanstack/react-router'
import { currentUserQueryOptions } from '@/modules/firebase/UserProvider'
import { queryClient } from '@/modules/query/queryClient'

export const Route = createFileRoute('/_dashboard')({
  loader: () => queryClient.ensureQueryData(currentUserQueryOptions()),
})
