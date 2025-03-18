//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { Toaster } from "@stanfordspezi/spezi-web-design-system/components/Toaster";
import { SpeziProvider } from "@stanfordspezi/spezi-web-design-system/SpeziProvider";
import {
  createRootRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { type ComponentProps } from "react";
import { Helmet } from "react-helmet";
import { auth } from "@/modules/firebase/app";
import {
  AuthProvider,
  isRouteProtected,
} from "@/modules/firebase/AuthProvider";
import { ReactQueryClientProvider } from "@/modules/query/ReactQueryClientProvider";
import { routes } from "@/modules/routes";
import "../modules/globals.css";

const routerProps: ComponentProps<typeof SpeziProvider>["router"] = {
  Link: ({ href, ...props }) => <Link to={href} {...props} />,
};

const Root = () => (
  <AuthProvider>
    <SpeziProvider router={routerProps}>
      <ReactQueryClientProvider>
        <Helmet defaultTitle="ENGAGE-HF" titleTemplate="%s - ENGAGE-HF" />
        <Outlet />
        <Toaster />
      </ReactQueryClientProvider>
    </SpeziProvider>
  </AuthProvider>
);

export const Route = createRootRoute({
  component: Root,
  beforeLoad: async ({ location }) => {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (location.pathname === routes.signIn && user) {
      throw redirect({ to: routes.home });
    } else if (isRouteProtected(location.pathname) && !user) {
      throw redirect({ to: routes.signIn });
    }
  },
});
