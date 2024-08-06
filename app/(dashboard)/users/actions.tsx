//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use server'
import { deleteDoc } from '@firebase/firestore'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { routes } from '@/modules/routes'

export const deleteUser = async (payload: { userId: string }) => {
  const { callables } = await getAuthenticatedOnlyApp()
  await callables.deleteUser(payload)
  revalidatePath(routes.users.index)
  return 'success'
}

export const deleteInvitation = async (payload: { invitationId: string }) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  await deleteDoc(docRefs.invitation(payload.invitationId))
  revalidatePath(routes.users.index)
  return 'success'
}
