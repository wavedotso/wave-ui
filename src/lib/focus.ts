import type * as React from "react";
import type { Menu } from "@base-ui/react/menu";

/**
 * The full shape Base UI's `finalFocus` prop accepts on the
 * Menu / Popover / ContextMenu popups (these primitives share the
 * `MenuPopup` contract). Derived from Base UI so it tracks the
 * upstream type automatically — no hand-mirrored lockstep.
 */
type FinalFocus = NonNullable<
  React.ComponentProps<typeof Menu.Popup>["finalFocus"]
>;

/**
 * Focus-restoration policy for a floating surface (menu, popover,
 * context menu) when it closes.
 *
 * - `"always"` — restore focus to the trigger on every close. This is
 *   Base UI's default and the right choice for most surfaces (standard
 *   a11y: closing returns you to whatever opened it).
 * - `"keyboard"` — restore focus to the trigger **only** when the
 *   surface was closed via the keyboard. For mouse / touch / pen
 *   closes, focus is left where it is. Use this when the trigger is
 *   visually ephemeral — e.g. revealed on hover or `focus-within` —
 *   so that restoring focus to it wouldn't keep it (and its container)
 *   pinned visible after a pointer close. Keyboard users still get the
 *   expected focus return.
 * - `"never"` — never auto-restore focus on close.
 */
export type RestoreFocusOnClose = "always" | "keyboard" | "never";

/**
 * Resolve the high-level {@link RestoreFocusOnClose} policy to the
 * Base UI `finalFocus` value.
 *
 * `restoreFocusOnClose` is the ergonomic, intent-expressing API;
 * `finalFocus` remains available as the low-level escape hatch for
 * full control (a custom element/ref/predicate). Pass one or the
 * other — when `restoreFocusOnClose` is set it fully governs
 * `finalFocus`.
 */
export function resolveFinalFocus(
  restoreFocusOnClose: RestoreFocusOnClose | undefined,
  finalFocus: FinalFocus | undefined,
): FinalFocus | undefined {
  if (restoreFocusOnClose === undefined) return finalFocus;
  if (restoreFocusOnClose === "always") return undefined; // Base UI default = restore
  if (restoreFocusOnClose === "never") return false;
  // "keyboard": restore to the trigger only on a keyboard close; for
  // pointer closes leave focus where it is so an ephemeral
  // (hover / focus-within) trigger and its container can dismiss.
  return (closeType) => closeType === "keyboard";
}
