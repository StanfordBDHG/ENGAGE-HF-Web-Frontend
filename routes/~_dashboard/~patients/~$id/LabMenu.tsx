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
import { updateObservation } from '@/routes/~_dashboard/~patients/actions'
import { type Observation } from '@/routes/~_dashboard/~patients/utils'
import { LabFormDialog } from '@/routes/~_dashboard/~patients/~$id/LabForm'

interface LabMenuProps {
  userId: string
  resourceType: ResourceType
  observation: Observation
}

export const LabMenu = ({
  userId,
  resourceType,
  observation,
}: LabMenuProps) => {
  const router = useRouter()
  const deleteConfirm = useOpenState()
  const editObservation = useOpenState()

  const handleDelete = async () => {
    await deleteDoc(
      docRefs.userObservation({
        userId,
        resourceType,
        observationId: observation.id,
        observationType: observation.type,
      }),
    )
    deleteConfirm.close()
    await router.invalidate()
  }

  return (
    <>
      <LabFormDialog
        onSubmit={async (data) => {
          await updateObservation({
            userId,
            resourceType,
            observationId: observation.id,
            ...data,
          })
          await router.invalidate()
          editObservation.close()
        }}
        open={editObservation.isOpen}
        onOpenChange={editObservation.setIsOpen}
        observation={observation}
      />
      <ConfirmDeleteDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setIsOpen}
        entityName="lab"
        onDelete={handleDelete}
      />
      <RowDropdownMenu>
        <DropdownMenuItem onClick={editObservation.open}>
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
