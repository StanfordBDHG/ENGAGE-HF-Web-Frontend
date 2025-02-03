//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
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
  type fhirQuestionnaireResponseConverter,
  type fhirResourceConverter,
  type InferEncoded,
  type invitationConverter,
  type medicationClassConverter,
  type organizationConverter,
  type userConverter,
  type userMessageConverter,
} from "@stanfordbdhg/engagehf-models";

export type Organization = InferEncoded<typeof organizationConverter> & {
  id: string;
};

export type Invitation = InferEncoded<typeof invitationConverter>;

export type User = InferEncoded<typeof userConverter> & { id: string };

export type FHIRElement = InferEncoded<typeof fhirElementConverter>;
export const basicFhirElement: FHIRElement = {
  id: null,
  extension: null,
};

export type FHIRResource = InferEncoded<typeof fhirResourceConverter>;

export type FHIRCoding = InferEncoded<typeof fhirCodingConverter>;
export const basicFhirCoding: FHIRCoding = {
  ...basicFhirElement,
  system: null,
  version: null,
  code: null,
  display: null,
  userSelected: null,
};

export type FHIRMedicationRequest = InferEncoded<
  typeof fhirMedicationRequestConverter
>;

export type MedicationClass = InferEncoded<typeof medicationClassConverter>;

export type FHIRObservation = InferEncoded<typeof fhirObservationConverter>;

export type FHIRAllergyIntolerance = InferEncoded<
  typeof fhirAllergyIntoleranceConverter
>;

export type FHIRAppointment = InferEncoded<typeof fhirAppointmentConverter> & {
  id: string;
};

export type UserMessage = InferEncoded<typeof userMessageConverter> & {
  id: string;
};

export type QuestionnaireResponse = InferEncoded<
  typeof fhirQuestionnaireResponseConverter
> & {
  id: string;
};

export type LocalizedText = string | Record<string, string>;
