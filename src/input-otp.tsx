"use client";

import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";

import { cn } from "./lib/utils";
import { MinusIcon } from "./lib/internal-icons";

type InputOTPProps = React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string;
};

function InputOTP({ className, containerClassName, ...props }: InputOTPProps) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        "group/input-otp flex items-center has-disabled:opacity-50",
        containerClassName,
      )}
      spellCheck={false}
      className={cn("disabled:cursor-not-allowed", className)}
      {...props}
    />
  );
}

type InputOTPGroupProps = React.ComponentProps<"div">;

function InputOTPGroup({ className, ...props }: InputOTPGroupProps) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn("flex items-center rounded-md", className)}
      {...props}
    />
  );
}

type InputOTPSlotProps = React.ComponentProps<"div"> & {
  index: number;
};

function InputOTPSlot({ index, className, ...props }: InputOTPSlotProps) {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      className={cn(
        "border-edge dark:bg-edge/30 relative flex size-9 items-center justify-center border-y border-r text-sm motion-color outline-hidden first:rounded-l-md first:border-l last:rounded-r-md",
        "data-active:border-focus data-active:ring-3 data-active:ring-focus/50 data-active:z-10",
        "group-has-aria-invalid/input-otp:border-destructive group-has-aria-invalid/input-otp:data-active:ring-3 group-has-aria-invalid/input-otp:data-active:ring-destructive/20 dark:group-has-aria-invalid/input-otp:data-active:ring-destructive/40",
        className,
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-caret-blink bg-contrast h-4 w-px duration-1000" />
        </div>
      )}
    </div>
  );
}

type InputOTPSeparatorProps = React.ComponentProps<"div">;

function InputOTPSeparator({ className, ...props }: InputOTPSeparatorProps) {
  return (
    <div
      data-slot="input-otp-separator"
      className={cn(
        "flex items-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <MinusIcon />
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
export type {
  InputOTPProps,
  InputOTPGroupProps,
  InputOTPSlotProps,
  InputOTPSeparatorProps,
};
