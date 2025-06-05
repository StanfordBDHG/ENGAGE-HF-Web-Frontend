//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import { Checkbox } from "@stanfordspezi/spezi-web-design-system/components/Checkbox";
import { DatePicker } from "@stanfordspezi/spezi-web-design-system/components/DatePicker";
import { InfoButton } from "@stanfordspezi/spezi-web-design-system/components/InfoButton";
import { Input } from "@stanfordspezi/spezi-web-design-system/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@stanfordspezi/spezi-web-design-system/components/Select";
import { SideLabel } from "@stanfordspezi/spezi-web-design-system/components/SideLabel";
import { Tooltip } from "@stanfordspezi/spezi-web-design-system/components/Tooltip";
import {
  Field,
  FormError,
  useForm,
} from "@stanfordspezi/spezi-web-design-system/forms";
import {
  getUserName,
  type UserInfo,
} from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { z } from "zod";
import { type User } from "@/modules/firebase/models";

export const patientFormSchema = z.object({
  displayName: z.string(),
  clinician: z.string().min(1, "Clinician is required"),
  dateOfBirth: z.date().optional(),
  selfManaged: z.boolean(),
  providerName: z.preprocess(
    (value) => (value === "" ? null : value),
    z.string().nullable(),
  ),
});

export type PatientFormSchema = z.infer<typeof patientFormSchema>;

interface PatientFormProps {
  clinicians: Array<{
    id: string;
    displayName: string | null;
    email: string | null;
  }>;
  userInfo?: Pick<UserInfo, "email" | "displayName" | "uid">;
  user?: Pick<
    User,
    | "organization"
    | "clinician"
    | "dateOfBirth"
    | "providerName"
    | "selfManaged"
  >;
  onSubmit: (data: PatientFormSchema) => Promise<void>;
  clinicianPreselectId?: string;
}

export const PatientForm = ({
  user,
  clinicians,
  userInfo,
  onSubmit,
  clinicianPreselectId,
}: PatientFormProps) => {
  const isEdit = !!user;
  const form = useForm({
    formSchema: patientFormSchema,
    defaultValues: {
      displayName: userInfo?.displayName ?? "",
      clinician: user?.clinician ?? clinicianPreselectId ?? "",
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : undefined,
      providerName: user?.providerName ?? "",
      selfManaged: user?.selfManaged ?? false,
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(data);
  });

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <FormError
        prefix={`${isEdit ? "Updating" : "Inviting"} patient failed. `}
        formError={form.formError}
      />
      <Field
        control={form.control}
        name="displayName"
        label="Display name"
        render={({ field }) => <Input {...field} />}
      />
      <Field
        control={form.control}
        name="dateOfBirth"
        label="Date of Birth"
        render={({ field }) => (
          <DatePicker
            mode="single"
            selected={field.value}
            onSelect={(date) => field.onChange(date)}
            defaultMonth={field.value}
            endMonth={new Date()}
            hidden={{
              after: new Date(),
            }}
          />
        )}
      />
      <Field
        control={form.control}
        name="clinician"
        label="Clinician"
        render={({ field }) => (
          <Select onValueChange={field.onChange} {...field}>
            <SelectTrigger>
              <SelectValue placeholder="Clinician" />
            </SelectTrigger>
            <SelectContent>
              {clinicians.map((clinician) => (
                <SelectItem value={clinician.id} key={clinician.id}>
                  {getUserName(clinician)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <Field
        control={form.control}
        name="providerName"
        label="Provider name"
        tooltip={
          <div>
            Displayed as "Provider" of the Health Report. <br />
            If "Provider name" is not set, assigned clinician will be shown.
          </div>
        }
        render={({ field }) => <Input {...field} value={field.value ?? ""} />}
      />
      {!isEdit && (
        <Field
          control={form.control}
          name="selfManaged"
          render={({ field }) => {
            const { value, onChange, ...restField } = field;
            return (
              <div className="flex items-center gap-2">
                <SideLabel label="Is self managed">
                  <Checkbox
                    checked={value}
                    onCheckedChange={onChange}
                    {...restField}
                  />
                </SideLabel>
                <Tooltip tooltip="This feature allows patients to enter their own medication and laboratory value updates.">
                  <InfoButton />
                </Tooltip>
              </div>
            );
          }}
        />
      )}
      <Button type="submit" isPending={form.formState.isSubmitting}>
        {isEdit ? "Update" : "Invite"} patient
      </Button>
    </form>
  );
};
