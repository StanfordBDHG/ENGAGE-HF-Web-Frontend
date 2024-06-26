//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import Image from 'next/image'

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <Image
          src={`${process.env.basePath ?? ''}/stanfordbiodesign.png`}
          alt="Stanford Biodesign Logo"
          width={634}
          height={235}
        />
        <h1 className="mt-4 text-center text-3xl">
          Welcome to the Stanford Biodesign Digital Health ENGAGE-HF Web
          Frontend
        </h1>
      </div>
    </div>
  )
}
