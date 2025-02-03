//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { UserType } from "@stanfordbdhg/engagehf-models";
import { queryOptions } from "@tanstack/react-query";
import { query, where } from "firebase/firestore";
import { docRefs, getCurrentUser, refs } from "@/modules/firebase/app";
import { type Invitation, type Organization } from "@/modules/firebase/models";
import { mapAuthData } from "@/modules/firebase/user";
import {
  getDocData,
  getDocDataOrThrow,
  getDocsData,
  type ResourceType,
  type UserAuthenticationInformation,
} from "@/modules/firebase/utils";
import { queryClient } from "@/modules/query/queryClient";

export const getNonAdminInvitationsQuery = (organizationIds: string[]) =>
  query(
    refs.invitations(),
    where("user.organization", "in", organizationIds),
    where("user.type", "!=", UserType.admin),
  );

export const parseInvitationToUser = (
  invitation: Invitation & { id: string },
  organizationMap: Map<string, Organization>,
) => ({
  resourceId: invitation.id,
  resourceType: "invitation" as const,
  email: invitation.auth?.email,
  displayName: invitation.auth?.displayName,
  organization: organizationMap.get(invitation.user.organization ?? ""),
  type: invitation.user.type,
  disabled: invitation.user.disabled,
});

export const parseAuthToUser = (
  id: string,
  auth: UserAuthenticationInformation,
) => ({
  resourceId: id,
  resourceType: "user" as const,
  uid: id,
  email: auth.email,
  displayName: auth.displayName,
});

export const userOrganizationQueryOptions = () =>
  queryOptions({
    queryKey: ["userOrganizations"],
    queryFn: async () => {
      const { user } = await getCurrentUser();
      let organizations: Array<Organization & { id: string }> = [];
      if (user.type === UserType.admin) {
        organizations = await getDocsData(refs.organizations());
      } else if (user.organization) {
        organizations = [
          await getDocDataOrThrow(docRefs.organization(user.organization)),
        ];
      }
      return organizations;
    },
  });

export const getUserOrganizationsMap = async () => {
  const organizations = await queryClient.ensureQueryData(
    userOrganizationQueryOptions(),
  );
  return new Map(
    organizations.map(
      (organization) => [organization.id, organization] as const,
    ),
  );
};

const getUserAuthData = async (userId: string) => {
  const user = await getDocData(docRefs.user(userId));
  const allAuthData = await mapAuthData({ userIds: [userId] }, (data, id) => ({
    uid: id,
    email: data.auth.email,
    displayName: data.auth.displayName,
  }));
  const authUser = allAuthData.at(0);
  if (!authUser || !user) return null;
  return { user, authUser, resourceType: "user" as const };
};

const getUserInvitationData = async (userId: string) => {
  const invitation = await getDocData(docRefs.invitation(userId));
  if (!invitation) return null;
  if (!invitation.auth) throw new Error("Incomplete data");
  return {
    user: {
      ...invitation.user,
      invitationCode: invitation.code,
      lastActiveDate: null,
    },
    authUser: {
      uid: userId,
      email: invitation.auth.email,
      displayName: invitation.auth.displayName,
    },
    resourceType: "invitation" as const,
  };
};

const invitationPrefix = "invitation-";

/**
 * Gets user or invitation data
 * @param userId Starts with `invitation-` if user is an invitation.
 * It's necessary to prefix invitation id, because user id and invitation id are not guaranteed to be distinct
 * */
export const parseUserId = (userId: string) =>
  userId.startsWith(invitationPrefix) ?
    {
      userId: userId.slice(invitationPrefix.length),
      resourceType: "invitation" as const,
    }
  : { userId, resourceType: "user" as const };

export const getUserData = async (
  userId: string,
  resourceType: ResourceType,
  validUserTypes: UserType[],
) => {
  const data =
    resourceType === "invitation" ?
      await getUserInvitationData(userId)
    : await getUserAuthData(userId);
  return data && validUserTypes.includes(data.user.type) ? data : null;
};

export type UserData = Exclude<Awaited<ReturnType<typeof getUserData>>, null>;
