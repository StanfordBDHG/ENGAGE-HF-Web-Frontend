//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//

import { FHIRExtensionUrl } from "@stanfordbdhg/engagehf-models";
import { queryOptions } from "@tanstack/react-query";
import { orderBy, query } from "firebase/firestore";
import { refs } from "@/modules/firebase/app";
import { type FHIRAppointment } from "@/modules/firebase/models";
import { getDocsData } from "@/modules/firebase/utils";

export const getProviderName = (appointment: FHIRAppointment) =>
  appointment.extension?.find(
    (extension) => extension.url === (FHIRExtensionUrl.providerName as string),
  )?.valueString;

export const parseAppointment = (appointment: FHIRAppointment) => ({
  ...appointment,
  providerName: getProviderName(appointment),
});

export const appointmentsQueries = {
  list: (payload: Parameters<typeof refs.appointments>[0]) =>
    queryOptions({
      queryKey: ["listAppointments", payload],
      queryFn: () =>
        getDocsData(
          query(refs.appointments(payload), orderBy("created", "desc")),
        ),
    }),
};
