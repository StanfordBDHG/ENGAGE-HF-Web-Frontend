//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { query, where } from 'firebase/firestore'
import { Loader2 } from 'lucide-react'
import { getCurrentUser, refs } from '@/modules/firebase/app'
import { routes } from '@/modules/routes'
import { parsePatientsQueries } from '@/modules/user/patients'
import { getNonAdminInvitationsQuery } from '@/modules/user/queries'
import { Button } from '@/packages/design-system/src/components/Button'
import { Card, CardTitle } from '@/packages/design-system/src/components/Card'
import { PatientsTable } from '@/routes/~_dashboard/~patients/PatientsTable'

const listUserPatients = async () => {
  const { user, currentUser } = await getCurrentUser()
  const organizationId = user.organization
  if (!organizationId) return []

  return parsePatientsQueries({
    patientsQuery: query(
      refs.users(),
      where('organization', '==', organizationId),
      where('clinician', '==', currentUser.uid),
    ),
    invitationsQuery: query(
      getNonAdminInvitationsQuery([organizationId]),
      where('user.clinician', '==', currentUser.uid),
    ),
  })
}

export const YourPatientsCard = () => {
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['listUserPatients'],
    queryFn: listUserPatients,
  })

  return (
    <Card className="col-span-full flex flex-col">
      <CardTitle className="px-5 pt-4">Your patients</CardTitle>
      {isLoading ?
        <div className="flex-center py-8">
          <Loader2 className="animate-spin text-muted-foreground" />
        </div>
      : <PatientsTable
          data={patients}
          minimal
          bordered={false}
          pageSize={6}
          entityName="assigned patients"
        />
      }
      <Button
        asChild
        variant="ghostPrimary"
        className="mt-auto !h-16 w-full !rounded-none hover:!bg-accent/50"
      >
        <Link to={routes.patients.index}>View all patients</Link>
      </Button>
    </Card>
  )
}
