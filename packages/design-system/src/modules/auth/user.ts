//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type User } from '@firebase/auth-types'

export const getUserInfo = (user: User) => ({
  displayName: user.displayName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  photoURL: user.photoURL,
  providerId: user.providerId,
  uid: user.uid,
})

export type UserInfo = ReturnType<typeof getUserInfo>

export const getUserName = (
  user: Partial<Pick<UserInfo, 'displayName' | 'email' | 'uid'>>,
) => user.displayName ?? user.email ?? user.uid
