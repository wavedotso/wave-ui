"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { cva } from "class-variance-authority"

import { cn } from "./lib/utils"
import {
  CloseIcon,
  SuccessCircleIcon,
  InfoCircleIcon,
  AlertTriangleIcon,
  ErrorCircleIcon,
  LoaderIcon,
} from "./lib/internal-icons"

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const toastRootClass =
  "bg-elevated text-contrast ring-contrast/10 rounded-md p-4 text-sm shadow-md ring-1 outline-none select-none"

const toastIconVariants = cva(
  "mt-0.5 size-4 shrink-0",
  {
    variants: {
      type: {
        loading: "text-muted animate-spin",
        success: "text-success",
        info: "text-info",
        warning: "text-warning",
        error: "text-destructive",
      },
    },
  }
)

const toastViewportVariants = cva(
  "fixed z-[100] flex w-full outline-none sm:max-w-sm",
  {
    variants: {
      position: {
        "top-left": "top-4 left-4",
        "top-center": "top-4 right-0 left-0 mx-auto",
        "top-right": "top-4 right-4",
        "bottom-left": "bottom-4 left-4",
        "bottom-center": "bottom-4 right-0 left-0 mx-auto",
        "bottom-right": "bottom-4 right-4",
      },
    },
    defaultVariants: {
      position: "bottom-right",
    },
  },
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = "loading" | "success" | "info" | "warning" | "error"

type ToastOptions = {
  title?: string
  description?: string
  type?: ToastType
  timeout?: number
  priority?: "low" | "high"
  actionProps?: React.ComponentPropsWithoutRef<"button">
  onClose?: () => void
  onRemove?: () => void
}

type ToasterPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

type ToasterProps = {
  position?: ToasterPosition
  limit?: number
  timeout?: number
}

type ToastProps = React.ComponentProps<typeof ToastPrimitive.Root>
type ToastTitleProps = React.ComponentProps<typeof ToastPrimitive.Title>
type ToastDescriptionProps = React.ComponentProps<typeof ToastPrimitive.Description>
type ToastActionProps = React.ComponentProps<typeof ToastPrimitive.Action>
type ToastCloseProps = React.ComponentProps<typeof ToastPrimitive.Close>

// ---------------------------------------------------------------------------
// Toast manager API
// ---------------------------------------------------------------------------

const toastManager = ToastPrimitive.createToastManager()

const toast = Object.assign(
  (titleOrOptions: string | ToastOptions) => {
    const options =
      typeof titleOrOptions === "string"
        ? { title: titleOrOptions }
        : titleOrOptions
    return toastManager.add(options)
  },
  {
    success: (title: string, options?: Omit<ToastOptions, "type" | "title">) =>
      toastManager.add({ ...options, type: "success", title }),

    error: (title: string, options?: Omit<ToastOptions, "type" | "title">) =>
      toastManager.add({ ...options, type: "error", title }),

    warning: (title: string, options?: Omit<ToastOptions, "type" | "title">) =>
      toastManager.add({ ...options, type: "warning", title }),

    info: (title: string, options?: Omit<ToastOptions, "type" | "title">) =>
      toastManager.add({ ...options, type: "info", title }),

    loading: (title: string, options?: Omit<ToastOptions, "type" | "title">) =>
      toastManager.add({
        ...options,
        type: "loading",
        title,
        timeout: options?.timeout ?? 0,
      }),

    dismiss: (id: string) => toastManager.close(id),

    update: (id: string, updates: Partial<ToastOptions>) =>
      toastManager.update(id, updates),

    promise: toastManager.promise.bind(toastManager),
  },
)

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const iconMap = {
  loading: LoaderIcon,
  success: SuccessCircleIcon,
  info: InfoCircleIcon,
  warning: AlertTriangleIcon,
  error: ErrorCircleIcon,
} as const

const toastTypeLabels: Record<ToastType, string> = {
  loading: "Loading",
  success: "Success",
  info: "Information",
  warning: "Warning",
  error: "Error",
}

function ToastIcon({ type }: { type?: ToastType }) {
  if (!type) return null
  const Icon = iconMap[type]
  return (
    <>
      <Icon className={cn(toastIconVariants({ type }))} />
      {/* The icon is decorative (color/shape); announce the type in words so it
       * isn't conveyed by color alone. */}
      <span className="sr-only">{toastTypeLabels[type]}</span>
    </>
  )
}

// ---------------------------------------------------------------------------
// Toast primitives
// ---------------------------------------------------------------------------

function Toast({ className, ...props }: ToastProps) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(toastRootClass, className)}
      {...props}
    />
  )
}

function ToastBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toast-body"
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastTitleProps) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function ToastDescription({ className, ...props }: ToastDescriptionProps) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-muted text-sm", className)}
      {...props}
    />
  )
}

function ToastAction({ className, ...props }: ToastActionProps) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "hover:bg-secondary inline-flex h-7 items-center rounded-md border border-line px-2.5 text-xs font-medium transition-colors outline-none focus-visible:border-focus focus-visible:ring-focus/50 focus-visible:ring-3",
        className,
      )}
      {...props}
    />
  )
}

function ToastClose({ className, children, ...props }: ToastCloseProps) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "text-muted hover:text-contrast shrink-0 rounded-md p-0.5 transition-colors outline-none focus-visible:ring-focus/50 focus-visible:ring-3",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <CloseIcon className="size-4" />
          <span className="sr-only">Close</span>
        </>
      )}
    </ToastPrimitive.Close>
  )
}

// ---------------------------------------------------------------------------
// 3D stacking
// ---------------------------------------------------------------------------

// Shared classes for both top and bottom positions
const STACKING_BASE = [
  // CSS custom properties
  "[--toast-gap:0.5rem]",
  "[--toast-peek:0.5rem]",
  "[--toast-scale:calc(max(0,1-(var(--toast-index)*0.05)))]",
  "[--toast-shrink:calc(1-var(--toast-scale))]",
  "[--toast-stack-height:var(--toast-frontmost-height,var(--toast-height))]",
  // Layout
  "absolute w-full",
  "[z-index:calc(1000-var(--toast-index))]",
  "h-[var(--toast-stack-height)] data-[expanded]:h-[var(--toast-height)]",
  // Depth blur — subtle defocus on behind toasts, cleared on expand
  "[filter:blur(calc(var(--toast-index)*0.4px))]",
  "data-[expanded]:[filter:none]",
  // Expanded (hover)
  "data-[expanded]:[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-stack-offset-y)))]",
  // Exit — shared
  "data-[ending-style]:opacity-0",
  "data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--toast-stack-offset-y))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--toast-stack-offset-y))]",
  "data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-[expanded]:data-[ending-style]:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-[limited]:opacity-0",
  "[transition:transform_0.5s_cubic-bezier(0.22,1,0.36,1),opacity_0.5s,filter_0.5s,height_0.15s]",
  // Collapse the stacking motion under reduced motion — toasts appear and
  // restack instantly instead of sliding/scaling.
  "motion-reduce:[transition:none]",
].join(" ")

// Direction-specific classes — sign flips for anchor, offset, transform, enter/exit
const STACKING_TOP = [
  "[--toast-stack-offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--toast-gap))+var(--toast-swipe-movement-y))]",
  "top-0 origin-top",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--toast-peek))+(var(--toast-shrink)*var(--toast-stack-height))))_scale(var(--toast-scale))]",
  "after:absolute after:bottom-full after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full after:content-['']",
  "data-[starting-style]:[transform:translateY(-150%)]",
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]",
].join(" ")

