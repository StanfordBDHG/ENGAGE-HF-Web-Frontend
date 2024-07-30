//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type User } from '@firebase/auth-types'
import { connectFunctionsEmulator, getFunctions } from '@firebase/functions'
import { type FirebaseOptions, initializeServerApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '@/env'
import { firebaseConfig } from '@/modules/firebase/config'
import {
  getCallables,
  getCollectionRefs,
  getDocDataOrThrow,
  getDocumentsRefs,
  type UserType,
} from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'

export const getServerApp = async (firebaseOptions: FirebaseOptions) => {
  const idToken = headers().get('Authorization')?.split('Bearer ').at(1)

  const firebaseServerApp = initializeServerApp(
    firebaseOptions,
    idToken ? { authIdToken: idToken } : {},
  )

  const auth = getAuth(firebaseServerApp)
  const enableEmulation = env.NEXT_PUBLIC_EMULATOR && !auth.emulatorConfig
  if (enableEmulation) connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  await auth.authStateReady()

  const db = getFirestore(firebaseServerApp)
  if (enableEmulation) connectFirestoreEmulator(db, '127.0.0.1', 8080)
  const functions = getFunctions(firebaseServerApp)
  if (enableEmulation) connectFunctionsEmulator(functions, '127.0.0.1', 5001)

  return {
    firebaseServerApp,
    currentUser: auth.currentUser,
    db,
    functions,
    callables: getCallables(functions),
    refs: getCollectionRefs(db),
    docRefs: getDocumentsRefs(db),
  }
}

export const getUserRole = async (userId: string) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  const user = await getDocDataOrThrow(docRefs.user(userId))
  return user.type
}

export const getCurrentUserType = async () => {
  const { currentUser } = await getAuthenticatedOnlyApp()
  return getUserRole(currentUser.uid)
}

/**
 * Redirects to home if authenticated
 * */
export const getUnauthenticatedOnlyApp = async () => {
  const firebaseApp = await getServerApp(firebaseConfig)
  if (firebaseApp.currentUser) redirect(routes.home)
  return firebaseApp
}

/**
 * Redirects to signIn if not authenticated
 * */
export const getAuthenticatedOnlyApp = async () => {
  const firebaseApp = await getServerApp(firebaseConfig)
  if (!firebaseApp.currentUser) redirect(routes.signIn)
  const { docRefs, currentUser } = firebaseApp
  const user = await getDocDataOrThrow(docRefs.user(currentUser.uid))
  const result = { ...firebaseApp, user }
  return result as typeof result & { currentUser: User }
}

/**
 * Redirects to 403 if user's role d
 * */
export const allowTypes = async (types: UserType[]) => {
  const type = await getCurrentUserType()
  // TODO: HTTP Error
  if (!types.includes(type)) redirect(routes.home)
}
