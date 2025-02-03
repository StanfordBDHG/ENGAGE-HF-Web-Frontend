//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import { PageTitle } from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { createFileRoute, Link } from "@tanstack/react-router";
import { query, where } from "firebase/firestore";
import { Contact, UserPlus } from "lucide-react";
import { Helmet } from "react-helmet";
import { getCurrentUser, refs } from "@/modules/firebase/app";
import { routes } from "@/modules/routes";
import { parsePatientsQueries } from "@/modules/user/patients";
import { getNonAdminInvitationsQuery } from "@/modules/user/queries";
import { DashboardLayout } from "@/routes/~_dashboard/DashboardLayout";
import { PatientsTable } from "@/routes/~_dashboard/~patients/PatientsTable";

const getQueries = async () => {
  const { user } = await getCurrentUser();
  const organizationId = user.organization;
  if (!organizationId)
    throw new Error("Clinician/owner without organization id");
  return {
    patientsQuery: query(
      refs.users(),
      where("organization", "==", organizationId),
    ),
    invitationsQuery: getNonAdminInvitationsQuery([organizationId]),
  };
};

const getAdminQueries = () => ({
  patientsQuery: refs.users(),
  invitationsQuery: refs.invitations(),
});

const listPatients = async () => {
  const { user } = await getCurrentUser();

  return parsePatientsQueries(
    user.type === UserType.admin ? getAdminQueries() : await getQueries(),
  );
};

export type Patient = Awaited<ReturnType<typeof listPatients>>[number];

const PatientsPage = () => {
  const patients = Route.useLoaderData();

  return (
    <DashboardLayout
      title={<PageTitle title="Patients" icon={<Contact />} />}
      actions={
        <Button asChild>
          <Link to={routes.patients.invite}>
            <UserPlus />
            Invite Patient
          </Link>
        </Button>
      }
    >
      <Helmet>
        <title>Patients</title>
      </Helmet>
      <PatientsTable data={patients} />
    </DashboardLayout>
  );
};

export const Route = createFileRoute("/_dashboard/patients/")({
  component: PatientsPage,
  loader: () => listPatients(),
});
