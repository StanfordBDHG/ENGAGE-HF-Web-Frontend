//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
import { useState } from 'react'
import { type InitialState, not } from '../misc'

/**
 * Handles open/close or similar boolean states
 * Mainly aims to improve readability
 *
 * @example
 * const modal = useOpenState()
 * <button onClick={modal.open} />
 * <Modal isOpen={modal.isOpen}  />
 *
 * */
export const useOpenState = (initialValue: InitialState<boolean> = false) => {
  const [isOpen, setIsOpen] = useState(initialValue)

  const close = () => setIsOpen(false)

  const open = () => setIsOpen(true)

  const toggle = () => setIsOpen(not)

  return { isOpen, setIsOpen, close, open, toggle }
}
