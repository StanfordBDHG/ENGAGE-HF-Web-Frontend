import { type HTMLProps, type ReactNode } from 'react'
import { cn } from '../../utils/className'

type SideLabelProps = Omit<HTMLProps<HTMLLabelElement>, 'label'> & {
  label?: ReactNode
}

/**
 * Component to use together with radio, checkbox or switch controls
 * */
export const SideLabel = ({
  children,
  className,
  label,
  ...props
}: SideLabelProps) => (
  <label
    className={cn(
      'flex cursor-pointer select-none items-center gap-2.5',
      className,
    )}
    {...props}
  >
    <div className="mt-1">{children}</div>
    <div className="text-sm leading-none">{label}</div>
  </label>
)