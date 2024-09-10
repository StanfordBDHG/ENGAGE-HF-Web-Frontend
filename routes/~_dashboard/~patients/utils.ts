//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { groupBy } from 'es-toolkit'
import { query, where } from 'firebase/firestore'
import { queryClient } from '@/app/ReactQueryClientProvider'
import { getCurrentUser, refs } from '@/modules/firebase/guards'
import { AllergyType } from '@/modules/firebase/models/allergy'
import {
  type FHIRAllergyIntolerance,
  FHIRAllergyIntoleranceCriticality,
  FHIRAllergyIntoleranceType,
  FHIRExtensionUrl,
} from '@/modules/firebase/models/medication'
import { mapAuthData } from '@/modules/firebase/user'
import {
  getDocsData,
  ObservationType,
  type ResourceType,
  UserType,
} from '@/modules/firebase/utils'
import { userOrganizationQueryOptions } from '@/modules/user/queries'

const getUserClinicians = async () => {
  const { user } = await getCurrentUser()
  let usersQuery = query(
    refs.users(),
    where('type', 'in', [UserType.clinician, UserType.owner]),
  )
  if (user.type === UserType.owner || user.type === UserType.clinician) {
    usersQuery = query(
      usersQuery,
      where('organization', '==', user.organization),
    )
  }
  const users = await getDocsData(usersQuery)
  return mapAuthData(
    { userIds: users.map((user) => user.id) },
    ({ auth }, id) => ({
      id,
      displayName: auth.displayName,
      email: auth.email,
    }),
  )
}

export const getFormProps = async () => ({
  clinicians: await getUserClinicians(),
  organizations: await queryClient.ensureQueryData(
    userOrganizationQueryOptions(),
  ),
})

export const getMedicationsData = async () => {
  const medicationClasses = await getDocsData(refs.medicationClasses())
  const medicationsDocs = await getDocsData(refs.medications())

  const prefix = 'medicationClasses'

  const getMedications = medicationsDocs.map(async (doc) => {
    const medicationClassExtension = doc.extension?.find((extension) =>
      extension.valueReference?.reference.startsWith(prefix),
    )
    const medicationClassId =
      medicationClassExtension?.valueReference?.reference.slice(
        prefix.length + 1,
      )

    const drugsDocs = await getDocsData(refs.drugs(doc.id))
    const dosageInstruction = doc.extension
      ?.find(
        (extension) =>
          extension.valueMedicationRequest &&
          extension.url.endsWith('/targetDailyDose'),
      )
      ?.valueMedicationRequest?.dosageInstruction?.at(0)

    return {
      id: doc.id,
      name: doc.code?.coding?.at(0)?.display ?? '',
      medicationClassId,
      dosage: {
        frequencyPerDay: dosageInstruction?.timing?.repeat?.period ?? 1,
        quantity:
          dosageInstruction?.doseAndRate?.at(0)?.doseQuantity?.value ?? 1,
      },
      drugs: drugsDocs
        .map((drug) => ({
          id: drug.id,
          medicationId: doc.id,
          medicationClassId,
          name: drug.code?.coding?.at(0)?.display ?? '',
          ingredients:
            drug.ingredient?.map((ingredient) => {
              const name =
                ingredient.itemCodeableConcept?.coding?.at(0)?.display ?? ''
              const unit = ingredient.strength?.numerator?.unit ?? ''
              const strength =
                (ingredient.strength?.numerator?.value ?? 1) /
                (ingredient.strength?.denominator?.value ?? 1)
              return {
                name,
                strength,
                unit,
              }
            }) ?? [],
        }))
        .sort((a, b) => {
          const name = a.name.localeCompare(b.name)
          return name === 0 ?
              (a.ingredients.at(0)?.strength ?? 0) -
                (b.ingredients.at(0)?.strength ?? 0)
            : name
        }),
    }
  })

  const formattedMedications = await Promise.all(getMedications)
  const medicationsByClass = groupBy(
    formattedMedications,
    (medication) => medication.medicationClassId ?? '',
  )

  const medications = medicationClasses.map((medicationClass) => ({
    id: medicationClass.id,
    name: medicationClass.name,
    medications: medicationsByClass[medicationClass.id] ?? [],
  }))

  return { medications }
}

export const getLabsData = async ({
  userId,
  resourceType,
}: {
  userId: string
  resourceType: ResourceType
}) => {
  const rawObservations = await Promise.all(
    Object.values(ObservationType).map(async (type) => {
      return {
        type,
        data: await getDocsData(
          refs.userObservation({ userId, resourceType, observationType: type }),
        ),
      }
    }),
  )

  const observations = rawObservations.flatMap((observations) =>
    observations.data.map((observation) => ({
      id: observation.id,
      effectiveDateTime: observation.effectiveDateTime,
      value: observation.valueQuantity?.value,
      unit: observation.valueQuantity?.unit,
      type: observations.type,
    })),
  )

  return { observations, userId, resourceType }
}

export const getAllergyType = (allergy: FHIRAllergyIntolerance) => {
  if (
    allergy.type === FHIRAllergyIntoleranceType.allergy &&
    allergy.criticality === FHIRAllergyIntoleranceCriticality.high
  )
    return AllergyType.severeAllergy
  if (allergy.type === FHIRAllergyIntoleranceType.allergy)
    return AllergyType.allergy
  if (allergy.type === FHIRAllergyIntoleranceType.intolerance)
    return AllergyType.intolerance
  if (allergy.type === FHIRAllergyIntoleranceType.financial)
    return AllergyType.financial
  return AllergyType.preference
}

export const getAllergiesData = async ({
  userId,
  resourceType,
}: {
  userId: string
  resourceType: ResourceType
}) => {
  const rawAllergies = await getDocsData(
    refs.allergyIntolerances({ userId, resourceType }),
  )
  const allergyIntolerances = rawAllergies.map((allergy) => ({
    id: allergy.id,
    type: getAllergyType(allergy),
    medication: allergy.code?.coding?.at(0)?.code,
  }))
  return { allergyIntolerances, userId, resourceType }
}

export const getAppointmentsData = async ({
  userId,
  resourceType,
}: {
  userId: string
  resourceType: ResourceType
}) => {
  const rawAppointments = await getDocsData(
    refs.appointments({ userId, resourceType }),
  )
  const appointments = rawAppointments.map((appointment) => ({
    ...appointment,
    providerName: appointment.extension?.find(
      (extension) =>
        extension.url === (FHIRExtensionUrl.providerName as string),
    )?.valueString,
  }))
  return { appointments, userId, resourceType }
}

export type AllergiesData = Awaited<ReturnType<typeof getAllergiesData>>
export type Allergy = AllergiesData['allergyIntolerances'][number]
export type AppointmentsData = Awaited<ReturnType<typeof getAppointmentsData>>
export type Appointment = AppointmentsData['appointments'][number]
export type LabsData = Awaited<ReturnType<typeof getLabsData>>
export type Observation = LabsData['observations'][number]
export type MedicationsData = Awaited<ReturnType<typeof getMedicationsData>>
