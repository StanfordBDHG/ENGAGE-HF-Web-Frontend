import Link from 'next/link'
import { type ReactNode } from 'react'
import { Tooltip } from '../../components/Tooltip'
import { cn } from '../../utils/className'

interface MenuItemProps {
  href: string
  isActive?: boolean
  icon?: ReactNode
  label?: string
}

export const MenuItem = ({ href, icon, isActive, label }: MenuItemProps) => (
  <Tooltip
    key={href}
    tooltip={label}
    sideOffset={8}
    side="right"
    className="hidden lg:block xl:hidden"
  >
    <Link
      href={href}
      className={cn(
        'focus-ring flex items-center gap-3 rounded-lg px-3 py-2 font-medium no-underline transition xl:w-full xl:self-start',
        isActive ?
          'bg-accent/50 text-primary hover:opacity-60'
        : 'text-foreground/60 hover:bg-accent hover:text-foreground',
      )}
    >
      {icon}
      <span className="lg:hidden xl:block">{label}</span>
    </Link>
  </Tooltip>
)
