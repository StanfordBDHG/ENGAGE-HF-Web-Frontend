//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { queriesToAsyncProps } from "@stanfordspezi/spezi-web-design-system/components/Async";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@stanfordspezi/spezi-web-design-system/components/Card";
import {
  DataTable,
  dateTimeColumn,
} from "@stanfordspezi/spezi-web-design-system/components/DataTable";
import { Tooltip } from "@stanfordspezi/spezi-web-design-system/components/Tooltip";
import { getUserName } from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { combineQueries } from "@stanfordspezi/spezi-web-design-system/utils/query";
import { useQueries, useQuery } from "@tanstack/react-query";
import { createColumnHelper } from "@tanstack/table-core";
import { addWeeks, isBefore, isFuture } from "date-fns";
import { Info } from "lucide-react";
import { useMemo } from "react";
import { appointmentsQueries } from "@/modules/firebase/appointment";
import { routes } from "@/modules/routes";
import { patientsQueries } from "@/modules/user/patients";
import { PatientPageTab } from "@/routes/~_dashboard/~patients/~$id/~index";
import { useNavigateOrOpen } from "@/utils/useNavigateOrOpen";

export const UpcomingAppointmentsCard = () => {
  const navigateOrOpen = useNavigateOrOpen();
  const patientsQuery = useQuery(patientsQueries.listUserPatients());
  const { data: patients } = patientsQuery;

  const appointmentsQuery = useQueries({
    queries:
      patients?.map((patient) =>
        appointmentsQueries.list({
          userId: patient.resourceId,
          resourceType: patient.resourceType,
        }),
      ) ?? [],
    combine: (results) => ({
      ...combineQueries(results),
      data: results.map((result) => result.data),
    }),
  });

  const upcomingAppointments = useMemo(() => {
    if (!appointmentsQuery.isSuccess || !patients) return [];
    const twoWeeksFromNow = addWeeks(new Date(), 2);
    return appointmentsQuery.data
      .flatMap((appointments, index) => {
        const patient = patients.at(index);
        if (!patient || !appointments) return null;
        const patientObject = {
          id: patient.resourceId,
          resourceType: patient.resourceType,
          name: getUserName(patient),
        };
        return appointments
          .map((appointment) => ({
            patient: patientObject,
            date: new Date(appointment.start),
          }))
          .filter(
            (appointment) =>
              isFuture(appointment.date) &&
              isBefore(appointment.date, twoWeeksFromNow),
          );
      })
      .filter(Boolean)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [patients, appointmentsQuery.data, appointmentsQuery.isSuccess]);

  const columnHelper =
    createColumnHelper<(typeof upcomingAppointments)[number]>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <Tooltip tooltip="Appointments with patients assigned to you within upcoming next 2 weeks">
          <Info className="size-5 text-muted-foreground" />
        </Tooltip>
      </CardHeader>
      <DataTable
        data={upcomingAppointments}
        columns={[
          columnHelper.accessor("patient.name", {
            header: "Patient",
          }),
          columnHelper.accessor("date", {
            header: "Start",
            cell: dateTimeColumn,
          }),
        ]}
        minimal
        bordered={false}
        pageSize={6}
        entityName="upcoming appointments"
        tableView={{
          onRowClick: (appointment, event) =>
            void navigateOrOpen(event, {
              to: routes.patients.patient(
                appointment.patient.id,
                appointment.patient.resourceType,
                {
                  tab: PatientPageTab.appointments,
                },
              ),
            }),
        }}
        {...queriesToAsyncProps([patientsQuery, appointmentsQuery])}
      />
    </Card>
  );
};
