//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import {
  type AsideBrandLayoutProps,
  AsideBrandLayout,
} from "@stanfordspezi/spezi-web-design-system/molecules/AsideBrandLayout";
import { Logo } from "@/components/icons/Logo";
import { LogoType } from "@/components/icons/LogoType";

export const AsideEngageLayout = (
  props: Omit<AsideBrandLayoutProps, "aside">,
) => (
  <AsideBrandLayout
    aside={
      <>
        <div className="flex-center text-primary gap-6">
          <div className="flex-center bg-primary size-20 rounded-lg">
            <Logo className="w-10 text-white" />
          </div>
          <LogoType className="h-auto w-48" />
        </div>
        <img
          src="/stanfordbiodesign.png"
          alt="Stanford Biodesign Logo"
          className="h-[193px]"
        />
      </>
    }
    {...props}
  />
);
