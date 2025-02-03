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
import { stringifyAllergyType } from "@/modules/firebase/allergy";
import { docRefs } from "@/modules/firebase/app";
import {
  createAllergy,
  updateAllergy,
} from "@/routes/~_dashboard/~patients/actions";
import { useMedicationsMap } from "@/routes/~_dashboard/~patients/clientUtils";
import {
  AllergyFormDialog,
  type AllergyFormSchema,
} from "@/routes/~_dashboard/~patients/~$id/AllergyForm";
import {
  type AllergiesData,
  type Allergy,
  type MedicationsData,
} from "../utils";

interface AllergiesProps extends AllergiesData, MedicationsData {}

const columnHelper = createColumnHelper<Allergy>();

export const Allergies = ({
  medications,
  allergyIntolerances,
  userId,
  resourceType,
}: AllergiesProps) => {
  const router = useRouter();
  const createDialog = useOpenState();
  const deleteDialog = useStatefulOpenState<Allergy>();
  const editDialog = useStatefulOpenState<Allergy>();

  const medicationsMap = useMedicationsMap(medications);

  const handleCreate = async (data: AllergyFormSchema) => {
    await createAllergy({
      userId,
      resourceType,
      ...data,
    });
    createDialog.close();
    await router.invalidate();
  };

  const handleDelete = async () => {
    const allergy = deleteDialog.state;
    if (!allergy) return;
    await deleteDoc(
      docRefs.allergyIntolerance({
        userId,
        resourceType,
        allergyIntoleranceId: allergy.id,
      }),
    );
    deleteDialog.close();
    await router.invalidate();
  };

  const handleEdit = async (data: AllergyFormSchema) => {
    const allergy = editDialog.state;
    if (!allergy) return;
    await updateAllergy({
      userId,
      resourceType,
      allergyIntoleranceId: allergy.id,
      ...data,
    });
    editDialog.close();
    await router.invalidate();
  };

  const columns = [
    columnHelper.accessor("type", {
      header: "Type",
      cell: (props) => stringifyAllergyType(props.getValue()),
    }),
    columnHelper.accessor("medication", {
      header: "Medication",
      cell: (props) => {
        const medication = props.getValue();
        return medication ? medicationsMap.get(medication)?.name : "";
      },
    }),
    columnHelper.display({
      id: "actions",
      cell: (props) => {
        const allergy = props.row.original;
        return (
          <RowDropdownMenu>
            <DropdownMenuItem onClick={() => editDialog.open(allergy)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteDialog.open(allergy)}>
              <Trash />
              Delete
            </DropdownMenuItem>
          </RowDropdownMenu>
        );
      },
    }),
  ];

  return (
    <>
      <AllergyFormDialog
        onSubmit={handleCreate}
        open={createDialog.isOpen}
        onOpenChange={createDialog.setIsOpen}
        medications={medications}
      />
      <AllergyFormDialog
        onSubmit={handleEdit}
        open={editDialog.isOpen}
        onOpenChange={editDialog.close}
        allergy={editDialog.state}
        medications={medications}
      />
      <ConfirmDeleteDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.close}
        entityName="allergy"
        onDelete={handleDelete}
      />
      <DataTable
        columns={columns}
        data={allergyIntolerances}
        entityName="allergies"
        tableView={{
          onRowClick: editDialog.open,
        }}
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
  );
};
