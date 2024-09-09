//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type Functions, httpsCallable } from '@firebase/functions'
import {
  type FHIRMedication,
  type invitationConverter,
  type organizationConverter,
  type userConverter,
  UserType,
} from '@stanfordbdhg/engagehf-models'
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
import { type z } from 'zod'
import {
  type FHIRMedicationRequest,
  type MedicationClass,
  type FHIRObservation,
  type FHIRAllergyIntolerance,
  type FHIRAppointment,
} from '@/modules/firebase/models/medication'
import { strategy } from '@/packages/design-system/src/utils/misc'

export type Organization = z.output<
  typeof organizationConverter.value.schema
> & { id: string }

export type Invitation = z.output<typeof invitationConverter.value.schema> & {
  id: string
}

export { UserType }

export type User = z.output<typeof userConverter.value.schema> & { id: string }

export const collectionNames = {
  invitations: 'invitations',
  users: 'users',
  organizations: 'organizations',
  medications: 'medications',
  medicationClasses: 'medicationClasses',
  drugs: 'drugs',
  medicationRequests: 'medicationRequests',
  appointments: 'appointments',
  allergyIntolerances: 'allergyIntolerances',
  creatinineObservations: 'creatinineObservations',
  eGfrObservations: 'eGfrObservations',
  potassiumObservations: 'potassiumObservations',
}

export type ResourceType = 'invitation' | 'user'

export const userPath = (resourceType: ResourceType) =>
  strategy(
    {
      invitation: collectionNames.invitations,
      user: collectionNames.users,
    },
    resourceType,
  )

export enum ObservationType {
  creatinine = 'creatinine',
  eGFR = 'eGFR',
  potassium = 'potassium',
}

export const observationPath = (type: ObservationType) =>
  strategy(
    {
      [ObservationType.creatinine]: collectionNames.creatinineObservations,
      [ObservationType.eGFR]: collectionNames.eGfrObservations,
      [ObservationType.potassium]: collectionNames.potassiumObservations,
    },
    type,
  )

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
  appointments: ({
    userId,
    resourceType,
  }: {
    userId: string
    resourceType: ResourceType
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.appointments}`,
    ) as CollectionReference<FHIRAppointment>,
  allergyIntolerances: ({
    userId,
    resourceType,
  }: {
    userId: string
    resourceType: ResourceType
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.allergyIntolerances}`,
    ) as CollectionReference<FHIRAllergyIntolerance>,
  medicationClasses: () =>
    collection(
      db,
      collectionNames.medicationClasses,
    ) as CollectionReference<MedicationClass>,
  userObservation: ({
    userId,
    resourceType,
    observationType,
  }: {
    userId: string
    resourceType: ResourceType
    observationType: ObservationType
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${observationPath(observationType)}`,
    ) as CollectionReference<FHIRObservation>,
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
  appointment: ({
    userId,
    appointmentId,
    resourceType,
  }: {
    userId: string
    appointmentId: string
    resourceType: ResourceType
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.appointments}/${appointmentId}`,
    ) as DocumentReference<FHIRAppointment>,
  allergyIntolerance: ({
    userId,
    allergyIntoleranceId,
    resourceType,
  }: {
    userId: string
    allergyIntoleranceId: string
    resourceType: ResourceType
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.allergyIntolerances}/${allergyIntoleranceId}`,
    ) as DocumentReference<FHIRAllergyIntolerance>,
  userObservation: ({
    userId,
    resourceType,
    observationType,
    observationId,
  }: {
    userId: string
    resourceType: ResourceType
    observationType: ObservationType
    observationId: string
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${observationPath(observationType)}/${observationId}`,
    ) as DocumentReference<FHIRObservation>,
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
        dateOfBirth?: string | null
      }
    },
    { id: string }
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
  exportHealthSummary: httpsCallable<
    {
      userId: string
    },
    { content: string }
  >(functions, 'exportHealthSummary'),
})

export const getDocData = async <T>(reference: DocumentReference<T>) => {
  const doc = await getDoc(reference)
  const data = doc.data()
  return data ?
      {
        ...data,
        id: doc.id,
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
      ...data,
      id: doc.id,
    }
  })
}
