//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { addDoc, setDoc } from '@firebase/firestore'
import { addHours } from 'date-fns'
import { docRefs, refs } from '@/modules/firebase/guards'
import { AllergyType } from '@/modules/firebase/models/allergy'
import { ExtensionURL } from '@/modules/firebase/models/baseTypes'
import {
  FHIRAllergyIntoleranceCriticality,
  FHIRAllergyIntoleranceType,
  FHIRAppointmentStatus,
  FHIRObservationStatus,
} from '@/modules/firebase/models/medication'
import { type ResourceType } from '@/modules/firebase/utils'
import { getUnitOfObservationType } from '@/routes/~_dashboard/~patients/clientUtils'
import { type AllergyFormSchema } from '@/routes/~_dashboard/~patients/~$id/AllergyForm'
import { type AppointmentFormSchema } from '@/routes/~_dashboard/~patients/~$id/AppointmentForm'
import { type LabFormSchema } from '@/routes/~_dashboard/~patients/~$id/LabForm'

export const getObservationData = (payload: LabFormSchema) => {
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
  await addDoc(
    refs.userObservation({
      observationType: payload.type,
      userId: payload.userId,
      resourceType: payload.resourceType,
    }),
    getObservationData(payload),
  )
}

export const updateObservation = async (
  payload: {
    userId: string
    resourceType: ResourceType
    observationId: string
  } & LabFormSchema,
) => {
  await setDoc(
    docRefs.userObservation({
      observationType: payload.type,
      userId: payload.userId,
      resourceType: payload.resourceType,
      observationId: payload.observationId,
    }),
    getObservationData(payload),
  )
}

const getAllergyData = (payload: AllergyFormSchema) => ({
  type:
    (
      payload.type === AllergyType.severeAllergy ||
      payload.type === AllergyType.allergy
    ) ?
      FHIRAllergyIntoleranceType.allergy
    : payload.type === AllergyType.financial ?
      FHIRAllergyIntoleranceType.financial
    : payload.type === AllergyType.intolerance ?
      FHIRAllergyIntoleranceType.intolerance
    : FHIRAllergyIntoleranceType.preference,
  criticality:
    payload.type === AllergyType.severeAllergy ?
      FHIRAllergyIntoleranceCriticality.high
    : null,
  code: {
    coding: [
      {
        system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
        code: payload.medication,
      },
    ],
  },
})

export const createAllergy = async (
  payload: {
    userId: string
    resourceType: ResourceType
  } & AllergyFormSchema,
) => {
  await addDoc(
    refs.allergyIntolerances({
      userId: payload.userId,
      resourceType: payload.resourceType,
    }),
    getAllergyData(payload),
  )
}

export const updateAllergy = async (
  payload: {
    userId: string
    resourceType: ResourceType
    allergyIntoleranceId: string
  } & AllergyFormSchema,
) => {
  await setDoc(
    docRefs.allergyIntolerance({
      userId: payload.userId,
      resourceType: payload.resourceType,
      allergyIntoleranceId: payload.allergyIntoleranceId,
    }),
    getAllergyData(payload),
  )
}

const getAppointmentData = (
  payload: AppointmentFormSchema & { userId: string },
) => ({
  status: FHIRAppointmentStatus.booked,
  start: payload.start.toISOString(),
  end: addHours(payload.start, 1).toISOString(),
  comment: payload.comment,
  patientInstruction: payload.patientInstruction,
  extension: [
    { url: ExtensionURL.providerName, valueString: payload.providerName },
  ],
  participant: [
    {
      actor: {
        display: null,
        type: null,
        identifier: null,
        reference: `users/${payload.userId}`,
      },
      type: null,
    },
  ],
})

export const createAppointment = async (
  payload: {
    userId: string
    resourceType: ResourceType
  } & AppointmentFormSchema,
) => {
  await addDoc(
    refs.appointments({
      userId: payload.userId,
      resourceType: payload.resourceType,
    }),
    {
      created: new Date().toISOString(),
      ...getAppointmentData(payload),
    },
  )
}

export const updateAppointment = async (
  payload: {
    userId: string
    resourceType: ResourceType
    appointmentId: string
  } & AppointmentFormSchema,
) => {
  await setDoc(
    docRefs.appointment({
      userId: payload.userId,
      resourceType: payload.resourceType,
      appointmentId: payload.appointmentId,
    }),
    getAppointmentData(payload),
    { merge: true },
  )
}
