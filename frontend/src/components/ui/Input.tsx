/**
 * KrishiMitra AI — Accessible Input Component
 * ============================================
 * Purpose: Provide a premium, highly accessible form field supporting labels, error messages, and icons.
 * Responsibilities: Wrap native input, forward reference for React Hook Form integration, and styling states.
 * Dependencies: clsx, tailwind-merge
 * Usage: <Input label="Phone Number" error={errors.phone?.message} {...register('phone')} />
 */

import React, { useId } from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerClassName?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      containerClassName,
      id,
      disabled,
      required,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    return (
      <div className={twMerge('w-full flex flex-col gap-1.5', containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-small font-semibold text-text-primary dark:text-white flex items-center gap-1 select-none"
          >
            {label}
            {required && <span className="text-danger" aria-hidden="true">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <span className="absolute left-4 text-text-muted shrink-0 pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={
              clsx(
                error && errorId,
                helperText && helperId
              ) || undefined
            }
            className={twMerge(
              'w-full h-11 px-4 py-2.5 text-body rounded-input bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-text-primary dark:text-white placeholder:text-text-muted focus:border-brand-primary dark:focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all disabled:opacity-50 disabled:bg-background/50 dark:disabled:bg-background-dark/50 disabled:cursor-not-allowed',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-danger dark:border-danger focus:border-danger dark:focus:border-danger focus:ring-danger',
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <span className="absolute right-4 text-text-muted shrink-0 flex items-center justify-center z-10">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Validation / Helper Info */}
        {error ? (
          <span
            id={errorId}
            role="alert"
            className="text-caption font-medium text-danger animate-fade-in"
          >
            {error}
          </span>
        ) : helperText ? (
          <span
            id={helperId}
            className="text-caption text-text-secondary dark:text-text-muted select-none"
          >
            {helperText}
          </span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
