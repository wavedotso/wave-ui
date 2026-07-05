"use client"

import * as React from "react"

import { cn } from "./lib/utils"

export type TextareaProps = Omit<React.ComponentProps<"textarea">, "onChange"> & {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  onValueChange?: (value: string) => void
}

function Textarea({ className, onChange, onValueChange, ...props }: TextareaProps) {
  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    onChange?.(e)
    onValueChange?.(e.target.value)
  }

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-edge dark:bg-edge/30 focus-visible:border-focus focus-visible:ring-focus/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 resize-none disabled:bg-edge/50 disabled:cursor-not-allowed dark:disabled:bg-edge/80 placeholder:text-soft flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-2.5 py-2 text-base transition-colors outline-hidden focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm",
        className,
      )}
      onChange={handleChange}
      {...props}
    />
  )
}

export { Textarea }
