import * as React from "react"

import { cn } from "./lib/utils"

export type TableProps = React.ComponentProps<"table">
export type TableHeaderProps = React.ComponentProps<"thead">
export type TableBodyProps = React.ComponentProps<"tbody">
export type TableFooterProps = React.ComponentProps<"tfoot">
export type TableRowProps = React.ComponentProps<"tr">
export type TableHeadProps = React.ComponentProps<"th">
export type TableCellProps = React.ComponentProps<"td">
export type TableCaptionProps = React.ComponentProps<"caption">

function Table({ className, ...props }: TableProps) {
  return (
    <div
      data-slot="table-container"
      role="region"
      aria-label="Table"
      tabIndex={0}
      className="relative w-full overflow-x-auto focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-focus/50"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-edge", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-secondary/50 border-t border-edge font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "hover:bg-secondary/50 aria-selected:bg-secondary border-b border-edge transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-contrast h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  )
}

function TableCaption({ className, ...props }: TableCaptionProps) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
