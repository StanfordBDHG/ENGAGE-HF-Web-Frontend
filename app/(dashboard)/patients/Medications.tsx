//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { Plus, Check, Trash } from 'lucide-react'
import { useMemo } from 'react'
import { z } from 'zod'
import { type MedicationsData } from '@/app/(dashboard)/patients/utils'
import { parseLocalizedText } from '@/modules/firebase/localizedText'
import { Button } from '@/packages/design-system/src/components/Button'
import { Card } from '@/packages/design-system/src/components/Card'
import { EmptyState } from '@/packages/design-system/src/components/EmptyState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/packages/design-system/src/components/Select'
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
} from '@/packages/design-system/src/components/Table'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'
import { Field } from '@/packages/design-system/src/forms/Field'
import { useForm } from '@/packages/design-system/src/forms/useForm'

export const quantityOptions = [
  { label: '0.25 tbl.', value: 0.25 },
  { label: '0.5 tbl.', value: 0.5 },
  { label: '1 tbl.', value: 1 },
  { label: '2 tbl.', value: 2 },
]

export const timesPerDayOptions = [
  { label: 'once a day', value: 1 },
  { label: 'twice a day', value: 2 },
  { label: 'three times a day', value: 3 },
]

const formSchema = z.object({
  medications: z.array(
    z.object({
      id: z.string(),
      medication: z.string({ required_error: 'Medication is required' }),
      drug: z.string({ required_error: 'Drug is required' }),
      quantity: z.number().min(0),
      frequencyPerDay: z.number().min(0),
    }),
  ),
})

export type MedicationsFormSchema = z.infer<typeof formSchema>

interface MedicationsProps extends MedicationsData {
  onSave: (data: MedicationsFormSchema) => Promise<void>
  defaultValues?: MedicationsFormSchema
}

