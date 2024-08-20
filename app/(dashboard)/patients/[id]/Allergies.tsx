//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { createColumnHelper } from '@tanstack/table-core'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { AllergyFormDialog } from '@/app/(dashboard)/patients/[id]/AllergyForm'
import { AllergyMenu } from '@/app/(dashboard)/patients/[id]/AllergyMenu'
import { createAllergy } from '@/app/(dashboard)/patients/actions'
import {
  stringifyIntoleranceCriticality,
  stringifyIntoleranceType,
} from '@/modules/firebase/models/medication'
import { Button } from '@/packages/design-system/src/components/Button'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'
import { type AllergiesData, type Allergy } from '../utils'

interface AllergiesProps extends AllergiesData {}

const columnHelper = createColumnHelper<Allergy>()

export const Allergies = ({
  allergyIntolerances,
  userId,
  resourceType,
}: AllergiesProps) => {
  const createDialog = useOpenState()

  const columns = useMemo(
    () => [
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (props) => stringifyIntoleranceType(props.getValue()),
      }),
      columnHelper.accessor('criticality', {
        header: 'Criticality',
        cell: (props) => stringifyIntoleranceCriticality(props.getValue()),
      }),
      columnHelper.display({
        id: 'actions',
        cell: (props) => (
          <AllergyMenu
            allergy={props.row.original}
            userId={userId}
            resourceType={resourceType}
          />
        ),
      }),
    ],
    [resourceType, userId],
  )

  return (
    <>
      <AllergyFormDialog
        onSubmit={async (data) => {
          await createAllergy({
            userId,
            resourceType,
            ...data,
          })
          createDialog.close()
        }}
        open={createDialog.isOpen}
        onOpenChange={createDialog.setIsOpen}
      />
      <DataTable
        columns={columns}
        data={allergyIntolerances}
        header={
          <>
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto"
              onClick={createDialog.open}
            >
              <Plus />
              Add allergy
            </Button>
          </>
        }
      />
    </>
  )
}
