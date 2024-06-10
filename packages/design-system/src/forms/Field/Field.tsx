'use client'
import type { ReactElement, ReactNode } from 'react'
import {
  Controller,
  type ControllerFieldState,
  type ControllerProps,
  type ControllerRenderProps,
  type ErrorOption,
  type FieldPath,
  type FieldValues,
  type UseFormStateReturn,
} from 'react-hook-form'
import { Error } from '../../components/Error'
import { Label } from '../../components/Label'

type FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> & {
  render: ({
    field,
    fieldState,
    formState,
  }: {
    field: ControllerRenderProps<TFieldValues, TName> & {
      id: string
      'aria-invalid': boolean
      'aria-describedby': string
    }
    fieldState: ControllerFieldState
    formState: UseFormStateReturn<TFieldValues>
  }) => ReactElement
  label?: ReactNode
  className?: string
  checkEmptyError?: boolean
  error?: ErrorOption
}

export const Field = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  name,
  className,
  checkEmptyError,
  render,
  error: errorProp,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  const id = name
  return (
    <Controller
      {...props}
      name={name}
      render={(states) => {
        const errorId = `${id}-error`
        const error = errorProp ?? states.fieldState.error
        const fieldProps = {
          ...states.field,
          id,
          'aria-describedby': error ? errorId : '',
          'aria-invalid': !!error,
        }
        return (
          <div className={className}>
            {label && (
              <Label htmlFor={id} className="mb-2 block">
                {label}
              </Label>
            )}
            {render({
              ...states,
              field: fieldProps,
            })}
            <Error id={errorId} checkEmpty={checkEmptyError}>
              {error?.message}
            </Error>
          </div>
        )
      }}
    />
  )
}
