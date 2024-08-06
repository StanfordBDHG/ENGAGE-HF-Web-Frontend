'use client'
import { z } from 'zod'
import { parseLocalizedText } from '@/modules/firebase/localizedText'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/packages/design-system/src/components/Select'
import { Field } from '@/packages/design-system/src/forms/Field'
import { useForm } from '@/packages/design-system/src/forms/useForm'
import { type Data } from './page'
import { Plus, Check, Trash } from 'lucide-react'
import { Button } from '@/packages/design-system/src/components/Button'
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
  TableBody,
} from '@/packages/design-system/src/components/Table'
import { Tooltip } from '@/packages/design-system/src/components/Tooltip'

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
      medication: z.string(),
      drug: z.string(),
      quantity: z.number().min(0),
      frequencyPerDay: z.number().min(0),
    }),
  ),
})

export type MedicationsFormSchema = z.infer<typeof formSchema>

interface MedicationsProps extends Data {
  onSave: (data: MedicationsFormSchema) => Promise<void>
  defaultValues?: MedicationsFormSchema
}

export const Medications = ({
  medicationsTree,
  onSave,
  defaultValues,
}: MedicationsProps) => {
  const form = useForm({
    formSchema: formSchema,
    defaultValues,
  })

  const formValues = form.watch()

  // TODO: Use map
  const findMedication = (id: string) => {
    for (const medicationClass of medicationsTree) {
      for (const medication of medicationClass.medications) {
        if (medication.id === id) {
          return medication
        }
      }
    }
  }

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
    <>
      <header className="my-4 flex justify-end gap-2">
        <Button size="sm" variant="secondary" onClick={addMedication}>
          <Plus />
          Add medication
        </Button>
        <Button size="sm" onClick={save}>
          <Check />
          Save
        </Button>
      </header>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
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
            const selectedMedication = findMedication(
              medicationValue.medication,
            )
            const selectedDrug =
              isDrugSelected ?
                selectedMedication?.drugs.find(
                  (drug) => drug.id === medicationValue.drug,
                )
              : undefined

            const dailyDosage =
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
                          {medicationsTree.map((medicationClass) => (
                            <SelectGroup key={medicationClass.id}>
                              <SelectLabel>
                                {parseLocalizedText(medicationClass.name)}
                              </SelectLabel>
                              {medicationClass.medications.map((medication) => (
                                <SelectItem
                                  value={medication.id}
                                  key={medication.id}
                                >
                                  {medication.name}
                                </SelectItem>
                              ))}
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
                          const medication = findMedication(id)
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
                        onValueChange={(value) => field.onChange(Number(value))}
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
                        onValueChange={(value) => field.onChange(Number(value))}
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
                <TableCell>
                  {dailyDosage.length === 0 ?
                    '-'
                  : dailyDosage.length === 1 ?
                    `${dailyDosage.at(0)?.dosage}mg`
                  : <div>
                      {dailyDosage.map((dosage) => (
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
    </>
  )
}
