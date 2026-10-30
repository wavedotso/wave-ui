"use client";

import type * as React from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import { cn } from "./lib/utils";

type AvatarProps = AvatarPrimitive.Root.Props & {
  size?: "xs" | "sm" | "default" | "lg";
};
type AvatarImageProps = AvatarPrimitive.Image.Props;
type AvatarFallbackProps = AvatarPrimitive.Fallback.Props;
type AvatarBadgeProps = React.ComponentProps<"span">;
type AvatarGroupProps = React.ComponentProps<"div">;
type AvatarGroupCountProps = React.ComponentProps<"div">;

function Avatar({ className, size = "default", ...props }: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "after:border-line group/avatar relative flex size-(--avatar-size) shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border",
        // Its size, which the holes below are cut from too.
        "[--avatar-size:calc(var(--spacing)*8)] data-[size=lg]:[--avatar-size:calc(var(--spacing)*10)] data-[size=sm]:[--avatar-size:calc(var(--spacing)*6)] data-[size=xs]:[--avatar-size:calc(var(--spacing)*5)]",
        // A badge sits in a hole cut 2px wider than itself, so whatever is
        // behind the avatar shows round it: no colour to match to the page.
        "[--avatar-badge-size:calc(var(--spacing)*2.5)] data-[size=lg]:[--avatar-badge-size:calc(var(--spacing)*3)] data-[size=sm]:[--avatar-badge-size:calc(var(--spacing)*2)] data-[size=xs]:[--avatar-badge-size:calc(var(--spacing)*1.5)]",
        "has-data-[slot=avatar-badge]:[--avatar-cutout:radial-gradient(circle_calc(var(--avatar-badge-size)/2_+_2px)_at_calc(100%_-_var(--avatar-badge-size)/2)_calc(100%_-_var(--avatar-badge-size)/2),transparent_calc(var(--avatar-badge-size)/2_+_1.5px),#000_calc(var(--avatar-badge-size)/2_+_2px))]",
        "rtl:has-data-[slot=avatar-badge]:[--avatar-cutout:radial-gradient(circle_calc(var(--avatar-badge-size)/2_+_2px)_at_calc(var(--avatar-badge-size)/2)_calc(100%_-_var(--avatar-badge-size)/2),transparent_calc(var(--avatar-badge-size)/2_+_1.5px),#000_calc(var(--avatar-badge-size)/2_+_2px))]",
        "after:[mask-image:var(--avatar-cutout,none)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover [mask-image:var(--avatar-cutout,none)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-secondary text-contrast flex size-full items-center justify-center rounded-full text-sm group-data-[size=xs]/avatar:text-[10px] group-data-[size=sm]/avatar:text-xs group-data-[size=lg]/avatar:text-base [mask-image:var(--avatar-cutout,none)]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: AvatarBadgeProps) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "bg-primary text-white absolute end-0 bottom-0 z-10 inline-flex size-(--avatar-badge-size) items-center justify-center rounded-full select-none",
        "group-data-[size=xs]/avatar:[&>svg]:hidden group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:[&>svg]:size-2 group-data-[size=lg]/avatar:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: AvatarGroupProps) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2",
        // Each avatar has a hole cut where the next one overlaps it, 2px
        // wider than that avatar, so whatever is behind the group shows
        // through the gap: no colour to match to the page.
        "*:data-[slot=avatar]:not-last:[mask-image:radial-gradient(circle_calc(var(--avatar-size)/2_+_2px)_at_calc(150%_-_var(--spacing)*2)_50%,transparent_calc(var(--avatar-size)/2_+_1.5px),#000_calc(var(--avatar-size)/2_+_2px))]",
        "rtl:*:data-[slot=avatar]:not-last:[mask-image:radial-gradient(circle_calc(var(--avatar-size)/2_+_2px)_at_calc(-50%_+_var(--spacing)*2)_50%,transparent_calc(var(--avatar-size)/2_+_1.5px),#000_calc(var(--avatar-size)/2_+_2px))]",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({ className, ...props }: AvatarGroupCountProps) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "bg-secondary text-contrast relative flex size-8 shrink-0 items-center justify-center rounded-full text-sm group-has-data-[size=xs]/avatar-group:size-5 group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=xs]/avatar-group:[&>svg]:size-3 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
};
export type {
  AvatarProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarBadgeProps,
  AvatarGroupProps,
  AvatarGroupCountProps,
};
