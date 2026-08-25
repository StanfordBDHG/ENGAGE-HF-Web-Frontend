//
// This source file is part of the ENGAGE-HF Web Frontend open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { SignInForm as AuthSignInForm } from "@schmiedmayerlab/grove-design-system/modules/auth";
import { createFileRoute } from "@tanstack/react-router";
import {
  signInWithEmailAndPassword,
  signInWithPopup as firebaseSignInWithPopup,
} from "firebase/auth";
import { AsideEngageLayout } from "@/components/AsideEngageLayout";
import { env } from "@/env";
import { auth, authProvider } from "@/modules/firebase/app";
import { getTitle } from "@/utils/head";
import johnsHopkingsLogoImg from "./johnsHopkinsLogo.png";
import michiganLogoImg from "./michiganLogo.png";
import stanfordLogoImg from "./stanfordLogo.png";

// The design system swallows and rethrows a generic "Unknown error" for any
// SSO failure without logging the original error, making production
// failures undiagnosable. Log it here before it reaches that catch block.
const signInWithPopup: typeof firebaseSignInWithPopup = async (
  auth,
  provider,
) => {
  try {
    return await firebaseSignInWithPopup(auth, provider);
  } catch (error) {
    console.error("SSO sign-in failed", error);
    throw error;
  }
};

const SignIn = () => (
  <AsideEngageLayout>
    <title>{getTitle("Sign In")}</title>
    <AuthSignInForm
      className="mx-auto w-[350px]"
      providers={[
        {
          name: "Stanford",
          provider: authProvider.stanford,
          icon: (
            <img
              src={stanfordLogoImg}
              alt="Stanford University logo"
              className="w-[22px]"
            />
          ),
        },
        {
          name: "Johns Hopkins",
          provider: authProvider.johnsHopkins,
          icon: (
            <img
              src={johnsHopkingsLogoImg}
              alt="Johns Hopkins University logo"
              className="w-[32px]"
            />
          ),
        },
        {
          name: "Michigan",
          provider: authProvider.michigan,
          icon: (
            <img
              src={michiganLogoImg}
              alt="University of Michigan logo"
              className="w-[51px]"
            />
          ),
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
