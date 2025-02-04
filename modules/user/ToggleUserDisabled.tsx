//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { DropdownMenuItem } from "@stanfordspezi/spezi-web-design-system/components/DropdownMenu";
import { toast } from "@stanfordspezi/spezi-web-design-system/components/Toaster";
import { getUserName } from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { useRouter } from "@tanstack/react-router";
import { ShieldX, ShieldCheck } from "lucide-react";
import { callables } from "@/modules/firebase/app";
import { useUser } from "@/modules/firebase/UserProvider";
import { type SharedUser } from "@/modules/user/table";

interface ToggleUserDisabledProps {
  user: SharedUser;
}

export const ToggleUserDisabled = ({ user }: ToggleUserDisabledProps) => {
  const router = useRouter();
  const authUser = useUser();
  const isSelf = authUser.auth.uid === user.resourceId;
  const userName = getUserName(user);

  const handleEnable = async () => {
    const enableUserPromise = callables.enableUser({ userId: user.resourceId });
    toast.promise(enableUserPromise, {
      loading: `Enabling ${userName}...`,
      success: `${userName} has been enabled.`,
      error: `Enabling ${userName} failed. Please try later.`,
    });
    await enableUserPromise;
    void router.invalidate();
  };

  const handleDisable = async () => {
    const disableUserPromise = callables.disableUser({
      userId: user.resourceId,
    });
    toast.promise(disableUserPromise, {
      loading: `Disabling ${userName}...`,
      success: `${userName} has been disabled.`,
      error: `Disabling ${userName} failed. Please try later.`,
    });
    await disableUserPromise;
    void router.invalidate();
  };

  return (
    user.resourceType === "user" && (
      <>
        {user.disabled ?
          <DropdownMenuItem onClick={handleEnable} disabled={isSelf}>
            <ShieldCheck />
            Enable
          </DropdownMenuItem>
        : <DropdownMenuItem onClick={handleDisable} disabled={isSelf}>
            <ShieldX />
            Disable
          </DropdownMenuItem>
        }
      </>
    )
  );
};
