"use client";

import * as React from "react";
// `motion` is an optional peer dependency (see `peerDependenciesMeta` in
// package.json). ActionBar's enter/exit transition is built on it, so
// consumers must install `motion` to use this subpath import.
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "./lib/utils";
import { Button } from "./button";
import { Spinner } from "./spinner";
import { Kbd } from "./kbd";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** State a form registers with the ActionBar. */
interface ActionBarEntry {
  /** Whether this form has unsaved changes. */
  hasChanges: boolean;
  /** Whether this form is currently saving. */
  saving: boolean;
  /** Save this form's changes. */
  onSave: () => void | Promise<void>;
  /** Discard this form's changes. */
  onReset: () => void;
}

interface ActionBarContextValue {
  register: (id: string, entry: ActionBarEntry) => void;
  unregister: (id: string) => void;
  /** Returns true if any registered form has unsaved changes. */
  hasDirty: () => boolean;
  /** Trigger the jiggle effect on blocked navigation. */
  jiggle: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const JIGGLE_STEPS = 6;
const JIGGLE_INTERVAL = 50;
const JIGGLE_RANGE = 15;

/**
 * SSR-safe platform detection. Returns `false` on the server and on the
 * first client render so hydration matches, then resolves the real
 * platform after mount. Avoids the `⌘S`/`Ctrl+S` hydration mismatch
 * that a module-scope `navigator` read would cause.
 */
function useIsMac(): boolean {
  const [isMac, setIsMac] = React.useState(false);
  React.useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.userAgent));
  }, []);
  return isMac;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ActionBarContext = React.createContext<ActionBarContextValue | null>(
  null,
);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/** Overridable button + status strings, for internationalization. */
interface ActionBarLabels {
  /** Save button. @default "Save" */
  save?: string;
  /** Save button while a save is in progress. @default "Saving" */
  saving?: string;
  /** Reset button. @default "Reset" */
  reset?: string;
  /** Status shown when a save fails. @default "Couldn't save your changes" */
  saveError?: string;
}

interface ActionBarProviderProps {
  children: React.ReactNode;
  /** Message when one form has changes. */
  message?: string;
  /** Message template for multiple dirty forms. */
  pluralMessage?: (count: number) => string;
  /**
   * Announced to assistive tech (and the only feedback reduced-motion
   * users get) when guarded navigation is blocked.
   */
  blockedMessage?: string;
  /** Overridable button + status strings (for i18n). Merged over the English defaults. */
  labels?: ActionBarLabels;
  /** Additional className for the bar's inner content box (`data-slot="action-bar-content"`). */
  className?: string;
}

/**
 * Global action bar for unsaved changes.
 *
 * Place once at the root layout. Forms register via `useActionBar()`.
 *
 * Features:
 * - Multi-form aggregation (Save All / Reset All)
 * - ⌘S / Ctrl+S keyboard shortcut
 * - Navigation guard with Discord-style page jiggle
 * - `beforeunload` guard for browser close/refresh
 *
 * @remarks
 * Requires the optional `motion` peer dependency for its enter/exit
 * transition. Install `motion` alongside `@waveso/ui` to use this component.
 *
 * @example
 * ```tsx
 * // Root layout — once
 * <ActionBarProvider>{children}</ActionBarProvider>
 *
 * // Any form component
 * useActionBar('profile', { hasChanges, saving, onSave, onReset });
 * ```
 */
