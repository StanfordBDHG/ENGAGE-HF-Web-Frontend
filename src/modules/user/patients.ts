//
// This source file is part of the ENGAGE-HF Web Frontend open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@schmiedmayerlab/engagehf-models";
import { toast } from "@schmiedmayerlab/grove-design-system/components/Toaster";
import {
  base64ToBlob,
  downloadFile,
} from "@schmiedmayerlab/grove-design-system/utils/file";
import { queryOptions } from "@tanstack/react-query";
import { kebabCase } from "es-toolkit";
import { type Query, query, where } from "firebase/firestore";
import { useState } from "react";
import { callables, getCurrentUser, refs } from "@/modules/firebase/app";
import { type Invitation, type User } from "@/modules/firebase/models";
import { mapAuthData } from "@/modules/firebase/user";
import { getDocsData } from "@/modules/firebase/utils";
import {
  getNonAdminInvitationsQuery,
  getUserOrganizationsMap,
  parseAuthToUser,
  parseInvitationToUser,
} from "@/modules/user/queries";

export const useDownloadPatientData = () => {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async ({
    userId,
    userName,
  }: {
    userId: string;
    userName: string;
  }) => {
    setIsPending(true);
    try {
      const exportUserData = callables.exportData({ userId });
      toast.promise(exportUserData, {
        loading: `Downloading patient data for ${userName}...`,
        success: `Patient data for ${userName} has been downloaded.`,
        error: `Downloading patient data for ${userName} failed. Please try later.`,
      });
      const response = await exportUserData;
      const blob = base64ToBlob(response.data.content, "application/zip");
      downloadFile(blob, `user-data-${kebabCase(userName)}.zip`);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, mutateAsync };
};

export const useDownloadPatientHealthSummary = () => {
  const [isPending, setIsPending] = useState(false);

  const mutateAsync = async ({
    userId,
    userName,
  }: {
    userId: string;
    userName: string;
  }) => {
    setIsPending(true);
    try {
      const exportHealthPromise = callables.exportHealthSummary({ userId });
      toast.promise(exportHealthPromise, {
        loading: `Generating health summary for ${userName}...`,
        success: `Health summary for ${userName} has been downloaded.`,
        error: `Generating health summary for ${userName} failed. Please try later.`,
      });
      const response = await exportHealthPromise;
      const blob = base64ToBlob(response.data.content, "application/pdf");
      downloadFile(blob, `health-summary-${kebabCase(userName)}.pdf`);
    } finally {
      setIsPending(false);
    }
  };

  return { isPending, mutateAsync };
};

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
      selfManaged: user?.selfManaged,
      organization: organizationMap.get(user?.organization ?? ""),
      disabled: user?.disabled,
      permanent: false,
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
