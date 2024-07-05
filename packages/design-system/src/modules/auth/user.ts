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

export const getUserName = (user: UserInfo) => user.displayName ?? user.email