function ActionBarProvider({
  children,
  message = "You have unsaved changes",
  pluralMessage = (count) => `${count} unsaved changes`,
  blockedMessage = "Save or reset your changes before leaving this page",
  labels,
  className,
}: ActionBarProviderProps) {
  const text = {
    save: "Save",
    saving: "Saving",
    reset: "Reset",
    saveError: "Couldn't save your changes",
    ...labels,
  };
  const entriesRef = React.useRef(new Map<string, ActionBarEntry>());
  const [, forceUpdate] = React.useState(0);
  const [jiggleTransform, setJiggleTransform] = React.useState<string | null>(
    null,
  );
  const jiggleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const blockedNoticeRafRef = React.useRef<number | null>(null);
  const isMac = useIsMac();
  const prefersReducedMotion = useReducedMotion();
  const reducedMotionRef = React.useRef(prefersReducedMotion);
  reducedMotionRef.current = prefersReducedMotion;
  // Assertive announcement for blocked navigation. This is the *only*
  // feedback channel that works for screen-reader and reduced-motion
  // users (the visual jiggle is suppressed for them), so it is driven
  // independently of the shake.
  const [blockedNotice, setBlockedNotice] = React.useState("");
  // Set when a Save All attempt rejects, so the failure is surfaced in the
  // bar (and announced) rather than lost to an unhandled promise rejection.
  const [saveError, setSaveError] = React.useState(false);

  // --- Registry ---

  const register = React.useCallback((id: string, entry: ActionBarEntry) => {
    const prev = entriesRef.current.get(id);
    entriesRef.current.set(id, entry);
    if (
      !prev ||
      prev.hasChanges !== entry.hasChanges ||
      prev.saving !== entry.saving
    ) {
      forceUpdate((n) => n + 1);
    }
  }, []);

  const unregister = React.useCallback((id: string) => {
    if (entriesRef.current.delete(id)) {
      forceUpdate((n) => n + 1);
    }
  }, []);

  const hasDirty = React.useCallback(() => {
    for (const entry of entriesRef.current.values()) {
      if (entry.hasChanges) return true;
    }
    return false;
  }, []);

  // --- Jiggle ---

  const jiggle = React.useCallback(() => {
    // Announce to assistive tech on every blocked attempt. Clearing
    // first guarantees a text change so an identical message
    // re-announces on repeat presses.
    setBlockedNotice("");
    if (blockedNoticeRafRef.current !== null) {
      cancelAnimationFrame(blockedNoticeRafRef.current);
    }
    blockedNoticeRafRef.current = requestAnimationFrame(() => {
      blockedNoticeRafRef.current = null;
      setBlockedNotice(blockedMessage);
    });

    // Vestibular safety: the random-translate shake is purely a motion
    // cue, so skip it under prefers-reduced-motion. The assertive
    // announcement above is the accessible equivalent.
    if (reducedMotionRef.current) return;
    if (jiggleTimerRef.current) return;

    let step = 0;

    function tick() {
      step++;
      if (step >= JIGGLE_STEPS) {
        setJiggleTransform(null);
        jiggleTimerRef.current = null;
        return;
      }
      const x = (Math.random() - 0.5) * 2 * JIGGLE_RANGE;
      const y = (Math.random() - 0.5) * 2 * JIGGLE_RANGE;
      setJiggleTransform(
        `translate3d(${x.toFixed(5)}px, ${y.toFixed(5)}px, 0px)`,
      );
      jiggleTimerRef.current = setTimeout(tick, JIGGLE_INTERVAL);
    }

    tick();
  }, [blockedMessage]);

  // Cancel any in-flight jiggle timer / announcement frame on unmount so
  // they can't fire a state update after the provider is gone.
  React.useEffect(() => {
    return () => {
      if (jiggleTimerRef.current !== null) {
        clearTimeout(jiggleTimerRef.current);
      }
      if (blockedNoticeRafRef.current !== null) {
        cancelAnimationFrame(blockedNoticeRafRef.current);
      }
    };
  }, []);

  // --- Aggregated state ---

  const dirty: ActionBarEntry[] = [];
  let anySaving = false;

  for (const entry of entriesRef.current.values()) {
    if (entry.hasChanges) dirty.push(entry);
    if (entry.saving) anySaving = true;
  }

  const showBar = dirty.length > 0 || anySaving;
  const dirtyCount = dirty.length;
  const displayMessage = dirtyCount > 1 ? pluralMessage(dirtyCount) : message;

  // --- Save / Reset ---

  const handleSaveAll = React.useCallback(async () => {
    setSaveError(false);
    const saves = [...entriesRef.current.values()]
      .filter((e) => e.hasChanges)
      .map((e) => e.onSave());
    try {
      await Promise.all(saves);
    } catch {
      // A form's onSave rejected. Surface it in the bar instead of leaking
      // an unhandled rejection; the form owns any richer error UI.
      setSaveError(true);
    }
  }, []);

  const handleResetAll = React.useCallback(() => {
    for (const entry of entriesRef.current.values()) {
      if (entry.hasChanges) entry.onReset();
    }
  }, []);

  // --- ⌘S / Ctrl+S ---

  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (hasDirty()) {
          handleSaveAll();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasDirty, handleSaveAll]);

  // --- beforeunload ---

  React.useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (hasDirty()) {
        e.preventDefault();
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasDirty]);

  // --- Context ---

  const ctx = React.useMemo(
    () => ({ register, unregister, hasDirty, jiggle }),
    [register, unregister, hasDirty, jiggle],
  );

  return (
    <ActionBarContext.Provider value={ctx}>
      <div
        data-slot="action-bar-shell"
        style={jiggleTransform ? { transform: jiggleTransform } : undefined}
      >
        {children}
      </div>

      {/*
        Persistent SR-only live regions. They are always mounted so the
        announcement fires reliably when their text changes — a region
        mounted already-populated is not announced consistently across
        screen reader / browser combinations.
      */}
      <span
        data-slot="action-bar-status"
        aria-live="polite"
        className="sr-only"
      >
        {showBar ? displayMessage : ""}
      </span>
      <span
        data-slot="action-bar-blocked-status"
        aria-live="assertive"
        className="sr-only"
      >
        {saveError ? "Couldn't save your changes" : blockedNotice}
      </span>

      <AnimatePresence>
        {showBar && (
          <motion.div
            data-slot="action-bar"
            initial={
              prefersReducedMotion
                ? { opacity: 0, x: "-50%" }
                : { opacity: 0, y: 20, x: "-50%" }
            }
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={
              prefersReducedMotion
                ? { opacity: 0, x: "-50%" }
                : { opacity: 0, y: 20, x: "-50%" }
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 z-50"
          >
            <div
              data-slot="action-bar-content"
              className={cn(
                "flex items-center gap-6 rounded-lg border border-line/60 bg-surface px-5 py-2.5 shadow-lg ring-1 ring-line",
                className,
              )}
            >
              <span
                data-slot="action-bar-message"
                className={cn(
                  "whitespace-nowrap text-sm font-medium",
                  saveError ? "text-destructive" : "text-contrast",
                )}
              >
                {saveError ? text.saveError : displayMessage}
              </span>

              <div
                data-slot="action-bar-actions"
                className="flex items-center gap-1.5"
              >
                <Button
                  type="button"
                  variant="ghost"
                  disabled={anySaving}
                  onClick={handleResetAll}
                  className="h-9 px-3 text-sm hover:text-destructive"
                >
                  {text.reset}
                </Button>

                <Button
                  type="button"
                  variant="default"
                  disabled={anySaving}
                  onClick={handleSaveAll}
                  className="h-9 px-4 text-sm"
                >
                  {anySaving ? (
                    <>
                      <Spinner className="mr-1.5 h-3.5 w-3.5" />
                      {text.saving}
                    </>
                  ) : (
                    <>
                      {text.save}
                      <Kbd className="ml-1.5">{isMac ? "⌘S" : "Ctrl+S"}</Kbd>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ActionBarContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook — register form state
// ---------------------------------------------------------------------------

/**
 * Register a form's unsaved state with the global ActionBar.
 *
 * Unregisters automatically on unmount.
 *
 * @param id — Unique key (e.g., 'profile', 'notifications')
 * @param entry — Current form state
 */
function useActionBar(id: string, entry: ActionBarEntry) {
  const ctx = React.useContext(ActionBarContext);
  if (!ctx)
    throw new Error("useActionBar must be used within <ActionBarProvider>");

  const { register, unregister } = ctx;

  // Intentionally no dependency array: `entry` (and its `onSave`/
  // `onReset` closures) is rebuilt by the caller every render, so we
  // must re-register each render to keep the latest closures. The
  // `register` impl diffs the entry and only forces an update when
  // `hasChanges`/`saving` actually changed, so this can't loop.
  React.useEffect(() => {
    register(id, entry);
  });

  React.useEffect(() => {
    return () => unregister(id);
  }, [id, unregister]);
}

// ---------------------------------------------------------------------------
// Navigation guard hook
// ---------------------------------------------------------------------------

/**
 * Returns a function that guards navigation.
 * If unsaved changes exist, triggers the jiggle and blocks navigation.
 * Otherwise navigates normally via the provided callback.
 *
 * @param navigate — Your navigation function (e.g., `router.push`)
 *
 * @example
 * ```tsx
 * const router = useRouter();
 * const guardedPush = useActionBarGuard(router.push);
 * <button onClick={() => guardedPush('/settings')}>Settings</button>
 * ```
 */
function useActionBarGuard(navigate: (href: string) => void) {
  const ctx = React.useContext(ActionBarContext);

  return React.useCallback(
    (href: string) => {
      if (ctx?.hasDirty()) {
        ctx.jiggle();
        return false;
      }
      navigate(href);
      return true;
    },
    [ctx, navigate],
  );
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { ActionBarProvider, useActionBar, useActionBarGuard };
export type { ActionBarEntry, ActionBarLabels, ActionBarProviderProps };
