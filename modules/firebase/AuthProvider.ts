//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { useAuthUser } from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { useNavigate } from "@tanstack/react-router";
import { type ReactNode, useEffect } from "react";
import { auth } from "@/modules/firebase/app";
import { routes } from "@/modules/routes";

interface AuthProviderProps {
  children: ReactNode;
}

export const isRouteProtected = (path: string) =>
  path !== routes.signIn && !/\/patients\/.+\/healthSummary\//.exec(path);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const user = useAuthUser(auth);

  useEffect(() => {
    if (window.location.pathname === routes.signIn && user) {
      void navigate({ to: routes.home });
    } else if (isRouteProtected(window.location.pathname) && user === null) {
      void navigate({ to: routes.signIn });
    }
  }, [navigate, user]);

  return user !== undefined ? children : null;
};
