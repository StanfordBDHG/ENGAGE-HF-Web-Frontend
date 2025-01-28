//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import { queryOptions } from "@tanstack/react-query";
import { type Query, query, where } from "firebase/firestore";
import { getCurrentUser, refs } from "@/modules/firebase/app";
import { type Invitation, type User } from "@/modules/firebase/models";
import { mapAuthData } from "@/modules/firebase/user";
import { getDocsData } from "@/modules/firebase/utils";
import {
  getNonAdminInvitationsQuery,
  getUserOrganizationsMap,
  parseAuthToUser,
  parseInvitationToUser,
} from "@/modules/user/queries";

export const parsePatientsQueries = async ({
  patientsQuery,
  invitationsQuery,
}: {
  patientsQuery: Query<User>;
  invitationsQuery: Query<Invitation>;
}) => {
  const patients = await getDocsData(
    query(patientsQuery, where("type", "==", UserType.patient)),
  );

  const userIds = patients.map((patient) => patient.id);
  const organizationMap = await getUserOrganizationsMap();

  const invitations = await getDocsData(
    query(invitationsQuery, where("user.type", "==", UserType.patient)),
  );

  const patientsData = await mapAuthData(
    { userIds, includeUserData: true },
    ({ auth, user }, id) => ({
      ...parseAuthToUser(id, auth),
      organization: organizationMap.get(user?.organization ?? ""),
      disabled: user?.disabled,
    }),
  );

  const invitedUsers = invitations.map((invitation) =>
    parseInvitationToUser(invitation, organizationMap),
  );

  return [...invitedUsers, ...patientsData];
};

export const patientsQueries = {
  listUserPatients: () =>
    queryOptions({
      queryKey: ["listUserPatients"],
      queryFn: async () => {
        const { user, currentUser } = await getCurrentUser();
        const organizationId = user.organization;
        if (!organizationId) return [];

        return parsePatientsQueries({
          patientsQuery: query(
            refs.users(),
            where("organization", "==", organizationId),
            where("clinician", "==", currentUser.uid),
          ),
          invitationsQuery: query(
            getNonAdminInvitationsQuery([organizationId]),
            where("user.clinician", "==", currentUser.uid),
          ),
        });
      },
    }),
};
