//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { updateDoc } from '@firebase/firestore'
import { type Functions, httpsCallable } from '@firebase/functions'
import {
  collection,
  type CollectionReference,
  doc,
  type DocumentReference,
  type Firestore,
  getDoc,
  getDocs,
  type Query,
} from 'firebase/firestore'

export interface Organization {
  id: string
  name: string
  contactName: string
  phoneNumber: string
  emailAddress: string
  owners: string[]
}

export interface Admin {}

export interface UserMessagesSettings {
  dailyRemindersAreActive?: boolean
  textNotificationsAreActive?: boolean
  medicationRemindersAreActive?: boolean
}

export interface User {
  dateOfEnrollment: Date
  invitationCode: string
  messagesSettings?: UserMessagesSettings
  organization?: string
  language?: string
  timeZone?: string
}

export interface Patient {
  dateOfBirth: Date
  clinician?: string
}

export interface Clinician {}

export interface Invitation {
  userId?: string
  auth?: UserAuthenticationInformation
  admin?: Admin
  clinician?: Clinician
  patient?: Patient
  user?: User
}

export const collectionNames = {
  patients: 'patients',
  invitations: 'invitations',
  users: 'users',
  admins: 'admins',
  clinicians: 'clinicians',
  organizations: 'organizations',
}

export const getCollectionRefs = (db: Firestore) => ({
  patients: () =>
    collection(db, collectionNames.patients) as CollectionReference<Patient>,
  users: () =>
    collection(db, collectionNames.users) as CollectionReference<User>,
  invitations: () =>
    collection(
      db,
      collectionNames.invitations,
    ) as CollectionReference<Invitation>,
  admins: () =>
    collection(db, collectionNames.admins) as CollectionReference<Admin>,
  clinicians: () =>
    collection(
      db,
      collectionNames.clinicians,
    ) as CollectionReference<Clinician>,
  organizations: () =>
    collection(
      db,
      collectionNames.organizations,
    ) as CollectionReference<Organization>,
})

export const getDocumentsRefs = (db: Firestore) => ({
  patient: (...segments: string[]) =>
    doc(
      db,
      collectionNames.patients,
      ...segments,
    ) as DocumentReference<Patient>,
  user: (...segments: string[]) =>
    doc(db, collectionNames.users, ...segments) as DocumentReference<User>,
  admin: (...segments: string[]) =>
    doc(db, collectionNames.admins, ...segments) as DocumentReference<Admin>,
  invitation: (...segments: string[]) =>
    doc(
      db,
      collectionNames.invitations,
      ...segments,
    ) as DocumentReference<Invitation>,
  clinician: (...segments: string[]) =>
    doc(
      db,
      collectionNames.clinicians,
      ...segments,
    ) as DocumentReference<Clinician>,
  organization: (...segments: string[]) =>
    doc(
      db,
      collectionNames.organizations,
      ...segments,
    ) as DocumentReference<Organization>,
})

interface Result<T> {
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface UserAuthenticationInformation {
  displayName: string | null
  email: string | null
  phoneNumber: string | null
  photoURL: string | null
}

interface UserInformation {
  auth: UserAuthenticationInformation
}

export const getCallables = (functions: Functions) => ({
  seedEmulator: httpsCallable(functions, 'seedEmulator'),
  getUsersInformation: httpsCallable<
    { userIds?: string[] },
    Record<string, Result<UserInformation>>
  >(functions, 'getUsersInformation'),
  grantOwner: httpsCallable<
    {
      userId?: string
      organizationId?: string
    },
    string
  >(functions, 'grantOwner'),
  revokeOwner: httpsCallable<
    {
      userId?: string
      organizationId?: string
    },
    string
  >(functions, 'revokeOwner'),
  grantAdmin: httpsCallable<{ userId?: string }, string>(
    functions,
    'grantAdmin',
  ),
  revokeAdmin: httpsCallable<{ userId?: string }, string>(
    functions,
    'revokeAdmin',
  ),
  updateUserInformation: httpsCallable<
    { userId?: string; data: UserInformation },
    string
  >(functions, 'updateUserInformation'),
  deleteUser: httpsCallable<{ userId: string }, string>(
    functions,
    'deleteUser',
  ),
  createInvitation: httpsCallable<
    {
      auth?: UserAuthenticationInformation
      admin?: Admin
      clinician?: Clinician
      patient?: Patient
      user?: User
    },
    undefined
  >(functions, 'createInvitation'),
})

export const getDocData = async <T>(reference: DocumentReference<T>) => {
  const doc = await getDoc(reference)
  const data = doc.data()
  return data ?
      {
        id: doc.id,
        ...data,
      }
    : undefined
}

export const getDocsData = async <T>(query: Query<T>) => {
  const docs = await getDocs(query)
  return docs.docs.map((doc) => {
    const data = doc.data()
    if (!data) throw new Error(`No data for ${doc.id} ${doc.ref.path}`)
    return {
      id: doc.id,
      ...data,
    }
  })
}

export const updateDocData = <T>(
  reference: DocumentReference<T>,
  data: Partial<T>,
) => updateDoc(reference, data)
