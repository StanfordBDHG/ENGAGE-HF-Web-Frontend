//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { chunk } from 'es-toolkit'
import { callables } from '@/modules/firebase/guards'
import {
  type GetUsersInformationInput,
  type UserInformation,
} from '@/modules/firebase/utils'

export const mapAuthData = async <T>(
  input: GetUsersInformationInput,
  callback: (userInformation: UserInformation, id: string) => T,
) => {
  const chunks = chunk(input.userIds, 100)
  if (chunks.length > 5) {
    // If we reach that stage, we should implement server side pagination
    console.warn('More than 500 users batched together')
  }
  const promises = chunks.map(async (chunkIds) => {
    const usersRecord = await callables.getUsersInformation({
      ...input,
      userIds: chunkIds,
    })
    return chunkIds.map((id) => {
      // userInformation might be undefined
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const userInformation = usersRecord.data[id]?.data
      if (!userInformation) {
        console.error(`Cannot locate user ${id}.`, {
          userData: usersRecord.data[id],
          id,
        })
        return null
      }
      return callback(userInformation, id)
    })
  })
  const results = await Promise.all(promises)
  return results.flat(1).filter(Boolean) as Array<Exclude<T, null | undefined>>
}
