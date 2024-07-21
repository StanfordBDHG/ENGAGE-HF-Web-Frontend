//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type User } from '@firebase/auth-types'
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
  type Functions,
} from '@firebase/functions'
import { type FirebaseOptions, initializeServerApp } from 'firebase/app'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  doc,
  type DocumentReference,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { env } from '@/env'
import { firebaseConfig } from '@/modules/firebase/config'
import { Role } from '@/modules/firebase/role'
import {
  type Clinician,
  collectionNames,
  getCollectionRefs,
} from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'

interface Result<T> {
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface UserAuthenticationInformation {
  displayName?: string
  email?: string
  phoneNumber?: string
  photoURL?: string
}

interface UserInformation {
  auth: UserAuthenticationInformation
}

const getCallables = (functions: Functions) => ({
  getUsersInformation: httpsCallable<
    { userIds?: string[] },
    Record<string, Result<UserInformation>>
  >(functions, 'getUsersInformation'),
})

// it's mutable, because emulation should be triggerred once
let enableEmulation = env.NEXT_PUBLIC_EMULATOR
export const getServerApp = async (firebaseOptions: FirebaseOptions) => {
  const idToken = headers().get('Authorization')?.split('Bearer ').at(1)

  const firebaseServerApp = initializeServerApp(
    firebaseOptions,
    idToken ? { authIdToken: idToken } : {},
  )

  const auth = getAuth(firebaseServerApp)
  if (enableEmulation && !auth.emulatorConfig) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099')
  }
  await auth.authStateReady()

  const db = getFirestore(firebaseServerApp)
  if (enableEmulation) connectFirestoreEmulator(db, '127.0.0.1', 8080)
  const functions = getFunctions(firebaseServerApp)
  if (enableEmulation) connectFunctionsEmulator(functions, '127.0.0.1', 5001)
  enableEmulation = false

  return {
    firebaseServerApp,
    currentUser: auth.currentUser,
    db,
    functions,
    callables: getCallables(functions),
    refs: getCollectionRefs(db),
  }
}

export const getUserRole = async () => {
  const { currentUser, db, refs } = await getAuthenticatedOnlyApp()
  const adminDocRef = doc(db, collectionNames.admins, currentUser.uid)
  // Try-catches are necessary, because user might not have permissions to read collections
  try {
    const adminDoc = await getDoc(adminDocRef)
    if (adminDoc.exists())
      return {
        role: Role.admin,
      } as const
  } catch (error) {}

  const clinicianDocRef = doc(
    db,
    collectionNames.clinicians,
    currentUser.uid,
  ) as DocumentReference<Clinician>
  try {
    const clinicianDoc = await getDoc(clinicianDocRef)
    if (clinicianDoc.exists())
      return {
        role: Role.clinician,
        clinician: clinicianDoc,
      } as const
  } catch (error) {}

  const organizationsRef = refs.organizations()
  const organizationsQuery = query(
    organizationsRef,
    where('owners', 'array-contains-any', [currentUser.uid]),
  )
  try {
    const organizationsDocs = await getDocs(organizationsQuery)
    if (!organizationsDocs.empty)
      return {
        role: Role.owner as const,
        organizations: organizationsDocs,
      } as const
  } catch (error) {}

  return { role: Role.user } as const
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
  return firebaseApp as typeof firebaseApp & { currentUser: User }
}

/**
 * Redirects to 403 if user's role d
 * */
export const allowRoles = async (roles: Role[]) => {
  const { role } = await getUserRole()
  // TODO: HTTP Error
  if (!roles.includes(role)) redirect(routes.home)
}
