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
import { auth, authProvider } from "@/modules/firebase/app";
import johnsHopkingsLogoImg from "./johnsHopkinsLogo.png";
import michiganLogoImg from "./michiganLogo.png";
import stanfordLogoImg from "./stanfordLogo.png";

const SignIn = () => (
  <AsideEngageLayout>
    <Helmet>
      <title>Sign In</title>
    </Helmet>
    <AuthSignInForm
      className="mx-auto w-[350px]"
      providers={[
        {
          name: "Stanford",
          provider: authProvider.stanford,
          icon: <img src={stanfordLogoImg} alt="Stanford University logo" />,
        },
        {
          name: "Johns Hopkins",
          provider: authProvider.johnsHopkins,
          icon: (
            <img
              src={johnsHopkingsLogoImg}
              alt="Johns Hopkins University logo"
            />
          ),
        },
        {
          name: "Michigan",
          provider: authProvider.michigan,
          icon: <img src={michiganLogoImg} alt="University of Michigan logo" />,
        },
      ]}
      enableEmailPassword={env.VITE_PUBLIC_EMAIL_PASSWORD_SIGN_IN}
      auth={auth}
      buttonSize="lg"
      signInWithPopup={signInWithPopup}
      signInWithEmailAndPassword={signInWithEmailAndPassword}
    />
  </AsideEngageLayout>
);

export const Route = createFileRoute("/sign-in/")({
  component: SignIn,
});
