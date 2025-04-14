//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { queriesToAsyncProps } from "@stanfordspezi/spezi-web-design-system/components/Async";
import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@stanfordspezi/spezi-web-design-system/components/Card";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { routes } from "@/modules/routes";
import { patientsQueries } from "@/modules/user/patients";
import { PatientsTable } from "@/routes/~_dashboard/~patients/PatientsTable";

export const YourPatientsCard = () => {
  const patientsQuery = useQuery(patientsQueries.listUserPatients());
  const { data: patients = [] } = patientsQuery;

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Your patients</CardTitle>
      </CardHeader>
      <PatientsTable
        data={patients}
        minimal
        bordered={false}
        pageSize={6}
        entityName="assigned patients"
        {...queriesToAsyncProps([patientsQuery])}
      />
      <Button
        asChild
        variant="ghostPrimary"
        className="hover:bg-accent/50! h-16! w-full rounded-none! border-t"
      >
        <Link to={routes.patients.index}>View all patients</Link>
      </Button>
    </Card>
  );
};
