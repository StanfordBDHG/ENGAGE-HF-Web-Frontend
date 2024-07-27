//
// This source file is part of the Stanford Biodesign Digital Health ENGAGE-HF open-source project
//
// SPDX-FileCopyrightText: 2023 Stanford University and the project authors (see CONTRIBUTORS.md)
//
// SPDX-License-Identifier: MIT
//
'use client'
import { format, isDate } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { type ComponentProps } from 'react'
import { type DayPicker } from 'react-day-picker'
import { cn } from '../../utils/className'
import { Button } from '../Button'
import { Calendar } from '../Calendar'
import { Popover, PopoverTrigger, PopoverContent } from '../Popover'

export type DatePickerProps = ComponentProps<typeof DayPicker>

export const DatePicker = ({ selected, ...props }: DatePickerProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        className={cn(
          '!w-[280px] !justify-start !text-left',
          !selected && '!text-muted-foreground',
        )}
      >
        <CalendarIcon className="size-4" />
        {selected && isDate(selected) ? format(selected, 'PPP') : 'Pick a date'}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="!w-auto !p-0">
      <Calendar {...props} />
    </PopoverContent>
  </Popover>
)
