//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { useQueries, useQuery } from '@tanstack/react-query'
import { createColumnHelper } from '@tanstack/table-core'
import { addWeeks, isBefore, isFuture } from 'date-fns'
import { Loader2 } from 'lucide-react'
import { useMemo } from 'react'
import { appointmentsQueries } from '@/modules/firebase/appointment'
import { patientsQueries } from '@/modules/user/patients'
import { Card, CardTitle } from '@/packages/design-system/src/components/Card'
import {
  DataTable,
  dateTimeColumn,
} from '@/packages/design-system/src/components/DataTable'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'

export const UpcomingAppointmentsCard = () => {
  const patientsQuery = useQuery(patientsQueries.listUserPatients())
  const { data: patients } = patientsQuery

  const results = useQueries({
    queries:
      patients?.map((patient) =>
        appointmentsQueries.list({
          userId: patient.resourceId,
          resourceType: patient.resourceType,
        }),
      ) ?? [],
    combine: (results) => ({
      isLoading: results.some((result) => result.isLoading),
      isError: results.some((result) => result.isError),
      data: results.map((result) => result.data),
      isSuccess: results.every((result) => result.isSuccess),
    }),
  })

  const isLoading = patientsQuery.isLoading || results.isLoading

  const upcomingAppointments = useMemo(() => {
    if (!results.isSuccess || !patients) return []
    const twoWeeksFromNow = addWeeks(new Date(), 2)
    return results.data
      .flatMap((appointments, index) => {
        const patient = patients.at(index)
        if (!patient || !appointments) return null
        const patientName = getUserName(patient)
        return appointments
          .map((appointment) => ({
            patientName,
            date: new Date(appointment.start),
          }))
          .filter(
            (appointment) =>
              isFuture(appointment.date) &&
              isBefore(appointment.date, twoWeeksFromNow),
          )
      })
      .filter(Boolean)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [patients, results.data, results.isSuccess])

  const columnHelper =
    createColumnHelper<(typeof upcomingAppointments)[number]>()

  return (
    <Card>
      <CardTitle className="px-5 pt-4">Upcoming Appointments</CardTitle>
      {isLoading ?
        <div className="flex-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      : <DataTable
          data={upcomingAppointments}
          columns={[
            columnHelper.accessor('patientName', {
              header: 'Patient',
            }),
            columnHelper.accessor('date', {
              header: 'Start',
              cell: dateTimeColumn,
            }),
          ]}
          minimal
          bordered={false}
          pageSize={6}
          entityName="assigned patients"
        />
      }
    </Card>
  )
}
