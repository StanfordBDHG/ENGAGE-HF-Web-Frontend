//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Functions, httpsCallable } from '@firebase/functions'
import {
  collection,
  type CollectionReference,
  doc,
  type DocumentReference,
  type Firestore,
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

export const collectionNames = {
  patients: 'patients',
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
  displayName?: string
  email?: string
  phoneNumber?: string
  photoURL?: string
}

interface UserInformation {
  auth: UserAuthenticationInformation
}

export const getCallables = (functions: Functions) => ({
  getUsersInformation: httpsCallable<
    { userIds?: string[] },
    Record<string, Result<UserInformation>>
  >(functions, 'getUsersInformation'),
  seedEmulator: httpsCallable(functions, 'seedEmulator'),
  deleteUser: httpsCallable<{ userId: string }, string>(
    functions,
    'deleteUser',
  ),
})

export const getDocsData = async <T>(query: Query<T>) => {
  const docs = await getDocs(query)
  return docs.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
}
