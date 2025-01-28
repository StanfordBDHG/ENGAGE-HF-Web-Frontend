//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { initializeApp } from "@firebase/app";
import { connectFunctionsEmulator, getFunctions } from "@firebase/functions";
import { type UserType } from "@stanfordbdhg/engagehf-models";
import { toast } from "@stanfordspezi/spezi-web-design-system/components/Toaster";
import { queryOptions } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { connectAuthEmulator, getAuth, OAuthProvider } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { env } from "@/env";
import { firebaseConfig } from "@/modules/firebase/config";
import {
  getCallables,
  getCollectionRefs,
  getDocDataOrThrow,
  getDocumentsRefs,
} from "@/modules/firebase/utils";
import { queryClient } from "@/modules/query/queryClient";
import { routes } from "@/modules/routes";

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
const enableEmulation = env.VITE_PUBLIC_EMULATOR;
if (enableEmulation)
  connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

export const authProvider = {
  stanford: new OAuthProvider("oidc.stanford"),
  johnsHopkins: new OAuthProvider("oidc.johnshopkins"),
  michigan: new OAuthProvider("oidc.michigan"),
};

export const db = getFirestore(firebaseApp);
if (enableEmulation) connectFirestoreEmulator(db, "127.0.0.1", 8080);
const functions = getFunctions(firebaseApp);
if (enableEmulation) connectFunctionsEmulator(functions, "127.0.0.1", 5001);

export const callables = getCallables(functions);
export const refs = getCollectionRefs(db);
export const docRefs = getDocumentsRefs(db);

export const userQueryOptions = (opts: { id: string }) =>
  queryOptions({
    queryKey: ["user", opts],
    queryFn: () => getDocDataOrThrow(docRefs.user(opts.id)),
  });

export const getCurrentUser = async () => {
  if (!auth.currentUser) throw new Error("UNAUTHENTICATED");
  const user = await queryClient.ensureQueryData(
    userQueryOptions({ id: auth.currentUser.uid }),
  );
  return {
    currentUser: auth.currentUser,
    user,
  };
};

export const ensureType = async (types: UserType[]) => {
  const { user } = await getCurrentUser();
  if (!types.includes(user.type)) {
    toast.error(`You don't have permissions to access this page`);
    throw redirect({ to: routes.home });
  }
};
