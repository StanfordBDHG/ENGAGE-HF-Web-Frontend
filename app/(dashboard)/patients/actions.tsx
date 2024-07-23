//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use server'
import { revalidatePath } from 'next/cache'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'

export const deletePatient = async (payload: { userId: string }) => {
  const { callables } = await getAuthenticatedOnlyApp()
  await callables.deleteUser(payload)
  revalidatePath('/patients')
  return 'success'
}
