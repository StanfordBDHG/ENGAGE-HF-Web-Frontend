//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import { toast } from "@stanfordspezi/spezi-web-design-system/components/Toaster";
import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Contact } from "lucide-react";
import { Helmet } from "react-helmet";
import { callables, docRefs } from "@/modules/firebase/app";
import { useUser } from "@/modules/firebase/UserProvider";
import { getDocDataOrThrow } from "@/modules/firebase/utils";
import { routes } from "@/modules/routes";
import { DashboardLayout } from "@/routes/~_dashboard/DashboardLayout";
import {
  PatientForm,
  type PatientFormSchema,
} from "@/routes/~_dashboard/~patients/PatientForm";
import { getFormProps } from "@/routes/~_dashboard/~patients/utils";

const InvitePatientPage = () => {
  const navigate = useNavigate();
  const { formProps } = Route.useLoaderData();
  const { auth, user } = useUser();

  const invitePatient = async (form: PatientFormSchema) => {
    const clinician = await getDocDataOrThrow(docRefs.user(form.clinician));
    const result = await callables.createInvitation({
      auth: {
        displayName: form.displayName,
      },
      user: {
        type: UserType.patient,
        clinician: form.clinician,
        organization: clinician.organization,
        dateOfBirth: form.dateOfBirth?.toISOString(),
        providerName: form.providerName,
      },
    });
    toast.success("Patient has been successfully invited!");
    await navigate({
      to: routes.patients.patient(result.data.id, "invitation"),
    });
  };

  return (
    <DashboardLayout
      title={<PageTitle title="Invite patient" icon={<Contact />} />}
    >
      <Helmet>
        <title>Invite patient</title>
      </Helmet>
      <PatientForm
        onSubmit={invitePatient}
        clinicianPreselectId={
          user.type === UserType.admin ? undefined : auth.uid
        }
        {...formProps}
      />
    </DashboardLayout>
  );
};

export const Route = createFileRoute("/_dashboard/patients/invite")({
  component: InvitePatientPage,
  loader: async () => ({ formProps: await getFormProps() }),
});
