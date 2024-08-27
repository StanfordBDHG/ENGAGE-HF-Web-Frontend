//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteDoc } from '@firebase/firestore'
import { useRouter } from '@tanstack/react-router'
import { Pencil, Trash } from 'lucide-react'
import { docRefs } from '@/modules/firebase/guards'
import { type ResourceType } from '@/modules/firebase/utils'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'
import { updateAllergy } from '@/routes/~_dashboard/~patients/actions'
import {
  type Allergy,
  type MedicationsData,
} from '@/routes/~_dashboard/~patients/utils'
import { AllergyFormDialog } from '@/routes/~_dashboard/~patients/~$id/AllergyForm'

interface AllergyMenuProps extends MedicationsData {
  userId: string
  resourceType: ResourceType
  allergy: Allergy
}

export const AllergyMenu = ({
  userId,
  resourceType,
  allergy,
  medications,
}: AllergyMenuProps) => {
  const router = useRouter()
  const deleteConfirm = useOpenState()
  const editAllergy = useOpenState()

  const handleDelete = async () => {
    await deleteDoc(
      docRefs.allergyIntolerance({
        userId,
        resourceType,
        allergyIntoleranceId: allergy.id,
      }),
    )
    deleteConfirm.close()
    await router.invalidate()
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
          await router.invalidate()
        }}
        open={editAllergy.isOpen}
        onOpenChange={editAllergy.setIsOpen}
        allergy={allergy}
        medications={medications}
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
