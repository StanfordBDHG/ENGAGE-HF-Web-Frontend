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
import { stringifyType } from "@/modules/firebase/role";
import { useUser } from "@/modules/firebase/UserProvider";
import { routes } from "@/modules/routes";
import { createSharedUserColumns, userColumnIds } from "@/modules/user/table";
import { UserMenu } from "@/routes/~_dashboard/~users/UserMenu";
import { type User } from "@/routes/~_dashboard/~users/~index";
import { useNavigateOrOpen } from "@/utils/useNavigateOrOpen";

const columnHelper = createColumnHelper<User>();
const userColumns = createSharedUserColumns<User>();
const columns = [
  userColumns.id,
  userColumns.displayName,
  userColumns.email,
  columnHelper.accessor("type", {
    header: "Type",
    cell: (props) => {
      const value = props.getValue();
      return value ? stringifyType(value) : "-";
    },
  }),
  userColumns.organization,
  userColumns.disabled,
  columnHelper.display({
    id: "actions",
    cell: (props) => <UserMenu user={props.row.original} />,
  }),
];

interface UsersDataTableProps
  extends RequiredSome<DataTableProps<User>, "data"> {}

export const UsersTable = (props: UsersDataTableProps) => {
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
      entityName="users"
      tableView={{
        onRowClick: (user, event) =>
          void navigateOrOpen(event, {
            to: routes.users.user(user.resourceId, user.resourceType),
          }),
      }}
      {...props}
    />
  );
};
