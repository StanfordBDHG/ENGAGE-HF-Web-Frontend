//
// This source file is part of the ENGAGE-HF project based on the Stanford Spezi Template Application project
//
// SPDX-FileCopyrightText: 2023 Stanford University
//
// SPDX-License-Identifier: MIT
//
import {
  type FHIRSimpleQuantity,
  type FHIRCodeableConcept,
  type FHIRElement,
  type FHIRRatio,
  type FHIRReference,
  type FHIRPeriod,
  type FHIRResource,
  type FHIRExtension,
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

export enum FHIRAllergyIntoleranceCriticality {
  low = 'low',
  high = 'high',
  unableToAssess = 'unable-to-assess',
}

export interface FHIRAllergyIntolerance {
  type: FHIRAllergyIntoleranceType
  criticality: FHIRAllergyIntoleranceCriticality | null
  code: FHIRCodeableConcept
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
  extension?: FHIRExtension[]
  status: FHIRAppointmentStatus
  created: string
  start: string
  end: string
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
  instructions: string
}): FHIRMedicationRequest => ({
  medicationReference: {
    reference: `medications/${medication.medication}/drugs/${medication.drug}`,
  },
  dosageInstruction: [
    {
      text: medication.instructions,
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
