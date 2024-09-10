//
// This source file is part of the ENGAGE-HF project based on the Stanford Spezi Template Application project
//
// SPDX-FileCopyrightText: 2023 Stanford University
//
// SPDX-License-Identifier: MIT
//
import {
  type fhirAllergyIntoleranceConverter,
  type fhirAppointmentConverter,
  type fhirMedicationRequestConverter,
  type fhirObservationConverter,
  type medicationClassConverter,
} from '@stanfordbdhg/engagehf-models'

export {
  FHIRAllergyIntoleranceCriticality,
  FHIRAllergyIntoleranceType,
  FHIRAppointmentStatus,
  FHIRObservationStatus,
  FHIRExtensionUrl,
} from '@stanfordbdhg/engagehf-models'

export type FHIRMedicationRequest = ReturnType<
  typeof fhirMedicationRequestConverter.value.encode
>

export type MedicationClass = ReturnType<
  typeof medicationClassConverter.value.encode
>
export type FHIRObservation = ReturnType<
  typeof fhirObservationConverter.value.encode
>
export type FHIRAllergyIntolerance = ReturnType<
  typeof fhirAllergyIntoleranceConverter.value.encode
>
export type FHIRAppointment = ReturnType<
  typeof fhirAppointmentConverter.value.encode
>

export type LocalizedText = string | Record<string, string>

export const getMedicationRequestData = (medication: {
  medication: string
  drug: string
  frequencyPerDay: number
  quantity: number
  instructions: string
}): FHIRMedicationRequest => ({
  resourceType: 'MedicationRequest',
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
  const reference = request.medicationReference?.reference.split('/')
  return {
    medicationId: reference?.at(1),
    drugId: reference?.at(3),
  }
}
