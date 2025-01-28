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
import { LogoType } from "@/components/icons/LogoType";

export const AsideEngageLayout = (
  props: Omit<AsideBrandLayoutProps, "aside">,
) => (
  <AsideBrandLayout
    aside={
      <>
        <LogoType className="h-auto w-80 text-primary" />
        <img
          src="/stanfordbiodesign.png"
          alt="Stanford Biodesign Logo"
          className="h-[117px] w-[317px]"
        />
      </>
    }
    {...props}
  />
);
