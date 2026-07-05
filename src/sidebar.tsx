"use client"

import * as React from "react"
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "./lib/utils"
import { Button } from "./button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "./drawer"
import { Input } from "./input"
import { Separator } from "./separator"
import { Skeleton } from "./skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { useIsMobile } from "./hooks/use-mobile"
import { SidebarPanelIcon } from "./lib/internal-icons"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_DEFAULT_KEYBOARD_SHORTCUT = "b"

// ---------------------------------------------------------------------------
// Persistence helpers — ready-made functions for the `persist` prop.
// ---------------------------------------------------------------------------

/**
 * Persist sidebar state to a cookie.
 *
 * @param name - Cookie name. Defaults to `"sidebar-state"`.
 * @param maxAge - Cookie max-age in seconds. Defaults to 7 days (604 800).
 *
 * @example
 * ```tsx
 * <SidebarProvider persist={cookiePersist()}>
 * <SidebarProvider persist={cookiePersist("my-sidebar", 86400)}>
 * ```
 */
function cookiePersist(name = "sidebar-state", maxAge = 60 * 60 * 24 * 7) {
  return (open: boolean) => {
    document.cookie = `${name}=${open}; path=/; max-age=${maxAge}`
  }
}

/**
 * Persist sidebar state to localStorage.
 *
 * @param key - Storage key. Defaults to `"sidebar-state"`.
 *
 * @example
 * ```tsx
 * <SidebarProvider persist={localStoragePersist()}>
 * <SidebarProvider persist={localStoragePersist("my-sidebar")}>
 * ```
 */
function localStoragePersist(key = "sidebar-state") {
  return (open: boolean) => {
    try {
      localStorage.setItem(key, String(open))
    } catch {
      // Storage full or unavailable (SSR, private browsing) — silently ignore.
    }
  }
}

type SidebarContextProps = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

type SidebarProviderProps = React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Optional callback to persist open state. Called on every toggle.
   * Use the built-in helpers `cookiePersist()` or `localStoragePersist()`,
   * or provide a custom function (e.g. server action).
   *
   * @example
   * ```tsx
   * <SidebarProvider persist={cookiePersist()}>
   * <SidebarProvider persist={localStoragePersist("sidebar")}>
   * <SidebarProvider persist={(open) => saveToServer(open)}>
   * ```
   */
  persist?: (open: boolean) => void
  /** Key for Cmd/Ctrl+key toggle shortcut. Defaults to "b". Pass `false` to disable. */
  keyboardShortcut?: string | false
  /** Breakpoint (px) below which the sidebar uses a mobile drawer. Defaults to 768. */
  mobileBreakpoint?: number
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  persist,
  keyboardShortcut = SIDEBAR_DEFAULT_KEYBOARD_SHORTCUT,
  mobileBreakpoint,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile(mobileBreakpoint)
  const [openMobile, setOpenMobile] = React.useState(false)

  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const persistRef = React.useRef(persist)
  persistRef.current = persist

  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      persistRef.current?.(openState)
    },
    [setOpenProp, open]
  )

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  React.useEffect(() => {
    if (keyboardShortcut === false) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === keyboardShortcut &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar, keyboardShortcut])

  // On mobile the sidebar renders as a full-width drawer, so always treat as expanded.
  const state = isMobile || open ? "expanded" : "collapsed"

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        data-slot="sidebar-wrapper"
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
            ...style,
          } as React.CSSProperties
        }
        className={cn(
          "group/sidebar-wrapper has-data-[variant=inset]:bg-surface flex min-h-svh w-full",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  )
}

type SidebarProps = React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state, open, setOpen, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-surface text-contrast flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Drawer
        open={openMobile}
        onOpenChange={setOpenMobile}
        swipeDirection={side}
      >
        <DrawerContent
          data-slot="sidebar"
          data-mobile="true"
          className="bg-surface text-contrast w-(--sidebar-width) max-w-none rounded-none border-0 p-0 sm:max-w-none"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
        >
          <DrawerHeader className="sr-only">
            <DrawerTitle>Sidebar</DrawerTitle>
            <DrawerDescription>Displays the mobile sidebar.</DrawerDescription>
          </DrawerHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <CollapsiblePrimitive.Root
      open={open}
      onOpenChange={setOpen}
      className="group peer text-contrast hidden md:block"
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) after:absolute after:inset-y-0 after:w-px after:bg-line" + (side === "left" ? " after:right-0" : " after:left-0"),
          className
        )}
        {...props}
      >
        <TooltipProvider delay={0} closeDelay={300}>
          <div
            data-slot="sidebar-inner"
            className="bg-surface group-data-[variant=floating]:ring-line group-data-[variant=floating]:rounded-md group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 flex size-full flex-col"
          >
            {children}
          </div>
        </TooltipProvider>
      </div>
    </CollapsiblePrimitive.Root>
  )
}

