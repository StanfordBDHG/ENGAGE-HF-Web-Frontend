//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import {
  DataTable,
  type DataTableProps,
} from "@stanfordspezi/spezi-web-design-system/components/DataTable";
import { type RequiredSome } from "@stanfordspezi/spezi-web-design-system/utils/misc";
import { createColumnHelper } from "@tanstack/table-core";
import { useMemo } from "react";
import { useUser } from "@/modules/firebase/UserProvider";
import { routes } from "@/modules/routes";
import { createSharedUserColumns, userColumnIds } from "@/modules/user/table";
import { PatientMenu } from "@/routes/~_dashboard/~patients/PatientMenu";
import { type Patient } from "@/routes/~_dashboard/~patients/~index";
import { useNavigateOrOpen } from "@/utils/useNavigateOrOpen";

const columnHelper = createColumnHelper<Patient>();
const userColumns = createSharedUserColumns<Patient>();
const columns = [
  userColumns.id,
  userColumns.displayName,
  userColumns.email,
  userColumns.organization,
  userColumns.disabled,
  columnHelper.display({
    id: "actions",
    cell: (props) => <PatientMenu patient={props.row.original} />,
  }),
];

interface PatientsDataTableProps
  extends RequiredSome<DataTableProps<Patient>, "data"> {}

export const PatientsTable = ({ data, ...props }: PatientsDataTableProps) => {
  const navigateOrOpen = useNavigateOrOpen();
  const user = useUser();
  const visibleColumns = useMemo(
    () =>
      user.user.type === UserType.admin ?
        columns
      : columns.filter((column) => column.id !== userColumnIds.organization),
    [user.user.type],
  );
  return (
    <DataTable
      columns={visibleColumns}
      data={data}
      entityName="patients"
      tableView={{
        onRowClick: (patient, event) =>
          void navigateOrOpen(event, {
            to: routes.patients.patient(
              patient.resourceId,
              patient.resourceType,
            ),
          }),
      }}
      {...props}
    />
  );
};
