//
// This source file is part of the ENGAGE-HF project based on the Stanford Spezi Template Application project
//
// SPDX-FileCopyrightText: 2023 Stanford University
//
// SPDX-License-Identifier: MIT
//

import { type FHIRMedicationRequest } from './medication'

export interface FHIRCodeableConcept extends FHIRElement {
  coding?: FHIRCoding[]
  text?: string
}

export interface FHIRCoding extends FHIRElement {
  system?: string
  version?: string
  code?: string
  display?: string
  userSelected?: boolean
}

export interface FHIRElement {
  id?: string
  extension?: FHIRExtension[]
}

export interface FHIRExtension {
  url: string
  valueQuantities?: FHIRSimpleQuantity[]
  valueReference?: FHIRReference<unknown>
  valueMedicationRequest?: FHIRMedicationRequest
  valueString?: string
}

export enum ExtensionURL {
  providerName = 'http://engagehf.bdh.stanford.edu/fhir/StructureDefinition/Appointment/extension/providerName',
}

export interface FHIRPeriod {
  start?: string
  end?: string
}

export interface FHIRResource extends FHIRElement {
  resourceType: string
}

export interface FHIRRatio {
  numerator?: FHIRSimpleQuantity
  denominator?: FHIRSimpleQuantity
}

// the next line disables the eslint rule just because of the
// unused generic constraint that is deliberately not used
// but left as a guidance for the developer
//
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FHIRReference<T> {
  reference?: string | null
  type?: string | null
  identifier?: string | null
  display?: string | null
}

export interface FHIRSimpleQuantity {
  system?: string
  code?: string
  value?: number
  unit?: string
}
