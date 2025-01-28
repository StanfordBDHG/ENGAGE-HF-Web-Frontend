//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { useMemo } from "react";
import { basicFhirCoding } from "@/modules/firebase/models";
import { UserObservationCollection } from "@/modules/firebase/utils";
import { type MedicationsData } from "@/routes/~_dashboard/~patients/utils";

export const labsObservationCollections = [
  UserObservationCollection.creatinine,
  UserObservationCollection.eGfr,
  UserObservationCollection.potassium,
];

export const getObservationTypeUnits = (
  observationType: UserObservationCollection,
) => {
  if (observationType === UserObservationCollection.eGfr)
    return [
      {
        unit: "mL/min/1.73m2",
        code: "mL/min/{1.73_m2}",
        coding: [
          {
            ...basicFhirCoding,
            system: "http://loinc.org",
            code: "98979-8",
            display:
              "Glomerular filtration rate/1.73 sq M.predicted [Volume Rate/Area] in Serum, Plasma or Blood by Creatinine-based formula (CKD-EPI 2021)",
          },
        ],
      },
    ];
  if (observationType === UserObservationCollection.potassium)
    return [
      {
        unit: "mEq/L",
        code: "meq/L",
        coding: [
          {
            ...basicFhirCoding,
            system: "http://loinc.org",
            code: "6298-4",
            display: "Potassium [Moles/volume] in Blood",
          },
        ],
      },
    ];
  if (observationType === UserObservationCollection.creatinine)
    return [
      {
        unit: "mg/dL",
        code: "mg/dL",
        coding: [
          {
            ...basicFhirCoding,
            system: "http://loinc.org",
            code: "2160-0",
            display: "Creatinine [Mass/volume] in Serum or Plasma",
          },
        ],
      },
    ];
};

export const getUnitOfObservationType = (
  type: UserObservationCollection,
  currentUnit?: string,
) => {
  const newUnits = getObservationTypeUnits(type);
  const existingUnit =
    currentUnit ?
      newUnits?.find((unit) => unit.unit === currentUnit)
    : undefined;
  const newUnit = existingUnit ?? newUnits?.at(0);
  if (!newUnit) throw new Error("Observation units cannot be empty");
  return newUnit;
};

export const useMedicationsMap = (
  medications: MedicationsData["medications"],
) =>
  useMemo(() => {
    const entries = medications.flatMap((medicationClass) =>
      medicationClass.medications.map(
        (medication) => [medication.id, medication] as const,
      ),
    );
    return new Map(entries);
  }, [medications]);
