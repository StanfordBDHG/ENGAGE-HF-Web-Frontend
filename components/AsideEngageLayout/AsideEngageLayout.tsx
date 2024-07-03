//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import Image from 'next/image'
import {
  type AsideBrandLayoutProps,
  AsideBrandLayout,
} from '@stanfordbdhg/design-system/molecules/AsideBrandLayout'

export const AsideEngageLayout = (
  props: Omit<AsideBrandLayoutProps, 'aside'>,
) => (
  <AsideBrandLayout
    aside={
      <>
        <h2 className="text-6xl font-light tracking-widest text-primary">
          ENGAGE-HF
        </h2>
        <Image
          src="/stanfordbiodesign.png"
          alt="Stanford Biodesign Logo"
          width={317}
          height={117}
        />
      </>
    }
    {...props}
  />
)
