//
// This source file is part of the ENGAGE-HF project based on the Stanford Spezi Template Application project
//
// SPDX-FileCopyrightText: 2023 Stanford University
//
// SPDX-License-Identifier: MIT
//

import { startCase } from 'es-toolkit'
import {
  type FHIRSimpleQuantity,
  type FHIRCodeableConcept,
  type FHIRElement,
  type FHIRRatio,
  type FHIRReference,
  type FHIRPeriod,
  type FHIRResource,
} from './baseTypes.js'

export interface FHIRMedication extends FHIRElement {
  code?: FHIRCodeableConcept
  form?: FHIRCodeableConcept
  ingredient?: FHIRMedicationIngredient[]
}

export interface FHIRMedicationIngredient {
  strength?: FHIRRatio
  itemCodeableConcept?: FHIRCodeableConcept
}

export interface FHIRMedicationRequest extends FHIRElement {
  medicationReference?: FHIRReference<FHIRMedication>
  dosageInstruction?: FHIRDosage[]
}

export interface FHIRDosage extends FHIRElement {
  text?: string
  patientInstruction?: string
  timing?: FHIRTiming
  doseAndRate?: FHIRDosageDoseAndRate[]
}

export enum FHIRAllergyIntoleranceType {
  allergy = 'allergy',
  intolerance = 'intolerance',
  financial = 'financial',
  preference = 'preference',
}

export const stringifyIntoleranceType = (type: FHIRAllergyIntoleranceType) =>
  startCase(type)

export enum FHIRAllergyIntoleranceCriticality {
  low = 'low',
  high = 'high',
  unableToAssess = 'unable-to-assess',
}

export const stringifyIntoleranceCriticality = (
  criticality: FHIRAllergyIntoleranceCriticality | null,
) => (criticality ? startCase(criticality) : '')

export interface FHIRAllergyIntolerance {
  type: FHIRAllergyIntoleranceType
  criticality: FHIRAllergyIntoleranceCriticality | null
  code: null
}

export interface FHIRDosageDoseAndRate extends FHIRElement {
  type?: FHIRCodeableConcept
  doseQuantity?: FHIRSimpleQuantity
  maxDosePerPeriod?: FHIRRatio
  maxDosePerAdministration?: FHIRSimpleQuantity
  maxDosePerLifetime?: FHIRSimpleQuantity
}

export interface FHIRTiming extends FHIRElement {
  repeat?: FHIRTimingRepeat
  code?: FHIRCodeableConcept
}

export interface FHIRTimingRepeat {
  frequency?: number
  period?: number
  periodUnit?: string
  timeOfDay?: string[]
}

export type LocalizedText = string | Record<string, string>

export interface MedicationClass {
  name: LocalizedText
  videoPath: string
}

export interface FHIRObservationComponent {
  code: FHIRCodeableConcept
  valueQuantity?: FHIRSimpleQuantity
}

export enum FHIRObservationStatus {
  registered = 'registered',
  preliminary = 'preliminary',
  final = 'final',
  amended = 'amended',
  corrected = 'corrected',
  cancelled = 'cancelled',
  entered_in_error = 'entered-in-error',
  unknown = 'unknown',
}

export interface FHIRObservation extends FHIRResource {
  status: FHIRObservationStatus
  code: FHIRCodeableConcept
  component?: FHIRObservationComponent[]
  valueQuantity?: FHIRSimpleQuantity
  effectivePeriod?: FHIRPeriod
  effectiveDateTime?: string
  effectiveInstant?: string
}

export enum FHIRAppointmentStatus {
  proposed = 'proposed',
  pending = 'pending',
  booked = 'booked',
  arrived = 'arrived',
  fulfilled = 'fulfilled',
  cancelled = 'cancelled',
  noshow = 'noshow',
  enterdInError = 'entered-in-error',
  checkedIn = 'checked-in',
  waitlist = 'waitlist',
}

export interface FHIRAppointment {
  status: FHIRObservationStatus
  created: Date
  start: Date
  end: Date
  comment: string | null
  patientInstruction: string | null
  participant: Array<{
    actor: FHIRReference<unknown> | null
    type: FHIRCodeableConcept | null
  }>
}

export const getMedicationRequestData = (medication: {
  medication: string
  drug: string
  frequencyPerDay: number
  quantity: number
}): FHIRMedicationRequest => ({
  medicationReference: {
    reference: `medications/${medication.medication}/drugs/${medication.drug}`,
  },
  dosageInstruction: [
    {
      timing: {
        repeat: {
          frequency: medication.frequencyPerDay,
          period: 1,
          periodUnit: 'd',
        },
      },
      doseAndRate: [
        {
          doseQuantity: {
            code: '{tbl}',
            system: 'http://unitsofmeasure.org',
            unit: 'tbl.',
            value: medication.quantity,
          },
        },
      ],
    },
  ],
})

export const getMedicationRequestMedicationIds = (
  request: FHIRMedicationRequest,
) => {
  const reference = request.medicationReference?.reference?.split('/')
  return {
    medicationId: reference?.at(1),
    drugId: reference?.at(3),
  }
}
