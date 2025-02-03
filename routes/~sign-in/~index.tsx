//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { SignInForm as AuthSignInForm } from "@stanfordspezi/spezi-web-design-system/modules/auth";
import { createFileRoute } from "@tanstack/react-router";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Helmet } from "react-helmet";
import { AsideEngageLayout } from "@/components/AsideEngageLayout";
import { env } from "@/env";
import { authProvider, auth } from "@/modules/firebase/app";

const SignIn = () => (
  <AsideEngageLayout>
    <Helmet>
      <title>Sign In</title>
    </Helmet>
    <AuthSignInForm
      className="mx-auto w-[350px]"
      providers={[
        { name: "Stanford", provider: authProvider.stanford },
        { name: "Johns Hopkins", provider: authProvider.johnsHopkins },
        { name: "Michigan", provider: authProvider.michigan },
      ]}
      enableEmailPassword={env.VITE_PUBLIC_EMAIL_PASSWORD_SIGN_IN}
      auth={auth}
      signInWithPopup={signInWithPopup}
      signInWithEmailAndPassword={signInWithEmailAndPassword}
    />
  </AsideEngageLayout>
);

export const Route = createFileRoute("/sign-in/")({
  component: SignIn,
});
