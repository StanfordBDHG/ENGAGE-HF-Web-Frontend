import {
  Toaster as ToasterBase,
  type ToasterProps as ToasterPropsBase,
} from 'sonner'

interface ToasterProps extends ToasterPropsBase {}

export const Toaster = (props: ToasterProps) => (
  <ToasterBase position="bottom-center" {...props} />
)