const STACKING_BOTTOM = [
  "[--toast-stack-offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--toast-gap)*-1)+var(--toast-swipe-movement-y))]",
  "bottom-0 origin-bottom",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--toast-peek))-(var(--toast-shrink)*var(--toast-stack-height))))_scale(var(--toast-scale))]",
  "after:absolute after:top-full after:left-0 after:h-[calc(var(--toast-gap)+1px)] after:w-full after:content-['']",
  "data-[starting-style]:[transform:translateY(150%)]",
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
].join(" ")

const STACKING_TOP_CLASS = `${STACKING_BASE} ${STACKING_TOP}`
const STACKING_BOTTOM_CLASS = `${STACKING_BASE} ${STACKING_BOTTOM}`

// ---------------------------------------------------------------------------
// Toaster
// ---------------------------------------------------------------------------

function ToasterContent({ position = "bottom-right" }: Pick<ToasterProps, "position">) {
  const { toasts } = ToastPrimitive.useToastManager()
  const isTop = position.startsWith("top")

  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport
        data-slot="toast-viewport"
        className={cn(toastViewportVariants({ position }))}
      >
        {toasts.map((t) => (
          <Toast
            key={t.id}
            toast={t}
            swipeDirection={isTop ? ["up", "right"] : ["down", "right"]}
            className={isTop ? STACKING_TOP_CLASS : STACKING_BOTTOM_CLASS}
          >
            <ToastPrimitive.Content
              data-slot="toast-content"
              className="flex items-start gap-3 overflow-hidden transition-opacity duration-200 data-[behind]:pointer-events-none data-[behind]:opacity-0 data-[expanded]:pointer-events-auto data-[expanded]:opacity-100"
            >
              <ToastIcon type={t.type as ToastType | undefined} />

              <ToastBody>
                {t.title && <ToastTitle>{t.title}</ToastTitle>}
                {t.description && (
                  <ToastDescription>{t.description}</ToastDescription>
                )}
                {t.actionProps && (
                  <div className="mt-1.5">
                    <ToastAction {...t.actionProps} />
                  </div>
                )}
              </ToastBody>

              <ToastClose />
            </ToastPrimitive.Content>
          </Toast>
        ))}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  )
}

// The toast manager is a module-level singleton, so every mounted <Toaster/>
// renders the SAME shared toast list — duplicating every toast. This registry
// elects a single primary Toaster (the first mounted); the rest render null.
// Guards against a consumer accidentally rendering two, and against Storybook
// autodocs rendering several stories — each with a Toaster — on one page.
const mountedToasters: symbol[] = []
const toasterListeners = new Set<() => void>()

function notifyToasters() {
  for (const listener of toasterListeners) {
    listener()
  }
}

function useIsPrimaryToaster() {
  const keyRef = React.useRef<symbol | null>(null)
  if (keyRef.current === null) {
    keyRef.current = Symbol("toaster")
  }
  const key = keyRef.current

  const isPrimary = React.useSyncExternalStore(
    React.useCallback((onChange: () => void) => {
      toasterListeners.add(onChange)
      return () => {
        toasterListeners.delete(onChange)
      }
    }, []),
    () => mountedToasters[0] === key,
    () => false,
  )

  React.useEffect(() => {
    mountedToasters.push(key)
    notifyToasters()
    return () => {
      const index = mountedToasters.indexOf(key)
      if (index !== -1) {
        mountedToasters.splice(index, 1)
      }
      notifyToasters()
    }
  }, [key])

  return isPrimary
}

function Toaster({ position, limit, timeout }: ToasterProps) {
  const isPrimary = useIsPrimaryToaster()
  if (!isPrimary) {
    return null
  }
  return (
    <ToastPrimitive.Provider
      toastManager={toastManager}
      limit={limit}
      timeout={timeout}
    >
      <ToasterContent position={position} />
    </ToastPrimitive.Provider>
  )
}

export {
  toastRootClass,
  toastIconVariants,
  toastViewportVariants,
  toastManager,
  toast,
  Toaster,
  Toast,
  ToastIcon,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
}

export type {
  ToastType,
  ToastOptions,
  ToasterPosition,
  ToasterProps
}