export const Medications = ({
  medications: medications,
  onSave,
  defaultValues,
}: MedicationsProps) => {
  const form = useForm({
    formSchema: formSchema,
    defaultValues,
  })

  const formValues = form.watch()

  const medicationsMap = useMemo(() => {
    const entries = medications.flatMap((medicationClass) =>
      medicationClass.medications.map(
        (medication) => [medication.id, medication] as const,
      ),
    )
    return new Map(entries)
  }, [medications])

  const addMedication = () =>
    form.setValue('medications', [
      ...formValues.medications,
      {
        id: `${formValues.medications.length + 1}`,
        // `undefined` doesn't get submitted anywhere
        medication: undefined as unknown as string,
        drug: undefined as unknown as string,
        quantity: 1,
        frequencyPerDay: 1,
      },
    ])

  const save = form.handleSubmit(async (data) => {
    await onSave(data)
  })

  return (
    <Card>
      <header className="my-4 flex justify-end gap-2 px-4">
        <Button size="sm" variant="secondary" onClick={addMedication}>
          <Plus />
          Add medication
        </Button>
        <Button size="sm" onClick={save}>
          <Check />
          Save
        </Button>
      </header>
      {formValues.medications.length === 0 ?
        <EmptyState entityName="medications" className="my-12" />
      : <Table className="table-fixed">
          <TableHeader>
            <TableRow isHoverable={false}>
              <TableCell>Medication</TableCell>
              <TableCell>Drug</TableCell>
              <TableCell className="w-[130px]">Quantity</TableCell>
              <TableCell className="w-[190px]">Frequency</TableCell>
              <TableCell className="w-[190px]">Daily dosage</TableCell>
              <TableCell className="w-[75px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {formValues.medications.map((medicationValue, index) => {
              const isDrugSelected = !!medicationValue.drug
              const selectedMedication = medicationsMap.get(
                medicationValue.medication,
              )
              const selectedDrug =
                isDrugSelected ?
                  selectedMedication?.drugs.find(
                    (drug) => drug.id === medicationValue.drug,
                  )
                : undefined

              const dailyDosages =
                selectedDrug?.ingredients.map((drug) => ({
                  name: drug.name,
                  dosage:
                    drug.strength *
                    medicationValue.frequencyPerDay *
                    medicationValue.quantity,
                })) ?? []

              const removeMedication = () => {
                form.setValue(
                  'medications',
                  formValues.medications.filter(
                    (medication) => medication.id !== medicationValue.id,
                  ),
                )
              }

              const nestedKey = <T extends string>(key: T) =>
                `medications.${index}.${key}` as const

              return (
                <TableRow key={`${medicationValue.id}-${index}`}>
                  <TableCell>
                    <Field
                      control={form.control}
                      checkEmptyError
                      name={nestedKey('medication')}
                      render={({ field }) => (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value)
                            form.setValue(nestedKey('drug'), '')
                          }}
                          {...field}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Medication" />
                          </SelectTrigger>
                          <SelectContent>
                            {medications.map((medicationClass) => (
                              <SelectGroup key={medicationClass.id}>
                                <SelectLabel>
                                  {parseLocalizedText(medicationClass.name)}
                                </SelectLabel>
                                {medicationClass.medications.map(
                                  (medication) => (
                                    <SelectItem
                                      value={medication.id}
                                      key={medication.id}
                                    >
                                      {medication.name}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectGroup>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Field
                      control={form.control}
                      checkEmptyError
                      name={nestedKey('drug')}
                      render={({ field }) => (
                        <Select
                          disabled={!medicationValue.medication}
                          onValueChange={(id) => {
                            const medication = medicationsMap.get(id)
                            if (!isDrugSelected) {
                              // Drug selected for the first time, infer frequency and quantity
                              form.setValue(
                                nestedKey('frequencyPerDay'),
                                medication?.dosage.frequencyPerDay ?? 1,
                              )
                              form.setValue(
                                nestedKey('quantity'),
                                medication?.dosage.quantity ?? 1,
                              )
                            }
                            field.onChange(id)
                          }}
                          {...field}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Drug" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedMedication?.drugs.map((drug) => (
                              <SelectItem
                                value={drug.id}
                                key={drug.id}
                                itemText={`${drug.name} - ${drug.ingredients
                                  .map(
                                    (ingredient) =>
                                      `${ingredient.strength}${ingredient.unit}`,
                                  )
                                  .join(', ')}`}
                              >
                                <div className="flex flex-col">
                                  <b>{drug.name}</b>
                                  {drug.ingredients.map((ingredient) => (
                                    <p key={ingredient.name}>
                                      {ingredient.name} - {ingredient.strength}
                                      {ingredient.unit}
                                    </p>
                                  ))}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Field
                      control={form.control}
                      checkEmptyError
                      name={nestedKey('quantity')}
                      render={({ field }) => (
                        <Select
                          {...field}
                          disabled={!isDrugSelected}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={String(field.value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Drug" />
                          </SelectTrigger>
                          <SelectContent>
                            {quantityOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Field
                      control={form.control}
                      checkEmptyError
                      name={nestedKey('frequencyPerDay')}
                      render={({ field }) => (
                        <Select
                          {...field}
                          disabled={!isDrugSelected}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={String(field.value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            {timesPerDayOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={String(option.value)}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {dailyDosages.length === 0 ?
                      '-'
                    : dailyDosages.length === 1 ?
                      `${dailyDosages.at(0)?.dosage}mg`
                    : <div>
                        {dailyDosages.map((dosage) => (
                          <div key={dosage.name}>
                            {dosage.name} - {dosage.dosage}mg
                          </div>
                        ))}
                      </div>
                    }
                  </TableCell>
                  <TableCell>
                    <Tooltip tooltip="Delete">
                      <Button
                        aria-label="Delete"
                        size="sm"
                        variant="ghost"
                        onClick={removeMedication}
                      >
                        <Trash className="size-4 text-destructive" />
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      }
    </Card>
  )
}
