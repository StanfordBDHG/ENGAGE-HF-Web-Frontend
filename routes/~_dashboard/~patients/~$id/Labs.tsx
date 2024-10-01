//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { deleteDoc } from '@firebase/firestore'
import { useRouter } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/table-core'
import { Pencil, Plus, Trash } from 'lucide-react'
import { docRefs } from '@/modules/firebase/app'
import { Button } from '@/packages/design-system/src/components/Button'
import {
  DataTable,
  dateColumn,
  RowDropdownMenu,
} from '@/packages/design-system/src/components/DataTable'
import { DropdownMenuItem } from '@/packages/design-system/src/components/DropdownMenu'
import { ConfirmDeleteDialog } from '@/packages/design-system/src/molecules/ConfirmDeleteDialog'
import {
  useOpenState,
  useStatefulOpenState,
} from '@/packages/design-system/src/utils/useOpenState'
import {
  createObservation,
  updateObservation,
} from '@/routes/~_dashboard/~patients/actions'
import type {
  LabsData,
  Observation,
} from '@/routes/~_dashboard/~patients/utils'
import {
  LabFormDialog,
  type LabFormSchema,
} from '@/routes/~_dashboard/~patients/~$id/LabForm'

interface LabsProps extends LabsData {}

const columnHelper = createColumnHelper<Observation>()

export const Labs = ({ observations, userId, resourceType }: LabsProps) => {
  const router = useRouter()
  const createDialog = useOpenState()

  const deleteModal = useStatefulOpenState<Observation>()
  const editModal = useStatefulOpenState<Observation>()

  const handleDelete = async () => {
    const observation = deleteModal.state
    if (!observation) return
    await deleteDoc(
      docRefs.userObservation({
        userId,
        resourceType,
        observationId: observation.id,
        observationType: observation.type,
      }),
    )
    await router.invalidate()
    deleteModal.close()
  }

  const handleEdit = async (data: LabFormSchema) => {
    const observation = deleteModal.state
    if (!observation) return
    await updateObservation({
      userId,
      resourceType,
      observationId: observation.id,
      ...data,
    })
    await router.invalidate()
    editModal.close()
  }

  const handleCreate = async (data: LabFormSchema) => {
    await createObservation({
      userId,
      resourceType,
      ...data,
    })
    await router.invalidate()
    createDialog.close()
  }

  return (
    <>
      <LabFormDialog
        onSubmit={handleEdit}
        open={editModal.isOpen}
        onOpenChange={editModal.close}
        observation={editModal.state}
      />
      <LabFormDialog
        onSubmit={handleCreate}
        open={createDialog.isOpen}
        onOpenChange={createDialog.setIsOpen}
      />
      <ConfirmDeleteDialog
        open={deleteModal.isOpen}
        onOpenChange={deleteModal.close}
        entityName="lab"
        onDelete={handleDelete}
      />
      <DataTable
        columns={[
          columnHelper.accessor('effectiveDateTime', {
            header: 'Date',
            cell: dateColumn,
          }),
          columnHelper.accessor('type', {
            header: 'Type',
          }),
          columnHelper.accessor('value', {
            header: 'Value',
            cell: (props) => {
              const observation = props.row.original
              return `${observation.value} ${observation.unit}`
            },
          }),
          columnHelper.display({
            id: 'actions',
            cell: (props) => {
              const observation = props.row.original
              return (
                <RowDropdownMenu>
                  <DropdownMenuItem onClick={() => editModal.open(observation)}>
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteModal.open(observation)}
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </RowDropdownMenu>
              )
            },
          }),
        ]}
        data={observations}
        entityName="observations"
        header={
          <>
            <Button
              size="sm"
              variant="secondary"
              className="ml-auto"
              onClick={createDialog.open}
            >
              <Plus />
              Add observation
            </Button>
          </>
        }
        tableView={{
          onRowClick: editModal.open,
        }}
      />
    </>
  )
}
