//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { setDoc, updateDoc } from '@firebase/firestore'
import { Contact } from 'lucide-react'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import {
  PatientForm,
  type PatientFormSchema,
} from '@/app/(dashboard)/patients/PatientForm'
import { getFormProps } from '@/app/(dashboard)/patients/utils'
import { getAuthenticatedOnlyApp } from '@/modules/firebase/guards'
import { mapAuthData } from '@/modules/firebase/user'
import {
  getDocDataOrThrow,
  getDocsData,
  UserType,
} from '@/modules/firebase/utils'
import { routes } from '@/modules/routes'
import { getUserName } from '@/packages/design-system/src/modules/auth/user'
import { PageTitle } from '@/packages/design-system/src/molecules/DashboardLayout'
import { Medications, MedicationsFormSchema } from './Medications'
import { DashboardLayout } from '../../DashboardLayout'
import { groupBy } from 'es-toolkit'
import {
  TabsList,
  Tabs,
  TabsContent,
  TabsTrigger,
} from '@/packages/design-system/src/components/Tabs'

// TODO: Cache this
const getMedicationsData = async () => {
  const { refs } = await getAuthenticatedOnlyApp()
  const medicationClasses = await getDocsData(refs.medicationClasses())
  const medicationsDocs = await getDocsData(refs.medications())

  const prefix = 'medicationClasses'

  const getMedications = medicationsDocs.map(async (doc) => {
    const medicationClassExtension = doc.extension?.find((extension) =>
      extension.valueReference?.reference?.startsWith(prefix),
    )
    const medicationClassId =
      medicationClassExtension?.valueReference?.reference?.slice(
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

  const medicationsTree = medicationClasses.map((medicationClass) => ({
    id: medicationClass.id,
    name: medicationClass.name,
    medications: medicationsByClass[medicationClass.id] ?? [],
  }))

  return { medicationsTree }
}

const getUserMedications = async (userId: string) => {
  const { refs } = await getAuthenticatedOnlyApp()
  const medicationRequests = await getDocsData(refs.medicationRequests(userId))
  return medicationRequests.map((request) => {
    // TODO: Implement stronger mechanism
    const reference = request.medicationReference?.reference?.split('/')
    return {
      id: request.id,
      medication: reference?.at(1) ?? '',
      drug: reference?.at(3) ?? '',
      frequencyPerDay:
        request?.dosageInstruction?.at(0)?.timing?.repeat?.frequency ?? 1,
      quantity:
        request?.dosageInstruction?.at(0)?.doseAndRate?.at(0)?.doseQuantity
          ?.value ?? 1,
    }
  })
}

export type Data = Awaited<ReturnType<typeof getMedicationsData>>

interface PatientPageProps {
  params: { id: string }
}

const PatientPage = async ({ params }: PatientPageProps) => {
  const { docRefs } = await getAuthenticatedOnlyApp()
  const userId = params.id
  const allAuthData = await mapAuthData({ userIds: [userId] }, (data, id) => ({
    uid: id,
    email: data.auth.email,
    displayName: data.auth.displayName,
  }))
  const authUser = allAuthData.at(0)
  const user = await getDocDataOrThrow(docRefs.user(userId))
  if (!authUser || user.type !== UserType.patient) {
    notFound()
  }

  const updatePatient = async (form: PatientFormSchema) => {
    'use server'
    const { docRefs, callables } = await getAuthenticatedOnlyApp()
    await callables.updateUserInformation({
      userId,
      data: {
        auth: {
          displayName: form.displayName,
          email: form.email,
        },
      },
    })
    const userRef = docRefs.user(userId)
    const clinician = await getDocDataOrThrow(docRefs.user(form.clinician))
    await updateDoc(userRef, {
      invitationCode: form.invitationCode,
      clinician: form.clinician,
      organization: clinician.organization,
    })
    revalidatePath(routes.users.index)
  }

  const saveMedications = async (form: MedicationsFormSchema) => {
    'use server'
    const { docRefs } = await getAuthenticatedOnlyApp()
    // TODO: Handle removing previous data, probably a transaction
    const promises = form.medications.map(async (medication) => {
      await setDoc(docRefs.medicationRequest(userId, medication.id), {
        medicationReference: {
          reference: `medications/${medication.medication}/drugs/${medication.drug}`,
        },
        dosageInstruction: [
          {
            timing: {
              repeat: {
                frequency: medication.frequencyPerDay,
                period: 1,
                periodUnit: 'd',
              },
            },
            doseAndRate: [
              {
                doseQuantity: {
                  code: '{tbl}',
                  system: 'http://unitsofmeasure.org',
                  unit: 'tbl.',
                  value: medication.quantity,
                },
              },
            ],
          },
        ],
      })
    })
    await Promise.all(promises)
  }

  return (
    <DashboardLayout
      title={
        <PageTitle
          title="Edit patient"
          subTitle={getUserName(authUser)}
          icon={<Contact />}
        />
      }
    >
      <Tabs defaultValue="medication">
        <TabsList className="w-full">
          <TabsTrigger value="information" className="grow">
            Information
          </TabsTrigger>
          <TabsTrigger value="medication" className="grow">
            Medication
          </TabsTrigger>
        </TabsList>
        <TabsContent value="information" className="mt-6">
          <PatientForm
            user={user}
            userInfo={authUser}
            onSubmit={updatePatient}
            {...await getFormProps()}
          />
        </TabsContent>
        <TabsContent value="medication">
          <Medications
            {...await getMedicationsData()}
            onSave={saveMedications}
            defaultValues={{
              medications: await getUserMedications(userId),
            }}
          />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

export default PatientPage
