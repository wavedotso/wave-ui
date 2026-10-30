"use client";

import * as React from "react";

import { cn } from "./lib/utils";

type TableProps = React.ComponentProps<"table">;
type TableHeaderProps = React.ComponentProps<"thead">;
type TableBodyProps = React.ComponentProps<"tbody">;
type TableFooterProps = React.ComponentProps<"tfoot">;
type TableRowProps = React.ComponentProps<"tr">;
type TableHeadProps = React.ComponentProps<"th">;
type TableCellProps = React.ComponentProps<"td">;
type TableCaptionProps = React.ComponentProps<"caption">;

/**
 * A data table. When it's wider than its container it scrolls sideways, and
 * only then does the container become a focusable, named region, so keyboard
 * users can scroll it: a table that fits isn't a stray tab stop. The region
 * takes its name from the `TableCaption`, or from the table's `aria-label`.
 */
function Table({ className, ...props }: TableProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [captionId, setCaptionId] = React.useState<string>();

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    const table = tableRef.current;
    if (!container || !table) return;

    const measure = () => {
      setIsScrollable(container.scrollWidth > container.clientWidth);
      setCaptionId(table.querySelector(":scope > caption")?.id || undefined);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    observer.observe(table);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-slot="table-container"
      role={isScrollable ? "region" : undefined}
      aria-labelledby={isScrollable ? captionId : undefined}
      aria-label={isScrollable && !captionId ? props["aria-label"] : undefined}
      tabIndex={isScrollable ? 0 : undefined}
      className="relative w-full overflow-x-auto focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-focus/50"
    >
      <table
        ref={tableRef}
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b [&_tr]:border-line", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: TableBodyProps) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-secondary/50 border-t border-line font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        // Selection is a plain `data-selected` attribute: `aria-selected`
        // isn't allowed on the rows of a plain table (only grid/treegrid), and
        // the row's own checkbox already tells assistive tech it's selected.
        // A selected row is primary, the same colour as a checked checkbox, so
        // inside it the checkbox gets a white edge.
        "hover:bg-highlighted data-selected:bg-primary data-selected:text-white data-selected:**:data-[slot=checkbox]:border-white border-b border-line motion-color",
        className,
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-contrast h-12 px-3 text-start align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pe-0",
        className,
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-3 align-middle whitespace-nowrap [&:has([role=checkbox])]:pe-0",
        className,
      )}
      {...props}
    />
  );
}

// An id by default, so a scrolling table can name its region after it.
function TableCaption({ className, id, ...props }: TableCaptionProps) {
  const generatedId = React.useId();
  return (
    <caption
      id={id ?? generatedId}
      data-slot="table-caption"
      className={cn("text-muted mt-4 text-sm", className)}
      {...props}
    />
  );
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
};

export type {
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableFooterProps,
  TableRowProps,
  TableHeadProps,
  TableCellProps,
  TableCaptionProps,
};
