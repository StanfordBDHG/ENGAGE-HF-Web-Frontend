//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { type Functions, httpsCallable } from "@firebase/functions";
import {
  type CreateInvitationInput,
  type CreateInvitationOutput,
  type DeleteUserInput,
  type DeleteUserOutput,
  type DisableUserInput,
  type DisableUserOutput,
  type DismissMessageInput,
  type DismissMessageOutput,
  type EnableUserInput,
  type EnableUserOutput,
  type ExportHealthSummaryInput,
  type ExportHealthSummaryOutput,
  type FHIRMedication,
  type GetUsersInformationInput,
  type GetUsersInformationOutput,
  type UpdateUserInformationInput,
  type UpdateUserInformationOutput,
  type UpdateStaticDataInput,
  type UpdateStaticDataOutput,
  type DefaultSeedInput,
  type DefaultSeedOutput,
} from "@stanfordbdhg/engagehf-models";
import { strategy } from "@stanfordspezi/spezi-web-design-system/utils/misc";
import {
  collection,
  type CollectionReference,
  doc,
  type DocumentReference,
  type Firestore,
  getDoc,
  getDocs,
  type Query,
} from "firebase/firestore";
import {
  type FHIRAllergyIntolerance,
  type FHIRAppointment,
  type FHIRMedicationRequest,
  type FHIRObservation,
  type Invitation,
  type MedicationClass,
  type Organization,
  type QuestionnaireResponse,
  type User,
  type UserMessage,
} from "@/modules/firebase/models";

export const collectionNames = {
  invitations: "invitations",
  users: "users",
  organizations: "organizations",
  medications: "medications",
  medicationClasses: "medicationClasses",
  drugs: "drugs",
  medicationRequests: "medicationRequests",
  appointments: "appointments",
  allergyIntolerances: "allergyIntolerances",
  creatinineObservations: "creatinineObservations",
  eGfrObservations: "eGfrObservations",
  potassiumObservations: "potassiumObservations",
  messages: "messages",
  questionnaireResponses: "questionnaireResponses",
};

export type ResourceType = "invitation" | "user";

export const userPath = (resourceType: ResourceType) =>
  strategy(
    {
      invitation: collectionNames.invitations,
      user: collectionNames.users,
    },
    resourceType,
  );

export enum UserObservationCollection {
  bodyWeight = "bodyWeightObservations",
  bloodPressure = "bloodPressureObservations",
  creatinine = "creatinineObservations",
  dryWeight = "dryWeightObservations",
  eGfr = "eGfrObservations",
  heartRate = "heartRateObservations",
  potassium = "potassiumObservations",
}

