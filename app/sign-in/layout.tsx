//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { type ReactNode } from 'react'
import { AsideEngageLayout } from '../../components/AsideEngageLayout'

interface SignInLayoutProps {
  children?: ReactNode
}

const SignInLayout = (props: SignInLayoutProps) => (
  <AsideEngageLayout {...props} />
)

export default SignInLayout
