//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { useRouter } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/table-core'
import { Plus } from 'lucide-react'
import { useMemo } from 'react'
import { stringifyAllergyType } from '@/modules/firebase/allergy'
import { Button } from '@/packages/design-system/src/components/Button'
import { DataTable } from '@/packages/design-system/src/components/DataTable'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'
import { createAllergy } from '@/routes/~_dashboard/~patients/actions'
import { useMedicationsMap } from '@/routes/~_dashboard/~patients/clientUtils'
import { AllergyFormDialog } from '@/routes/~_dashboard/~patients/~$id/AllergyForm'
import { AllergyMenu } from '@/routes/~_dashboard/~patients/~$id/AllergyMenu'
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
  const router = useRouter()
  const createDialog = useOpenState()

  const medicationsMap = useMedicationsMap(medications)

  const columns = useMemo(
    () => [
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (props) => stringifyAllergyType(props.getValue()),
      }),
      columnHelper.accessor('medication', {
        header: 'Medication',
        cell: (props) => {
          const medication = props.getValue()
          return medication ? medicationsMap.get(medication)?.name : ''
        },
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
    [medications, medicationsMap, resourceType, userId],
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
          await router.invalidate()
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
