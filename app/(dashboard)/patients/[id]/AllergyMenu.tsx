//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { Pencil, Trash } from 'lucide-react'
import { AllergyFormDialog } from '@/app/(dashboard)/patients/[id]/AllergyForm'
import {
  deleteAllergy,
  updateAllergy,
} from '@/app/(dashboard)/patients/actions'
import { type Allergy } from '@/app/(dashboard)/patients/utils'
import { type ResourceType } from '@/modules/firebase/utils'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'

interface AllergyMenuProps {
  userId: string
  resourceType: ResourceType
  allergy: Allergy
}

export const AllergyMenu = ({
  userId,
  resourceType,
  allergy,
}: AllergyMenuProps) => {
  const deleteConfirm = useOpenState()
  const editAllergy = useOpenState()

  const handleDelete = async () => {
    await deleteAllergy({
      userId,
      resourceType,
      allergyIntoleranceId: allergy.id,
    })
    deleteConfirm.close()
  }

  return (
    <>
      <AllergyFormDialog
        onSubmit={async (data) => {
          await updateAllergy({
            userId,
            resourceType,
            allergyIntoleranceId: allergy.id,
            ...data,
          })
          editAllergy.close()
        }}
        open={editAllergy.isOpen}
        onOpenChange={editAllergy.setIsOpen}
        allergy={allergy}
      />
      <ConfirmDeleteDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setIsOpen}
        entityName="allergy"
        onDelete={handleDelete}
      />
      <RowDropdownMenu>
        <DropdownMenuItem onClick={editAllergy.open}>
          <Pencil />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteConfirm.open}>
          <Trash />
          Delete
        </DropdownMenuItem>
      </RowDropdownMenu>
    </>
  )
}
