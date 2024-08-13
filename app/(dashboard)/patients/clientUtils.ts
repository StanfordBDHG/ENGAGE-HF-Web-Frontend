import { ObservationType } from '@/modules/firebase/utils'
import { strategy } from '@/packages/design-system/src/utils/misc'

export const getObservationTypeUnits = (observationType: ObservationType) =>
  strategy(
    {
      [ObservationType.eGFR]: [
        {
          unit: 'mL/min/1.73m2',
          code: 'mL/min/{1.73_m2}',
          coding: [
            {
              system: 'http://loinc.org',
              code: '98979-8',
              display:
                'Glomerular filtration rate/1.73 sq M.predicted [Volume Rate/Area] in Serum, Plasma or Blood by Creatinine-based formula (CKD-EPI 2021)',
            },
          ],
        },
      ],
      [ObservationType.potassium]: [
        {
          unit: 'mEq/L',
          code: 'meq/L',
          coding: [
            {
              system: 'http://loinc.org',
              code: '6298-4',
              display: 'Potassium [Moles/volume] in Blood',
            },
          ],
        },
      ],
      [ObservationType.creatinine]: [
        {
          unit: 'mg/dL',
          code: 'mg/dL',
          coding: [
            {
              system: 'http://loinc.org',
              code: '2160-0',
              display: 'Creatinine [Mass/volume] in Serum or Plasma',
            },
          ],
        },
      ],
    },
    observationType,
  )

export const getUnitOfObservationType = (
  type: ObservationType,
  currentUnit?: string,
) => {
  const newUnits = getObservationTypeUnits(type)
  const existingUnit =
    currentUnit ? newUnits.find((unit) => unit.unit === currentUnit) : undefined
  const newUnit = existingUnit ?? newUnits.at(0)
  if (!newUnit) throw new Error('Observation units cannot be empty')
  return newUnit
}

export type LabUnit = ReturnType<typeof getObservationTypeUnits>[number]
