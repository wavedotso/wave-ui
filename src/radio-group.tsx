"use client"

import * as React from "react"

import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"

import { Radio } from "./radio"
import { cn } from "./lib/utils"

type RadioGroupProps = React.ComponentProps<typeof RadioGroupPrimitive>
type RadioGroupItemProps = React.ComponentProps<typeof Radio>

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-2", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ ...props }: RadioGroupItemProps) {
  return (
    <Radio
      data-slot="radio-group-item"
      {...props}
    />
  )
}

export { RadioGroup, RadioGroupItem }
