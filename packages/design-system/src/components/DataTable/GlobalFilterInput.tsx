//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { Search } from 'lucide-react'
import { Input, type InputProps } from '../Input'

export const GlobalFilterInput = (props: InputProps) => (
  <div className="relative">
    <Search className="absolute left-3 top-2.5 size-5 text-muted-foreground" />
    <Input
      placeholder="Search..."
      defaultValue=""
      className="pl-10"
      {...props}
    />
  </div>
)
