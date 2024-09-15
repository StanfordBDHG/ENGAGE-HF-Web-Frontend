//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { initializeApp } from '@firebase/app'
import { connectFunctionsEmulator, getFunctions } from '@firebase/functions'
import { type UserType } from '@stanfordbdhg/engagehf-models'
import { queryOptions } from '@tanstack/react-query'
import { redirect } from '@tanstack/react-router'
import { connectAuthEmulator, getAuth, OAuthProvider } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { queryClient } from '@/app/ReactQueryClientProvider'
import { env } from '@/env'
import { firebaseConfig } from '@/modules/firebase/config'
import {
  getCallables,
  getCollectionRefs,
  getDocDataOrThrow,
  getDocumentsRefs,
} from '@/modules/firebase/utils'

const firebaseApp = initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
const enableEmulation = env.VITE_PUBLIC_EMULATOR
if (enableEmulation)
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })

export const authProvider = {
  stanford: new OAuthProvider('oidc.stanford'),
  apple: new OAuthProvider('apple.com'),
}

export const db = getFirestore(firebaseApp)
if (enableEmulation) connectFirestoreEmulator(db, '127.0.0.1', 8080)
const functions = getFunctions(firebaseApp)
if (enableEmulation) connectFunctionsEmulator(functions, '127.0.0.1', 5001)

export const callables = getCallables(functions)
export const refs = getCollectionRefs(db)
export const docRefs = getDocumentsRefs(db)

export const getCurrentUserType = async () => {
  const { user } = await getCurrentUser()
  return user.type
}

export const userQueryOptions = (opts: { id: string }) =>
  queryOptions({
    queryKey: ['user', opts],
    queryFn: () => getDocDataOrThrow(docRefs.user(opts.id)),
  })

export const getCurrentUser = async () => {
  if (!auth.currentUser) throw new Error('UNAUTHENTICATED')
  const user = await queryClient.ensureQueryData(
    userQueryOptions({ id: auth.currentUser.uid }),
  )
  return {
    currentUser: auth.currentUser,
    user,
  }
}

export const ensureType = async (types: UserType[]) => {
  const type = await getCurrentUserType()
  if (!types.includes(type)) {
    throw redirect({ to: '/' })
  }
}