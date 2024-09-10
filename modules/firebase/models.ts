//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import type {
  fhirAllergyIntoleranceConverter,
  fhirAppointmentConverter,
  fhirCodingConverter,
  fhirElementConverter,
  fhirMedicationRequestConverter,
  fhirObservationConverter,
  fhirResourceConverter,
  InferEncoded,
  invitationConverter,
  medicationClassConverter,
  organizationConverter,
  userConverter,
} from '@stanfordbdhg/engagehf-models'

export type Organization = InferEncoded<typeof organizationConverter> & {
  id: string
}

export type Invitation = InferEncoded<typeof invitationConverter>

export type User = InferEncoded<typeof userConverter> & { id: string }

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
