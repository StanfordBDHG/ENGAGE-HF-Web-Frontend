import { type ReactNode } from 'react'

interface PageTitleProps {
  title?: ReactNode
  subTitle?: ReactNode
  icon?: ReactNode
}

export const PageTitle = ({ title, subTitle, icon }: PageTitleProps) => (
  <div className="flex items-center gap-2 lg:gap-4">
    {icon && (
      <div
        className="flex-center rounded-lg bg-foreground p-2.5 text-surface lg:px-4 lg:py-3 [&_svg]:size-5 lg:[&_svg]:size-6"
        aria-hidden
      >
        {icon}
      </div>
    )}
    <div className="flex flex-col">
      {title && (
        <h1 className="text-h4 text-base font-medium lg:text-xl">{title}</h1>
      )}
      {subTitle && <h2 className="text-b2 text-xs lg:text-sm">{subTitle}</h2>}
    </div>
  </div>
)
