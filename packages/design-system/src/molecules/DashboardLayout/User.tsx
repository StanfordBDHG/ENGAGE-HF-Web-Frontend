'use client'
import { forwardRef } from 'react'
import { Avatar } from '../../components/Avatar'
import { Button, type ButtonProps } from '../../components/Button'
import { type Nil } from '../../utils/misc'

type UserMenuItemProps = Omit<ButtonProps, 'name'> & {
  name: Nil<string>
  img: Nil<string>
}

export const UserMenuItem = forwardRef<HTMLButtonElement, UserMenuItemProps>(
  ({ name, img, ...props }, ref) => (
    <Button
      variant="ghost"
      className="mt-auto gap-3 px-3 py-2 transition xl:w-full xl:self-start"
      ref={ref}
      {...props}
    >
      <Avatar size="sm" name={name} src={img} />
      <span className="truncate lg:hidden xl:block">{name}</span>
    </Button>
  ),
)
UserMenuItem.displayName = 'UserMenuItem'
