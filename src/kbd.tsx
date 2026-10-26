import type * as React from "react";

import { cn } from "./lib/utils";

type KbdProps = React.ComponentProps<"kbd">;

type KbdGroupProps = React.ComponentProps<"kbd">;

function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        // Inside a tooltip (an inverse surface) the key takes the inverse
        // text color and a 10% tint of it, which reads about the same in
        // every theme. Inside an input group (a filled field) it's half the
        // page color, so the key lifts off the field's tint. `font-sans` is
        // deliberate: Tailwind's base styles set `kbd` to the mono font, and
        // keys read like keys in the body font everywhere (mono widens
        // "Ctrl" and lacks ⌘⌥⇧ in many fonts).
        "bg-secondary text-contrast in-data-[slot=tooltip-content]:bg-contrast-inverse/10 in-data-[slot=tooltip-content]:text-contrast-inverse pointer-events-none inline-flex h-5.5 w-fit min-w-5.5 items-center justify-center gap-1 rounded-sm px-1.5 font-sans text-xs font-medium select-none [&_svg:not([class*='size-'])]:size-3 in-data-[slot=input-group]:bg-contrast-inverse/50",
        className,
      )}
      {...props}
    />
  );
}

// A `<kbd>` of `<kbd>`s is HTML's own way to mark a key combination, and
// unlike a `<div>` it's valid inside a sentence.
function KbdGroup({ className, ...props }: KbdGroupProps) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
export type { KbdProps, KbdGroupProps };