type SidebarTriggerProps = React.ComponentProps<typeof Button>

function SidebarTrigger({
  className,
  onClick,
  ...props
}: SidebarTriggerProps) {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Button
      data-slot="sidebar-trigger"
      aria-expanded={open}
      variant="ghost"
      size="icon-sm"
      className={className}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <SidebarPanelIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

type SidebarRailProps = React.ComponentProps<"button">

function SidebarRail({ className, ...props }: SidebarRailProps) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-line absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-[left,right,transform] duration-200 ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-closed]_&]:cursor-e-resize [[data-side=right][data-closed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-surface group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

type SidebarInsetProps = React.ComponentProps<"main">

function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-foundation md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-lg md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[closed]:ml-2 relative flex min-w-0 w-full flex-1 flex-col",
        className
      )}
      {...props}
    />
  )
}

type SidebarInputProps = React.ComponentProps<typeof Input>

function SidebarInput({
  className,
  ...props
}: SidebarInputProps) {
  return (
    <Input
      data-slot="sidebar-input"
      className={cn("bg-foundation h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

type SidebarHeaderProps = React.ComponentProps<"div">

function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      className={cn("gap-2 p-2 flex flex-col", className)}
      {...props}
    />
  )
}

type SidebarFooterProps = React.ComponentProps<"div">

function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      className={cn("gap-2 p-2 flex flex-col", className)}
      {...props}
    />
  )
}

type SidebarSeparatorProps = React.ComponentProps<typeof Separator>

function SidebarSeparator({
  className,
  ...props
}: SidebarSeparatorProps) {
  return (
    <Separator
      data-slot="sidebar-separator"
      className={cn("bg-line mx-2 data-[orientation=horizontal]:w-auto", className)}
      {...props}
    />
  )
}

type SidebarContentProps = React.ComponentProps<"div">

function SidebarContent({ className, style, ...props }: SidebarContentProps) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        "gap-1 flex min-h-0 flex-1 flex-col overflow-auto scrollbar-none group-data-[collapsible=icon]:overflow-x-hidden",
        className
      )}
      style={{
        maskImage: "linear-gradient(to bottom, black calc(100% - 44px), transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, black calc(100% - 44px), transparent 100%)",
        ...style,
      }}
      {...props}
    />
  )
}

type SidebarGroupProps = React.ComponentProps<"div">

function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn(
        "px-2 first:pt-2 last:pb-2 relative flex w-full min-w-0 flex-col",
        className
      )}
      {...props}
    />
  )
}

type SidebarGroupLabelProps = useRender.ComponentProps<"div"> &
  React.ComponentProps<"div">

function SidebarGroupLabel({
  className,
  render,
  ...props
}: SidebarGroupLabelProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "text-contrast/70 ring-focus/50 h-8 rounded-md px-2 text-xs font-medium group-data-[collapsible=icon]:hidden focus-visible:ring-3 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-group-label",
    },
  })
}

type SidebarGroupActionProps = useRender.ComponentProps<"button"> &
  React.ComponentProps<"button">

function SidebarGroupAction({
  className,
  render,
  ...props
}: SidebarGroupActionProps) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "text-contrast ring-focus/50 hover:bg-primary hover:text-white absolute top-1.5 right-3 w-5 rounded-sm p-0 focus-visible:ring-3 [&>svg]:size-4 flex aspect-square items-center justify-center outline-hidden transition-transform [&>svg]:shrink-0 after:absolute after:-inset-2 md:after:hidden group-data-[collapsible=icon]:hidden",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-group-action",
    },
  })
}

type SidebarGroupContentProps = React.ComponentProps<"div">

function SidebarGroupContent({
  className,
  ...props
}: SidebarGroupContentProps) {
  return (
    <div
      data-slot="sidebar-group-content"
      className={cn("text-sm w-full", className)}
      {...props}
    />
  )
}

type SidebarMenuProps = React.ComponentProps<"ul">

function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn("gap-1 flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  )
}

type SidebarMenuItemProps = React.ComponentProps<"li">

