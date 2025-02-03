//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { deleteDoc } from "@firebase/firestore";
import { Button } from "@stanfordspezi/spezi-web-design-system/components/Button";
import {
  DataTable,
  dateColumn,
  RowDropdownMenu,
} from "@stanfordspezi/spezi-web-design-system/components/DataTable";
import { DropdownMenuItem } from "@stanfordspezi/spezi-web-design-system/components/DropdownMenu";
import { ConfirmDeleteDialog } from "@stanfordspezi/spezi-web-design-system/molecules/ConfirmDeleteDialog";
import {
  useOpenState,
  useStatefulOpenState,
} from "@stanfordspezi/spezi-web-design-system/utils/useOpenState";
import { useRouter } from "@tanstack/react-router";
import { createColumnHelper } from "@tanstack/table-core";
import { Pencil, Plus, Trash } from "lucide-react";
import { docRefs } from "@/modules/firebase/app";
import {
  createObservation,
  updateObservation,
} from "@/routes/~_dashboard/~patients/actions";
import type {
  LabsData,
  Observation,
} from "@/routes/~_dashboard/~patients/utils";
import {
  LabFormDialog,
  type LabFormSchema,
} from "@/routes/~_dashboard/~patients/~$id/LabForm";

interface LabsProps extends LabsData {}

const columnHelper = createColumnHelper<Observation>();

export const Labs = ({ observations, userId, resourceType }: LabsProps) => {
  const router = useRouter();
  const createDialog = useOpenState();

  const deleteDialog = useStatefulOpenState<Observation>();
  const editDialog = useStatefulOpenState<Observation>();

  const handleDelete = async () => {
    const observation = deleteDialog.state;
    if (!observation) return;
    await deleteDoc(
      docRefs.userObservation({
        userId,
        resourceType,
        observationId: observation.id,
        observationType: observation.type,
      }),
    );
    await router.invalidate();
    deleteDialog.close();
  };

  const handleEdit = async (data: LabFormSchema) => {
    const observation = editDialog.state;
    if (!observation) return;
    await updateObservation({
      userId,
      resourceType,
      observationId: observation.id,
      ...data,
    });
    await router.invalidate();
    editDialog.close();
  };

  const handleCreate = async (data: LabFormSchema) => {
    await createObservation({
      userId,
      resourceType,
      ...data,
    });
    await router.invalidate();
    createDialog.close();
  };

  return (
    <>
      <LabFormDialog
        onSubmit={handleEdit}
        open={editDialog.isOpen}
        onOpenChange={editDialog.close}
        observation={editDialog.state}
      />
      <LabFormDialog
        onSubmit={handleCreate}
        open={createDialog.isOpen}
        onOpenChange={createDialog.setIsOpen}
      />
      <ConfirmDeleteDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.close}
        entityName="lab"
        onDelete={handleDelete}
      />
      <DataTable
        columns={[
          columnHelper.accessor("effectiveDateTime", {
            header: "Date",
            cell: dateColumn,
          }),
          columnHelper.accessor("type", {
            header: "Type",
          }),
          columnHelper.accessor("value", {
            header: "Value",
            cell: (props) => {
              const observation = props.row.original;
              return `${observation.value} ${observation.unit}`;
            },
          }),
          columnHelper.display({
            id: "actions",
            cell: (props) => {
              const observation = props.row.original;
              return (
                <RowDropdownMenu>
                  <DropdownMenuItem
                    onClick={() => editDialog.open(observation)}
                  >
                    <Pencil />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => deleteDialog.open(observation)}
                  >
                    <Trash />
                    Delete
                  </DropdownMenuItem>
                </RowDropdownMenu>
              );
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
          onRowClick: editDialog.open,
        }}
      />
    </>
  );
};