export const getCollectionRefs = (db: Firestore) => ({
  users: () =>
    collection(db, collectionNames.users) as CollectionReference<User>,
  invitations: () =>
    collection(
      db,
      collectionNames.invitations,
    ) as CollectionReference<Invitation>,
  organizations: () =>
    collection(
      db,
      collectionNames.organizations,
    ) as CollectionReference<Organization>,
  medications: () =>
    collection(
      db,
      collectionNames.medications,
    ) as CollectionReference<FHIRMedication>,
  drugs: (medicationId: string) =>
    collection(
      db,
      `/${collectionNames.medications}/${medicationId}/${collectionNames.drugs}`,
    ) as CollectionReference<FHIRMedication>,
  medicationRequests: ({
    userId,
    resourceType,
  }: {
    userId: string;
    resourceType: ResourceType;
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.medicationRequests}`,
    ) as CollectionReference<FHIRMedicationRequest>,
  appointments: ({
    userId,
    resourceType,
  }: {
    userId: string;
    resourceType: ResourceType;
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.appointments}`,
    ) as CollectionReference<FHIRAppointment>,
  allergyIntolerances: ({
    userId,
    resourceType,
  }: {
    userId: string;
    resourceType: ResourceType;
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.allergyIntolerances}`,
    ) as CollectionReference<FHIRAllergyIntolerance>,
  medicationClasses: () =>
    collection(
      db,
      collectionNames.medicationClasses,
    ) as CollectionReference<MedicationClass>,
  userObservation: ({
    userId,
    resourceType,
    observationType,
  }: {
    userId: string;
    resourceType: ResourceType;
    observationType: UserObservationCollection;
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${observationType}`,
    ) as CollectionReference<FHIRObservation>,
  userMessages: ({ userId }: { userId: string }) =>
    collection(
      db,
      `/${collectionNames.users}/${userId}/${collectionNames.messages}`,
    ) as CollectionReference<UserMessage>,
  questionnaireResponses: ({
    userId,
    resourceType,
  }: {
    userId: string;
    resourceType: ResourceType;
  }) =>
    collection(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.questionnaireResponses}`,
    ) as CollectionReference<QuestionnaireResponse>,
});

export const getDocumentsRefs = (db: Firestore) => ({
  user: (...segments: string[]) =>
    doc(db, collectionNames.users, ...segments) as DocumentReference<
      User,
      User
    >,
  invitation: (...segments: string[]) =>
    doc(db, collectionNames.invitations, ...segments) as DocumentReference<
      Invitation,
      Invitation
    >,
  organization: (...segments: string[]) =>
    doc(
      db,
      collectionNames.organizations,
      ...segments,
    ) as DocumentReference<Organization>,
  medicationRequest: ({
    userId,
    medicationRequestId,
    resourceType,
  }: {
    userId: string;
    medicationRequestId: string;
    resourceType: ResourceType;
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.medicationRequests}/${medicationRequestId}`,
    ) as DocumentReference<FHIRMedicationRequest>,
  appointment: ({
    userId,
    appointmentId,
    resourceType,
  }: {
    userId: string;
    appointmentId: string;
    resourceType: ResourceType;
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.appointments}/${appointmentId}`,
    ) as DocumentReference<FHIRAppointment>,
  allergyIntolerance: ({
    userId,
    allergyIntoleranceId,
    resourceType,
  }: {
    userId: string;
    allergyIntoleranceId: string;
    resourceType: ResourceType;
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${collectionNames.allergyIntolerances}/${allergyIntoleranceId}`,
    ) as DocumentReference<FHIRAllergyIntolerance>,
  userObservation: ({
    userId,
    resourceType,
    observationType,
    observationId,
  }: {
    userId: string;
    resourceType: ResourceType;
    observationType: UserObservationCollection;
    observationId: string;
  }) =>
    doc(
      db,
      `/${userPath(resourceType)}/${userId}/${observationType}/${observationId}`,
    ) as DocumentReference<FHIRObservation>,
  userMessage: ({ userId, messageId }: { userId: string; messageId: string }) =>
    doc(
      db,
      `/${collectionNames.users}/${userId}/${collectionNames.messages}/${messageId}`,
    ) as DocumentReference<UserMessage>,
});

export interface UserAuthenticationInformation {
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

export const getCallables = (functions: Functions) => ({
  createInvitation: httpsCallable<
    CreateInvitationInput,
    CreateInvitationOutput
  >(functions, "createInvitation"),
  getUsersInformation: httpsCallable<
    GetUsersInformationInput,
    GetUsersInformationOutput
  >(functions, "getUsersInformation"),
  deleteUser: httpsCallable<DeleteUserInput, DeleteUserOutput>(
    functions,
    "deleteUser",
  ),
  updateUserInformation: httpsCallable<
    UpdateUserInformationInput,
    UpdateUserInformationOutput
  >(functions, "updateUserInformation"),
  exportHealthSummary: httpsCallable<
    ExportHealthSummaryInput,
    ExportHealthSummaryOutput
  >(functions, "exportHealthSummary"),
  dismissMessage: httpsCallable<DismissMessageInput, DismissMessageOutput>(
    functions,
    "dismissMessage",
  ),
  updateStaticData: httpsCallable<
    UpdateStaticDataInput,
    UpdateStaticDataOutput
  >(functions, "updateStaticData"),
  defaultSeed: httpsCallable<DefaultSeedInput, DefaultSeedOutput>(
    functions,
    "defaultSeed",
  ),
  disableUser: httpsCallable<DisableUserInput, DisableUserOutput>(
    functions,
    "disableUser",
  ),
  enableUser: httpsCallable<EnableUserInput, EnableUserOutput>(
    functions,
    "enableUser",
  ),
});

export const getDocData = async <T>(reference: DocumentReference<T>) => {
  const doc = await getDoc(reference);
  const data = doc.data();
  return data ?
      {
        ...data,
        id: doc.id,
      }
    : undefined;
};

export const getDocDataOrThrow = async <T>(reference: DocumentReference<T>) => {
  const data = await getDocData(reference);
  if (!data) {
    throw new Error(`Doc not found: ${reference.path}`);
  }
  return data;
};

export const getDocsData = async <T>(query: Query<T>) => {
  const docs = await getDocs(query);
  return docs.docs.map((doc) => {
    const data = doc.data();
    if (!data) throw new Error(`No data for ${doc.id} ${doc.ref.path}`);
    return {
      ...data,
      id: doc.id,
    };
  });
};
