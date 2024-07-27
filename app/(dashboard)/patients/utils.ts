import {
  getAuthenticatedOnlyApp,
  getCurrentUserRole,
} from '@/modules/firebase/guards'
import { Role } from '@/modules/firebase/role'
import { getDocsData } from '@/modules/firebase/utils'

export const getUserClinicians = async () => {
  const { role } = await getCurrentUserRole()
  // https://github.com/StanfordBDHG/ENGAGE-HF-Firebase/issues/37
  if (role === Role.admin) {
    return [{ id: 'fNmDipolHLgEwehQe2uiXRFwA79u', name: 'Joe Clinician' }]
  }
  return [{ id: 'fNmDipolHLgEwehQe2uiXRFwA79u', name: 'Joe Clinician' }]
}

export const getFormProps = async () => {
  const { refs } = await getAuthenticatedOnlyApp()
  return {
    clinicians: await getUserClinicians(),
    organizations: await getDocsData(refs.organizations()),
  }
}
