//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { Pencil, Trash } from 'lucide-react'
import { LabFormDialog } from '@/app/(dashboard)/patients/[id]/LabForm'
import {
  deleteObservation,
  updateObservation,
} from '@/app/(dashboard)/patients/actions'
import { type Observation } from '@/app/(dashboard)/patients/utils'
import { type ResourceType } from '@/modules/firebase/utils'
import { RowDropdownMenu } from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import { useOpenState } from '@/packages/design-system/src/utils/useOpenState'

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
  const deleteConfirm = useOpenState()
  const editObservation = useOpenState()

  const handleDelete = async () => {
    await deleteObservation({
      userId,
      resourceType,
      observationId: observation.id,
      observationType: observation.type,
    })
    deleteConfirm.close()
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
          editObservation.close()
        }}
        open={editObservation.isOpen}
        onOpenChange={editObservation.setIsOpen}
        observation={observation}
      />
      <ConfirmDeleteDialog
        open={deleteConfirm.isOpen}
        onOpenChange={deleteConfirm.setIsOpen}
        entityName="observation"
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
