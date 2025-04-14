//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { getUserInfo } from "@stanfordspezi/spezi-web-design-system/modules/auth";
import {
  DashboardLayout as DashboardLayoutBase,
  type DashboardLayoutProps as DashboardLayoutPropsBase,
} from "@stanfordspezi/spezi-web-design-system/molecules/DashboardLayout";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/icons/Logo";
import { LogoType } from "@/components/icons/LogoType";
import { useUser } from "@/modules/firebase/UserProvider";
import { MenuLinks } from "@/routes/~_dashboard/MenuLinks";
import { User } from "@/routes/~_dashboard/User";

interface DashboardLayoutProps
  extends Omit<DashboardLayoutPropsBase, "aside" | "mobile"> {}

export const DashboardLayout = (props: DashboardLayoutProps) => {
  const { user, auth } = useUser();
  const role = user.type;
  const userUI = <User user={getUserInfo(auth)} />;

  return (
    <DashboardLayoutBase
      aside={
        <>
          <Link
            to="/"
            className="interactive-opacity flex-center w-full gap-4 px-2 pt-4 xl:px-8"
          >
            <Logo className="text-primary w-8" />
            <LogoType className="hidden h-auto! w-full! xl:block" />
          </Link>
          <nav className="mt-9 flex flex-col gap-1 xl:w-full">
            <MenuLinks userType={role} />
          </nav>
          {userUI}
        </>
      }
      mobile={
        <>
          <nav className="mt-9 flex flex-col gap-1 px-4">
            <MenuLinks userType={role} />
          </nav>
          {userUI}
        </>
      }
      {...props}
    />
  );
};
