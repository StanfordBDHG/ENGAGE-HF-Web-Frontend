//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ComponentProps } from 'react'
import { type MedicationsData } from '@/app/(dashboard)/patients/utils'
import { parseLocalizedText } from '@/modules/firebase/localizedText'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/packages/design-system/src/components/Select'

interface MedicationSelectProps
  extends MedicationsData,
    ComponentProps<typeof Select> {}

export const MedicationSelect = ({
  medications,
  ...props
}: MedicationSelectProps) => (
  <Select {...props}>
    <SelectTrigger>
      <SelectValue placeholder="Medication" />
    </SelectTrigger>
    <SelectContent>
      {medications.map((medicationClass) => (
        <SelectGroup key={medicationClass.id}>
          <SelectLabel>{parseLocalizedText(medicationClass.name)}</SelectLabel>
          {medicationClass.medications.map((medication) => (
            <SelectItem value={medication.id} key={medication.id}>
              {medication.name}
            </SelectItem>
          ))}
        </SelectGroup>
      ))}
    </SelectContent>
  </Select>
)
