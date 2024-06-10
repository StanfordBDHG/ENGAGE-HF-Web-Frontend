import Image from 'next/image'
import { type ReactNode } from 'react'

interface SignInLayoutProps {
  children?: ReactNode
}

const SignInLayout = ({ children }: SignInLayoutProps) => (
  <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
    <div className="hidden flex-col items-center justify-between gap-20 bg-muted py-40 lg:flex">
      <h2 className="text-6xl font-thin tracking-widest text-primary/30">
        ENGAGE-HF
      </h2>
      <Image
        src="/stanfordbiodesign.png"
        alt="Stanford Biodesign Logo"
        width={317}
        height={117}
      />
    </div>
    <div className="flex min-h-screen items-center justify-center py-12">
      {children}
    </div>
  </div>
)

export default SignInLayout
