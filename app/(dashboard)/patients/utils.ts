//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { query, where } from 'firebase/firestore'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import { getDocsData, UserType } from '@/modules/firebase/utils'
import { getUserOrganizations } from '@/modules/user/queries'

export const getUserClinicians = async () => {
  const { user, refs } = await getAuthenticatedOnlyApp()
  let usersQuery = query(
    refs.users(),
    where('type', 'in', [UserType.clinician, UserType.owner]),
  )
  if (user.type === UserType.owner || user.type === UserType.clinician) {
    usersQuery = query(
      usersQuery,
      where('organization', '==', user.organization),
    )
  }
  const users = await getDocsData(usersQuery)
  return mapAuthData(
    { userIds: users.map((user) => user.id) },
    ({ auth }, id) => ({
      id,
      displayName: auth.displayName,
      email: auth.email,
    }),
  )
}

export const getFormProps = async () => ({
  clinicians: await getUserClinicians(),
  organizations: await getUserOrganizations(),
})
