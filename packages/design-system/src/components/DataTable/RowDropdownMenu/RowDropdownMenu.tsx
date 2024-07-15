import { Ellipsis } from 'lucide-react'
import { type ReactNode } from 'react'
import { Button } from '../../Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../DropdownMenu'

interface RowDropdownMenuProps {
  /* pass DropdownMenuContent children */
  children?: ReactNode
}

/**
 * Standard DataTable row actions dropdown menu
 * */
export const RowDropdownMenu = ({ children }: RowDropdownMenuProps) => (
  <div className="text-right">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="round" className="size-6" variant="ghost">
          <Ellipsis className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  </div>
)
