//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ComponentProps } from 'react'
import { z } from 'zod'
import { ObservationType } from '@/modules/firebase/utils'
import { Button } from '@/packages/design-system/src/components/Button'
import { DatePicker } from '@/packages/design-system/src/components/DatePicker'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/packages/design-system/src/components/Dialog'
import { Input } from '@/packages/design-system/src/components/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/packages/design-system/src/components/Select'
import { Field } from '@/packages/design-system/src/forms/Field'
import { useForm } from '@/packages/design-system/src/forms/useForm'
import {
  getObservationTypeUnits,
  getUnitOfObservationType,
} from '@/routes/~_dashboard/~patients/clientUtils'
import { type Observation } from '@/routes/~_dashboard/~patients/utils'

export const labFormSchema = z.object({
  type: z.nativeEnum(ObservationType),
  effectiveDateTime: z.date(),
  unit: z.string(),
  value: z.number(),
})

export type LabFormSchema = z.infer<typeof labFormSchema>

interface LabFormProps {
  observation?: Observation
  onSubmit: (data: LabFormSchema) => Promise<void>
}

export const LabForm = ({ observation, onSubmit }: LabFormProps) => {
  const isEdit = !!observation
  const defaultType = observation?.type ?? ObservationType.potassium
  const form = useForm({
    formSchema: labFormSchema,
    defaultValues: {
      type: defaultType,
      effectiveDateTime:
        observation?.effectiveDateTime ?
          new Date(observation.effectiveDateTime)
        : new Date(),
      unit: observation?.unit ?? getUnitOfObservationType(defaultType).unit,
      value: observation?.value ?? undefined,
    },
  })

  const [formType, formUnit] = form.watch(['type', 'unit'])
  const units = getObservationTypeUnits(formType)

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data)
  })

  return (
    <form onSubmit={handleSubmit}>
      <Field
        control={form.control}
        name="type"
        label="Type"
        render={({ field }) => (
          <Select
            onValueChange={(type) => {
              field.onChange(type)
              form.setValue(
                'unit',
                getUnitOfObservationType(type as ObservationType, formUnit)
                  .unit,
              )
            }}
            {...field}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ObservationType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Field
        control={form.control}
        name="unit"
        label="Unit"
        render={({ field }) => (
          <Select {...field} key={formType}>
            <SelectTrigger>
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              {units.map((unit) => (
                <SelectItem key={unit.unit} value={unit.unit}>
                  {unit.unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Field
        control={form.control}
        name="value"
        label="Value"
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            onChange={(event) =>
              field.onChange(event.currentTarget.valueAsNumber)
            }
          />
        )}
      />
      <Field
        control={form.control}
        name="effectiveDateTime"
        label="Date"
        render={({ field }) => (
          <DatePicker
            mode="single"
            selected={field.value}
            onSelect={(date) => field.onChange(date)}
            defaultMonth={field.value}
            toYear={new Date().getFullYear()}
          />
        )}
      />
      <Button type="submit" isPending={form.formState.isSubmitting}>
        {isEdit ? 'Edit' : 'Create'} observation
      </Button>
    </form>
  )
}

type LabFormDialogProps = LabFormProps &
  Pick<ComponentProps<typeof Dialog>, 'open' | 'onOpenChange'>

export const LabFormDialog = ({
  open,
  onOpenChange,
  observation,
  ...props
}: LabFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{observation ? 'Edit' : 'Create'} observation</DialogTitle>
      </DialogHeader>
      <LabForm {...props} observation={observation} />
    </DialogContent>
  </Dialog>
)
