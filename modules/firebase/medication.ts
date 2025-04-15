//
// This source file is part of the ENGAGE-HF project based on the Stanford Spezi Template Application project
//
// SPDX-FileCopyrightText: 2023 Stanford University
//
// SPDX-License-Identifier: MIT
//

import { type FHIRMedicationRequest } from "@/modules/firebase/models";

export const getMedicationRequestData = (medication: {
  medication: string;
  drug: string;
  frequencyPerDay: number;
  quantity: number;
  instructions: string;
}): FHIRMedicationRequest => ({
  id: null,
  extension: null,
  resourceType: "MedicationRequest",
  meta: null,
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
          periodUnit: "d",
          timeOfDay: null,
        },
      },
      doseAndRate: [
        {
          type: null,
          doseQuantity: {
            code: "{tbl}",
            system: "http://unitsofmeasure.org",
            unit: "tbl.",
            value: medication.quantity,
          },
        },
      ],
      patientInstruction: null,
    },
  ],
});

export const getMedicationRequestMedicationIds = (
  request: FHIRMedicationRequest,
) => {
  const reference = request.medicationReference?.reference.split("/");
  return {
    medicationId: reference?.at(1),
    drugId: reference?.at(3),
  };
};
