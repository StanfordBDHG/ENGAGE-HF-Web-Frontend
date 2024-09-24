import { Link } from '@tanstack/react-router'
import {
  Notification,
  type NotificationProps,
} from '@/packages/design-system/src/molecules/Notifications/Notification'

interface NotificationLinkProps extends Omit<NotificationProps, 'asChild'> {
  href: string
}

export const NotificationLink = ({
  notification,
  children,
  href,
}: NotificationLinkProps) => (
  <Notification asChild notification={notification}>
    <Link to={href} className="cursor-pointer transition hover:bg-accent/50">
      {children}
    </Link>
  </Notification>
)
