"use client";

import type * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";

import { cn } from "./lib/utils";

type CardProps = useRender.ComponentProps<"div"> & {
  size?: "default" | "sm";
};
type CardHeaderProps = React.ComponentProps<"div">;
type CardTitleProps = useRender.ComponentProps<"div">;
type CardDescriptionProps = React.ComponentProps<"div">;
type CardActionProps = React.ComponentProps<"div">;
type CardContentProps = React.ComponentProps<"div">;
type CardFooterProps = React.ComponentProps<"div">;

/**
 * A surface that groups related content. `render` changes the element: an
 * `article` or `section` for semantics, or a link or button to make the whole
 * card interactive, which adds a hover, a clickable cursor and a focus ring.
 */
function Card({ className, size = "default", render, ...props }: CardProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "ring-contrast/10 bg-surface text-contrast group/card flex flex-col gap-6 overflow-hidden rounded-lg py-6 text-sm ring-1 has-[>img:first-child]:pt-0 has-[>img:last-child]:pb-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-lg *:[img:last-child]:rounded-b-lg",
          // As a link or button: a hover, a cursor, a focus ring in place of
          // the outline, start-aligned text (buttons center by default), and
          // disabled styled both ways since the element is polymorphic.
          "[a,button]:cursor-clickable [a,button]:hover:bg-elevated [button]:text-start motion-color outline-hidden focus-visible:ring-3 focus-visible:ring-focus/50 disabled:pointer-events-none disabled:opacity-30 aria-disabled:pointer-events-none aria-disabled:opacity-30",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "card",
      size,
    },
  });
}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 px-6 group-data-[size=sm]/card:px-4 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        className,
      )}
      {...props}
    />
  );
}

/** `render={<h3 />}` makes the title a real heading for screen readers. */
function CardTitle({ className, render, ...props }: CardTitleProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: "card-title",
    },
  });
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted text-sm", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: CardActionProps) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: CardContentProps) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6 group-data-[size=sm]/card:px-4", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: CardFooterProps) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center px-6 group-data-[size=sm]/card:px-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};

export type {
  CardProps,
  CardHeaderProps,
  CardTitleProps,
  CardDescriptionProps,
  CardActionProps,
  CardContentProps,
  CardFooterProps,
};
