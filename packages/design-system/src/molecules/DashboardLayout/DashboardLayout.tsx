'use client'
import { type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '../../components/Button'
import { cn } from '../../utils/className'
import { useOpenState } from '../../utils/useOpenState'

interface DashboardLayoutProps {
  title?: ReactNode
  actions?: ReactNode
  children?: ReactNode
  aside?: ReactNode
  mobile?: ReactNode
}

export const DashboardLayout = ({
  title,
  actions,
  children,
  aside,
  mobile,
}: DashboardLayoutProps) => {
  const menu = useOpenState()

  return (
    <div className="text-foreground [--asideWidth:86px] [--headerHeight:72px] lg:[--headerHeight:86px] xl:[--asideWidth:240px] [&_*]:[box-sizing:border-box]">
      <header className="border-b-border-layout flex h-[--headerHeight] items-center gap-4 border-x-0 border-b border-t-0 border-solid px-4 py-1 lg:ml-[--asideWidth] xl:px-8">
        {title}
        <div className="ml-auto gap-4">
          {actions}
          <Button onClick={menu.toggle} className="lg:hidden">
            <Menu />
          </Button>
        </div>
      </header>
      <aside className="border-r-border-layout fixed left-0 top-0 hidden h-screen w-[--asideWidth] flex-col items-center border-y-0 border-l-0 border-r border-solid bg-surface py-4 lg:flex xl:px-4">
        {aside}
      </aside>
      <div
        className={cn(
          'bg-background fixed left-0 right-0 top-[calc(var(--headerHeight)+1px)] flex h-[calc(100vh-var(--headerHeight)-1px)] w-screen flex-col overflow-y-auto bg-surface transition duration-300 lg:hidden',
          menu.isOpen ? 'translate-x-0' : (
            'pointer-events-none -translate-x-24 opacity-0'
          ),
        )}
      >
        {actions && <div>{actions}</div>}
        {mobile}
      </div>
      <div className="flex min-h-[calc(100vh-var(--headerHeight))] flex-col px-4 pb-12 pt-6 md:px-12 md:pb-16 md:pt-10 lg:ml-[--asideWidth]">
        {children}
      </div>
    </div>
  )
}
