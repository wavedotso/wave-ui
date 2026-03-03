"use client"

import * as React from "react"
import { DrawerPreview as DrawerPrimitive } from "@base-ui/react/drawer"

import { cn } from "./lib/utils"
import { Button } from "./button"
import { CloseIcon } from "./lib/internal-icons"

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>
type DrawerTriggerProps = React.ComponentProps<typeof DrawerPrimitive.Trigger>
type DrawerPortalProps = React.ComponentProps<typeof DrawerPrimitive.Portal>
type DrawerCloseProps = React.ComponentProps<typeof DrawerPrimitive.Close>
type DrawerOverlayProps = React.ComponentProps<typeof DrawerPrimitive.Backdrop>
type DrawerPopupProps = React.ComponentProps<typeof DrawerPrimitive.Popup>
type DrawerTitleProps = React.ComponentProps<typeof DrawerPrimitive.Title>
type DrawerDescriptionProps = React.ComponentProps<typeof DrawerPrimitive.Description>
type DrawerHeaderProps = React.ComponentProps<"div">
type DrawerFooterProps = React.ComponentProps<"div">

type DrawerContentProps = DrawerPopupProps & {
  showCloseButton?: boolean
}

function Drawer({ ...props }: DrawerProps) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({ ...props }: DrawerTriggerProps) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({ ...props }: DrawerPortalProps) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({ ...props }: DrawerCloseProps) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({ className, ...props }: DrawerOverlayProps) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/10 transition-opacity duration-300 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  showCloseButton = false,
  ...props
}: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        className={cn(
          // Base layout & appearance
          "group/drawer-content bg-background fixed z-50 flex flex-col overflow-y-auto text-sm shadow-lg outline-none",
          // Transition — animate translate, disable during swipe
          "transition-[translate] duration-300 ease-out data-[swiping]:duration-0",
          // Bottom drawer (swipeDirection="down")
          "data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:max-h-[80vh] data-[swipe-direction=down]:rounded-t-xl data-[swipe-direction=down]:border-t",
          // Top drawer (swipeDirection="up")
          "data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[80vh] data-[swipe-direction=up]:rounded-b-xl data-[swipe-direction=up]:border-b",
          // Left drawer (swipeDirection="left")
          "data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:rounded-r-xl data-[swipe-direction=left]:border-r data-[swipe-direction=left]:sm:max-w-sm",
          // Right drawer (swipeDirection="right")
          "data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:rounded-l-xl data-[swipe-direction=right]:border-l data-[swipe-direction=right]:sm:max-w-sm",
          // Enter/exit slide — bottom
          "data-[swipe-direction=down]:data-[starting-style]:translate-y-full data-[swipe-direction=down]:data-[ending-style]:translate-y-full",
          // Enter/exit slide — top
          "data-[swipe-direction=up]:data-[starting-style]:-translate-y-full data-[swipe-direction=up]:data-[ending-style]:-translate-y-full",
          // Enter/exit slide — left
          "data-[swipe-direction=left]:data-[starting-style]:-translate-x-full data-[swipe-direction=left]:data-[ending-style]:-translate-x-full",
          // Enter/exit slide — right
          "data-[swipe-direction=right]:data-[starting-style]:translate-x-full data-[swipe-direction=right]:data-[ending-style]:translate-x-full",
          className,
        )}
        {...props}
      >
        {/* Drag handle — visible only for bottom drawers */}
        <div className="bg-muted mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full group-data-[swipe-direction=down]/drawer-content:block" />
        {children}
        {showCloseButton && (
          <DrawerPrimitive.Close
            data-slot="drawer-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <CloseIcon />
            <span className="sr-only">Close</span>
          </DrawerPrimitive.Close>
        )}
      </DrawerPrimitive.Popup>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[swipe-direction=down]/drawer-content:text-center group-data-[swipe-direction=up]/drawer-content:text-center md:text-left",
        className,
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  )
}

function DrawerTitle({ className, ...props }: DrawerTitleProps) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("text-foreground text-base font-medium", className)}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: DrawerDescriptionProps) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
