//
// This source file is part of the ENGAGE-HF Web Frontend open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Button } from "@schmiedmayerlab/grove-design-system/components/Button";
import { Checkbox } from "@schmiedmayerlab/grove-design-system/components/Checkbox";
import { DatePicker } from "@schmiedmayerlab/grove-design-system/components/DatePicker";
import { InfoButton } from "@schmiedmayerlab/grove-design-system/components/InfoButton";
import { Input } from "@schmiedmayerlab/grove-design-system/components/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@schmiedmayerlab/grove-design-system/components/Select";
import { SideLabel } from "@schmiedmayerlab/grove-design-system/components/SideLabel";
import { Tooltip } from "@schmiedmayerlab/grove-design-system/components/Tooltip";
import {
  Field,
  FormError,
  useForm,
} from "@schmiedmayerlab/grove-design-system/forms";
import {
  getUserName,
  type UserInfo,
} from "@schmiedmayerlab/grove-design-system/modules/auth";
import { z } from "zod";
import { type User } from "@/modules/firebase/models";
import { type ResourceType } from "@/modules/firebase/utils";

export const getPatientFormSchema = (isEmailRequired: boolean) =>
  z.object({
    email:
      isEmailRequired ?
        z.email().min(1, "Email is required")
      : z.string().optional(),
    displayName: z.string(),
    clinician: z.string().min(1, "Clinician is required"),
    dateOfBirth: z.date().optional(),
    selfManaged: z.boolean(),
    permanent: z.boolean(),
    providerName: z
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
  });

export type PatientFormSchema = z.infer<
  ReturnType<typeof getPatientFormSchema>
>;

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
    | "type"
  >;
  onSubmit: (data: PatientFormSchema) => Promise<void>;
  clinicianPreselectId?: string;
  resourceType?: ResourceType;
  isPermanentInvitation?: boolean;
}

const parseDateOfBirth = (date: string) => {
  const parts = date.split("T").at(0)?.split("-").map(Number);
  const year = parts?.at(0);
  const month = parts?.at(1);
  const day = parts?.at(2);
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error("Invalid date format");
  }
  return new Date(year, month - 1, day);
};

export const PatientForm = ({
  user,
  clinicians,
  userInfo,
  onSubmit,
  clinicianPreselectId,
  resourceType,
  isPermanentInvitation,
}: PatientFormProps) => {
  const isEdit = !!user;
  const isEmailRequired = isEdit && resourceType === "user";
  const form = useForm({
    formSchema: getPatientFormSchema(isEmailRequired),
    defaultValues: {
      email: userInfo?.email ?? "",
      displayName: userInfo?.displayName ?? "",
      clinician: user?.clinician ?? clinicianPreselectId ?? "",
      dateOfBirth:
        user?.dateOfBirth ? parseDateOfBirth(user.dateOfBirth) : undefined,
      providerName: user?.providerName ?? "",
      selfManaged: user?.selfManaged ?? false,
      permanent: isPermanentInvitation ?? false,
    },
  });
  const isPermanent = form.watch("permanent");

  const handleSubmit = form.handleSubmit(async (data) => {
    await onSubmit(
      isPermanent ? { ...data, displayName: "", dateOfBirth: undefined } : data,
    );
  });

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
      <FormError
        prefix={`${isEdit ? "Updating" : "Inviting"} patient failed. `}
        formError={form.formError}
      />
      {isEmailRequired && (
        <Field
          control={form.control}
          name="email"
          label="Email"
          tooltip={
            <>
              Users use this email to login to the app. <br />
              Changing this email might cause troubles with accessing the
              account.
            </>
          }
          render={({ field }) => <Input {...field} />}
        />
      )}
      {!isPermanent && (
        <Field
          control={form.control}
          name="displayName"
          label="Display name"
          render={({ field }) => <Input {...field} />}
        />
      )}
      {!isPermanent && (
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
      )}
      <Field
        control={form.control}
        name="clinician"
        label="Clinician"
        render={({ field }) => (
          <Select search onValueChange={field.onChange} {...field}>
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
      {!isEdit && (
        <Field
          control={form.control}
          name="permanent"
          render={({ field }) => {
            const { value, onChange, ...restField } = field;
            return (
              <div className="flex items-center gap-2">
                <SideLabel label="Is permanent invitation">
                  <Checkbox
                    checked={value}
                    onCheckedChange={(checked) => onChange(checked === true)}
                    {...restField}
                  />
                </SideLabel>
                <Tooltip tooltip="Permanent invitations are not deleted after the first enrollment, so the invitation code can be reused to enroll multiple patients.">
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
