//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { chunk } from 'es-toolkit'
import {
  getAuthenticatedOnlyApp,
  type UserAuthenticationInformation,
} from '@/modules/firebase/guards'

export const mapUserData = async <T>(
  userIds: string[],
  callback: (userInformation: UserAuthenticationInformation, id: string) => T,
) => {
  const { callables } = await getAuthenticatedOnlyApp()

  const chunks = chunk(userIds, 100)
  if (chunks.length > 5) {
    // If we reach that stage, we should implement server side pagination
    console.warn('More than 500 users batched together')
  }
  const promises = chunks.map(async (chunkIds) => {
    const usersRecord = await callables.getUsersInformation({
      userIds: chunkIds,
    })
    return userIds.map((id) => {
      // authData might be undefined
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const authData = usersRecord.data[id]?.data?.auth
      if (!authData) {
        console.error(`Cannot locate user ${id}.`, {
          userData: usersRecord.data[id],
          id,
        })
        return null
      }
      return callback(authData, id)
    })
  })
  const results = await Promise.all(promises)
  return results.flat(1).filter(Boolean) as Array<Exclude<T, null | undefined>>
}
