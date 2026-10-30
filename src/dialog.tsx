"use client";

import type * as React from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";

import { cn } from "./lib/utils";
import { Button } from "./button";
import { CloseIcon } from "./lib/internal-icons";

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  /**
   * When `true`, clicking outside the dialog (backdrop / pointer
   * dismissal) does not close it. It can then only be closed via an
   * explicit action — the close button, `Esc`, or programmatically.
   *
   * Use this for dialogs containing forms, wizards, or other content
   * where an accidental outside click shouldn't discard the user's work.
   *
   * @default false
   */
  disablePointerDismissal?: boolean;
};
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Backdrop>;
type DialogPopupProps = React.ComponentProps<typeof DialogPrimitive.Popup>;
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
type DialogDescriptionProps = React.ComponentProps<
  typeof DialogPrimitive.Description
>;

type DialogContentProps = DialogPopupProps & {
  showCloseButton?: boolean;
};

type DialogHeaderProps = React.ComponentProps<"div">;

type DialogFooterProps = React.ComponentProps<"div">;

function Dialog({ disablePointerDismissal, ...props }: DialogProps) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      disablePointerDismissal={disablePointerDismissal}
      {...props}
    />
  );
}

function DialogTrigger({ ...props }: DialogTriggerProps) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPortalProps) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogCloseProps) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

function DialogOverlay({ className, ...props }: DialogOverlayProps) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "motion-scrim fixed inset-0 isolate z-50 bg-scrim supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "motion-scale-lg bg-foundation border-edge fixed top-1/2 start-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 gap-6 rounded-lg p-6 text-sm border focus-visible:outline-hidden sm:max-w-sm shadow-lg",
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-3 end-3"
                size="icon-sm"
              />
            }
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: DialogFooterProps) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: DialogTitleProps) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      // pe-8 reserves room for the close button (absolute, top-2 end-2) so a
      // long title wraps before it instead of running underneath.
      className={cn("text-lg font-medium leading-none pe-8", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: DialogDescriptionProps) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted *:[a]:hover:text-contrast text-sm *:[a]:underline *:[a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

export type {
  DialogProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogCloseProps,
  DialogOverlayProps,
  DialogPopupProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
};
