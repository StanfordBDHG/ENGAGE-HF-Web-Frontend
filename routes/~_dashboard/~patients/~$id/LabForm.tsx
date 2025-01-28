//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import { DatePicker } from "@stanfordspezi/spezi-web-design-system/components/DatePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@stanfordspezi/spezi-web-design-system/components/Dialog";
import { Input } from "@stanfordspezi/spezi-web-design-system/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@stanfordspezi/spezi-web-design-system/components/Select";
import {
  Field,
  FormError,
  useForm,
} from "@stanfordspezi/spezi-web-design-system/forms";
import { type ComponentProps } from "react";
import { z } from "zod";
import { UserObservationCollection } from "@/modules/firebase/utils";
import {
  getObservationTypeUnits,
  getUnitOfObservationType,
  labsObservationCollections,
} from "@/routes/~_dashboard/~patients/clientUtils";
import { type Observation } from "@/routes/~_dashboard/~patients/utils";

export const labFormSchema = z.object({
  type: z.nativeEnum(UserObservationCollection),
  effectiveDateTime: z.date(),
  unit: z.string(),
  value: z.number(),
});

export type LabFormSchema = z.infer<typeof labFormSchema>;

interface LabFormProps {
  observation?: Observation;
  onSubmit: (data: LabFormSchema) => Promise<void>;
}

export const LabForm = ({ observation, onSubmit }: LabFormProps) => {
  const isEdit = !!observation;
  const defaultType = observation?.type ?? UserObservationCollection.potassium;
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
  });

  const [formType, formUnit] = form.watch(["type", "unit"]);
  const units = getObservationTypeUnits(formType);

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit}>
      <FormError
        prefix={`${isEdit ? "Updating" : "Creating"} observation failed. `}
        formError={form.formError}
      />
      <Field
        control={form.control}
        name="type"
        label="Type"
        render={({ field }) => (
          <Select
            onValueChange={(type) => {
              field.onChange(type);
              form.setValue(
                "unit",
                getUnitOfObservationType(
                  type as UserObservationCollection,
                  formUnit,
                ).unit,
              );
            }}
            {...field}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {labsObservationCollections.map((type) => (
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
              {units?.map((unit) => (
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
            step="0.1"
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
        {isEdit ? "Update" : "Create"} observation
      </Button>
    </form>
  );
};

type LabFormDialogProps = LabFormProps &
  Pick<ComponentProps<typeof Dialog>, "open" | "onOpenChange">;

export const LabFormDialog = ({
  open,
  onOpenChange,
  observation,
  ...props
}: LabFormDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{observation ? "Edit" : "Create"} observation</DialogTitle>
      </DialogHeader>
      <LabForm {...props} observation={observation} />
    </DialogContent>
  </Dialog>
);
