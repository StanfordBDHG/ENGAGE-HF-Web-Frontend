import { FHIRExtensionUrl } from '@stanfordbdhg/engagehf-models'
import { type FHIRAppointment } from '@/modules/firebase/models'

export const getProviderName = (appointment: FHIRAppointment) =>
  appointment.extension?.find(
    (extension) => extension.url === (FHIRExtensionUrl.providerName as string),
  )?.valueString

export const parseAppointment = (appointment: FHIRAppointment) => ({
  ...appointment,
  providerName: getProviderName(appointment),
})
