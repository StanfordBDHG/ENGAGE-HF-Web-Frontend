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
import {
  type AllergiesData,
  type Allergy,
  type MedicationsData,
} from '../utils'

interface AllergiesProps extends AllergiesData, MedicationsData {}

const columnHelper = createColumnHelper<Allergy>()

export const Allergies = ({
  medications,
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
            medications={medications}
          />
        ),
      }),
    ],
    [medications, resourceType, userId],
  )

  /*
   * Notes:
   * * remove preference from Allergies
   * * remove unable to assess
   *
   * * add provider text field
   * */

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
        medications={medications}
      />
      <DataTable
        columns={columns}
        data={allergyIntolerances}
        entityName="allergies"
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
