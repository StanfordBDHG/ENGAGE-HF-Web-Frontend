import {
  type ComponentProps,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
import { Button } from '../../components/Button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/Dialog'

interface ConfirmDeleteDialogProps extends ComponentProps<typeof Dialog> {
  itemName?: ReactNode
  entityName?: ReactNode
  onDelete: MouseEventHandler
}

export const ConfirmDeleteDialog = ({
  entityName,
  itemName,
  onOpenChange,
  onDelete,
  ...props
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} {...props}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deleting {entityName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed? This action cannot be undone.
            {itemName && (
              <>
                <br />
                <b className="font-medium text-foreground">{itemName}</b> will
                be deleted forever.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onDelete} variant="destructive">
            Delete {entityName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
