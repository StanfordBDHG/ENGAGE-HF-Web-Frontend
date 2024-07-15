import { ClipboardCopy } from 'lucide-react'
import { type ReactNode } from 'react'
import { cn } from '../../utils/className'
import { copyToClipboard } from '../../utils/misc'

interface CopyTextProps {
  children?: ReactNode
  className?: string
  label?: string
  value?: string
}

export const CopyText = ({ children, className, value }: CopyTextProps) => (
  <button
    type="button"
    className={cn(
      'interactive-opacity flex w-full items-center gap-2',
      className,
    )}
    onClick={async () => {
      await copyToClipboard(value ?? String(children))
    }}
  >
    <span className="truncate">{children}</span>
    <span className="flex">
      <ClipboardCopy className="size-5 text-muted-foreground" />
    </span>
  </button>
)
