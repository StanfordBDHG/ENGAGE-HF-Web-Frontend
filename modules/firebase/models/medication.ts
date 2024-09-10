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
  type fhirCodingConverter,
  type fhirElementConverter,
  type fhirMedicationRequestConverter,
  type fhirObservationConverter,
  type fhirResourceConverter,
  type InferEncoded,
  type medicationClassConverter,
} from '@stanfordbdhg/engagehf-models'

export {
  FHIRAllergyIntoleranceCriticality,
  FHIRAllergyIntoleranceType,
  FHIRAppointmentStatus,
  FHIRObservationStatus,
  FHIRExtensionUrl,
} from '@stanfordbdhg/engagehf-models'

export type FHIRElement = InferEncoded<typeof fhirElementConverter>

export const basicFhirElement: FHIRElement = {
  id: null,
  extension: null,
}

export type FHIRResource = InferEncoded<typeof fhirResourceConverter>

export type FHIRCoding = InferEncoded<typeof fhirCodingConverter>

export const basicFhirCoding: FHIRCoding = {
  ...basicFhirElement,
  system: null,
  version: null,
  code: null,
  display: null,
  userSelected: null,
}

export type FHIRMedicationRequest = InferEncoded<
  typeof fhirMedicationRequestConverter
>

export type MedicationClass = InferEncoded<typeof medicationClassConverter>
export type FHIRObservation = InferEncoded<typeof fhirObservationConverter>
export type FHIRAllergyIntolerance = InferEncoded<
  typeof fhirAllergyIntoleranceConverter
>
export type FHIRAppointment = InferEncoded<typeof fhirAppointmentConverter>

export type LocalizedText = string | Record<string, string>

export const getMedicationRequestData = (medication: {
  medication: string
  drug: string
  frequencyPerDay: number
  quantity: number
  instructions: string
}): FHIRMedicationRequest => ({
  id: null,
  extension: null,
  resourceType: 'MedicationRequest',
  medicationReference: {
    reference: `medications/${medication.medication}/drugs/${medication.drug}`,
    type: null,
    display: null,
    identifier: null,
  },
  dosageInstruction: [
    {
      text: medication.instructions,
      timing: {
        code: null,
        repeat: {
          frequency: medication.frequencyPerDay,
          period: 1,
          periodUnit: 'd',
          timeOfDay: null,
        },
      },
      doseAndRate: [
        {
          type: null,
          doseQuantity: {
            code: '{tbl}',
            system: 'http://unitsofmeasure.org',
            unit: 'tbl.',
            value: medication.quantity,
          },
        },
      ],
      patientInstruction: null,
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
