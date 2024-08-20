//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use server'
import { addDoc, deleteDoc, setDoc } from '@firebase/firestore'
import { revalidatePath } from 'next/cache'
import { type AllergyFormSchema } from '@/app/(dashboard)/patients/[id]/AllergyForm'
import { type LabFormSchema } from '@/app/(dashboard)/patients/[id]/LabForm'
import { getUnitOfObservationType } from '@/app/(dashboard)/patients/clientUtils'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { FHIRObservationStatus } from '@/modules/firebase/models/medication'
import {
  type ObservationType,
  type ResourceType,
} from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'

export const deletePatient = async (payload: { userId: string }) => {
  const { callables } = await getAuthenticatedOnlyApp()
  await callables.deleteUser(payload)
  revalidatePath(routes.patients.index)
  return 'success'
}

export const deleteInvitation = async (payload: { invitationId: string }) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  await deleteDoc(docRefs.invitation(payload.invitationId))
  revalidatePath(routes.patients.index)
  return 'success'
}

export const deleteObservation = async (payload: {
  observationId: string
  observationType: ObservationType
  userId: string
  resourceType: ResourceType
}) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  await deleteDoc(docRefs.userObservation(payload))
  revalidatePath(routes.patients.patient(payload.userId))
  return 'success'
}

export const deleteAllergy = async (payload: {
  allergyIntoleranceId: string
  userId: string
  resourceType: ResourceType
}) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  await deleteDoc(docRefs.allergyIntolerance(payload))
  revalidatePath(routes.patients.patient(payload.userId))
  return 'success'
}

const getObservationData = (payload: LabFormSchema) => {
  const unit = getUnitOfObservationType(payload.type, payload.unit)
  return {
    resourceType: 'Observation',
    status: FHIRObservationStatus.final,
    code: { coding: unit.coding },
    valueQuantity: {
      value: payload.value,
      unit: unit.unit,
      system: 'http://unitsofmeasure.org',
      code: unit.code,
    },
    effectiveDateTime: payload.effectiveDateTime.toString(),
  }
}

export const createObservation = async (
  payload: {
    userId: string
    resourceType: ResourceType
  } & LabFormSchema,
) => {
  const { refs } = await getAuthenticatedOnlyApp()
  await addDoc(
    refs.userObservation({
      observationType: payload.type,
      userId: payload.userId,
      resourceType: payload.resourceType,
    }),
    getObservationData(payload),
  )
  revalidatePath(routes.patients.patient(payload.userId))
  return 'success'
}

export const updateObservation = async (
  payload: {
    userId: string
    resourceType: ResourceType
    observationId: string
  } & LabFormSchema,
) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  await setDoc(
    docRefs.userObservation({
      observationType: payload.type,
      userId: payload.userId,
      resourceType: payload.resourceType,
      observationId: payload.observationId,
    }),
    getObservationData(payload),
  )
  revalidatePath(routes.patients.patient(payload.userId))
  return 'success'
}

const getAllergyData = (payload: AllergyFormSchema) => ({
  type: payload.type,
  criticality: payload.criticality,
  code: null,
})

export const createAllergy = async (
  payload: {
    userId: string
    resourceType: ResourceType
  } & AllergyFormSchema,
) => {
  const { refs } = await getAuthenticatedOnlyApp()
  await addDoc(
    refs.allergyIntolerances({
      userId: payload.userId,
      resourceType: payload.resourceType,
    }),
    getAllergyData(payload),
  )
  revalidatePath(routes.patients.patient(payload.userId))
  return 'success'
}

export const updateAllergy = async (
  payload: {
    userId: string
    resourceType: ResourceType
    allergyIntoleranceId: string
  } & AllergyFormSchema,
) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  await setDoc(
    docRefs.allergyIntolerance({
      userId: payload.userId,
      resourceType: payload.resourceType,
      allergyIntoleranceId: payload.allergyIntoleranceId,
    }),
    getAllergyData(payload),
  )
  revalidatePath(routes.patients.patient(payload.userId))
  return 'success'
}