function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn("group/menu-item relative has-data-[slot=sidebar-menu-sub]:mb-[-0.25rem]", className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  "ring-focus/50 hover:bg-primary hover:text-white active:bg-primary active:text-white data-active:bg-primary data-active:text-white data-open:hover:bg-primary data-open:hover:text-white gap-2 rounded-md p-2 text-left text-sm transition-[width,height,padding] group-has-data-[slot=sidebar-menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:aspect-square group-data-[collapsible=icon]:h-11 focus-visible:ring-3 data-active:font-medium peer/menu-button flex w-full items-center overflow-hidden outline-hidden group/menu-button disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-primary hover:text-white",
        outline: "bg-foundation hover:bg-primary hover:text-white ring-1 ring-line hover:ring-focus",
      },
      size: {
        default: "h-11 text-sm",
        sm: "h-8 text-xs",
        lg: "h-12 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type SidebarMenuButtonProps = useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>

function SidebarMenuButton({
  render,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar()

  if (process.env.NODE_ENV === "development" && tooltip && render) {
    console.warn(
      "[SidebarMenuButton] Both `render` and `tooltip` were provided. " +
      "When `tooltip` is set, the button is wrapped in a TooltipTrigger and the `render` prop is ignored."
    )
  }

  const comp = useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
      },
      props
    ),
    render: !tooltip ? render : TooltipTrigger,
    state: {
      slot: "sidebar-menu-button",
      size,
      active: isActive,
    },
  })

  if (!tooltip) {
    return comp
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      {comp}
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

type SidebarMenuActionProps = useRender.ComponentProps<"button"> &
  React.ComponentProps<"button"> & {
    showOnHover?: boolean
  }

function SidebarMenuAction({
  className,
  render,
  showOnHover = false,
  ...props
}: SidebarMenuActionProps) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        className: cn(
          "text-contrast ring-focus/50 hover:bg-primary hover:text-white peer-hover/menu-button:text-white absolute top-1/2 -translate-y-1/2 right-1 aspect-square w-5 rounded-sm p-0 focus-visible:ring-3 [&>svg]:size-4 flex items-center justify-center outline-hidden transition-transform group-data-[collapsible=icon]:hidden after:absolute after:-inset-2 md:after:hidden [&>svg]:shrink-0",
          showOnHover &&
          "peer-data-active/menu-button:text-white group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-open:opacity-100 md:opacity-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-action",
    },
  })
}

type SidebarMenuBadgeProps = React.ComponentProps<"div">

function SidebarMenuBadge({
  className,
  ...props
}: SidebarMenuBadgeProps) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        "text-contrast peer-hover/menu-button:text-white peer-data-active/menu-button:text-white pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

type SidebarMenuSkeletonProps = React.ComponentProps<"div"> & {
  showIcon?: boolean
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: SidebarMenuSkeletonProps) {
  const [width] = React.useState(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  })

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={cn("h-8 gap-2 rounded-md px-2 flex items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton className="size-4 rounded-md" />
      )}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

type SidebarMenuSubProps = React.ComponentProps<"ul">

function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn("border-line ml-3.5 mr-0 translate-x-px gap-0.5 border-l pl-2.5 pr-0 py-0.5 group-data-[collapsible=icon]:hidden flex min-w-0 flex-col", className)}
      {...props}
    />
  )
}

type SidebarMenuSubItemProps = React.ComponentProps<"li">

function SidebarMenuSubItem({
  className,
  ...props
}: SidebarMenuSubItemProps) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

type SidebarMenuSubButtonProps = useRender.ComponentProps<"a"> &
  React.ComponentProps<"a"> & {
    size?: "sm" | "md"
    isActive?: boolean
  }

function SidebarMenuSubButton({
  render,
  size = "md",
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "text-contrast ring-focus/50 hover:bg-primary hover:text-white active:bg-primary active:text-white [&>svg]:text-white data-active:bg-primary data-active:text-white h-7 gap-2 rounded-md px-2 focus-visible:ring-3 data-[size=md]:text-sm data-[size=sm]:text-xs [&>svg]:size-4 flex min-w-0 -translate-x-px items-center overflow-hidden outline-hidden group-data-[collapsible=icon]:hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:shrink-0",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "sidebar-menu-sub-button",
      size,
      active: isActive,
    },
  })
}

export {
  cookiePersist,
  localStoragePersist,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  sidebarMenuButtonVariants,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}

export type {
  SidebarProps,
  SidebarContentProps,
  SidebarFooterProps,
  SidebarGroupProps,
  SidebarGroupActionProps,
  SidebarGroupContentProps,
  SidebarGroupLabelProps,
  SidebarHeaderProps,
  SidebarInputProps,
  SidebarInsetProps,
  SidebarMenuProps,
  SidebarMenuActionProps,
  SidebarMenuBadgeProps,
  SidebarMenuButtonProps,
  SidebarMenuItemProps,
  SidebarMenuSkeletonProps,
  SidebarMenuSubProps,
  SidebarMenuSubButtonProps,
  SidebarMenuSubItemProps,
  SidebarProviderProps,
  SidebarRailProps,
  SidebarSeparatorProps,
  SidebarTriggerProps,
}
