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
  getDoc,
  getDocs,
  type Query,
} from 'firebase/firestore'
import {
  type FHIRMedication,
  type FHIRMedicationRequest,
  type MedicationClass,
} from '@/modules/firebase/models/medication'

export interface Organization {
  id: string
  name: string
  contactName: string
  phoneNumber: string
  emailAddress: string
  owners: string[]
}

export interface Invitation {
  userId?: string
  auth?: UserAuth
  user?: User
}

export interface UserMessagesSettings {
  dailyRemindersAreActive?: boolean
  textNotificationsAreActive?: boolean
  medicationRemindersAreActive?: boolean
}

export enum UserType {
  admin = 'admin',
  clinician = 'clinician',
  patient = 'patient',
  owner = 'owner',
}

export interface User {
  type: UserType
  dateOfBirth?: Date
  clinician?: string
  dateOfEnrollment?: Date
  invitationCode?: string
  messagesSettings?: UserMessagesSettings
  organization?: string
  language?: string
  timeZone?: string
}

export interface UserAuth {
  displayName?: string
  email?: string
  phoneNumber?: string
  photoURL?: string
}

export const collectionNames = {
  invitations: 'invitations',
  users: 'users',
  organizations: 'organizations',
  medications: 'medications',
  medicationClasses: 'medicationClasses',
  drugs: 'drugs',
  medicationRequests: 'medicationRequests',
}

export type ResourceType = 'invitation' | 'user'

export const userPath = (resourceType: ResourceType) =>
  resourceType === 'invitation' ?
    collectionNames.invitations
  : collectionNames.users

export const getCollectionRefs = (db: Firestore) => ({
  users: () =>
    collection(db, collectionNames.users) as CollectionReference<User>,
  invitations: () =>
    collection(
      db,
      collectionNames.invitations,
    ) as CollectionReference<Invitation>,
  organizations: () =>
    collection(
      db,
      collectionNames.organizations,
    ) as CollectionReference<Organization>,
  medications: () =>
    collection(
      db,
      collectionNames.medications,
    ) as CollectionReference<FHIRMedication>,
  drugs: (medicationId: string) =>
    collection(
      db,
      `/${collectionNames.medications}/${medicationId}/${collectionNames.drugs}`,
    ) as CollectionReference<FHIRMedication>,
  medicationRequests: ({
    userId,
    resourceType,
  }: {
    userId: string
    resourceType: ResourceType
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.medicationRequests}`,
    ) as CollectionReference<FHIRMedicationRequest>,
  medicationClasses: () =>
    collection(
      db,
      collectionNames.medicationClasses,
    ) as CollectionReference<MedicationClass>,
})

export const getDocumentsRefs = (db: Firestore) => ({
  user: (...segments: string[]) =>
    doc(db, collectionNames.users, ...segments) as DocumentReference<
      User,
      User
    >,
  invitation: (...segments: string[]) =>
    doc(db, collectionNames.invitations, ...segments) as DocumentReference<
      Invitation,
      Invitation
    >,
  organization: (...segments: string[]) =>
    doc(
      db,
      collectionNames.organizations,
      ...segments,
    ) as DocumentReference<Organization>,
  medicationRequest: ({
    userId,
    medicationRequestId,
    resourceType,
  }: {
    userId: string
    medicationRequestId: string
    resourceType: ResourceType
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.medicationRequests}/${medicationRequestId}`,
    ) as DocumentReference<FHIRMedicationRequest>,
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

export interface UserInformation {
  auth: UserAuthenticationInformation
  user?: User
}

export interface GetUsersInformationInput {
  userIds: string[]
  includeUserData?: boolean
}

export const getCallables = (functions: Functions) => ({
  createInvitation: httpsCallable<
    {
      auth: {
        displayName?: string
        email: string
        phoneNumber?: string
        photoURL?: string
      }
      user: {
        type: UserType
        organization?: string
        clinician?: string
        language?: string
        timeZone?: string
      }
    },
    { code: string }
  >(functions, 'createInvitation'),
  getUsersInformation: httpsCallable<
    GetUsersInformationInput,
    Record<string, Result<UserInformation>>
  >(functions, 'getUsersInformation'),
  deleteUser: httpsCallable<{ userId: string }, undefined>(
    functions,
    'deleteUser',
  ),
  updateUserInformation: httpsCallable<
    {
      userId: string
      data: {
        auth: {
          displayName?: string
          email?: string
          phoneNumber?: string
          photoURL?: string
        }
      }
    },
    undefined
  >(functions, 'updateUserInformation'),
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

export const getDocDataOrThrow = async <T>(reference: DocumentReference<T>) => {
  const doc = await getDoc(reference)
  const data = doc.data()
  if (!data) {
    throw new Error(`Doc not found: ${reference.path}`)
  }
  return data
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
