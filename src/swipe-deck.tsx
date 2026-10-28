"use client";

import * as React from "react";
// `motion` is an optional peer dependency (see `peerDependenciesMeta` in
// package.json). SwipeDeck's release physics are built on it, so consumers
// must install `motion` to use this subpath import.
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import type { MotionValue } from "motion/react";

import { Button, type ButtonProps } from "./button";
import { mergeRefs } from "./lib/merge-refs";
import { cn } from "./lib/utils";

type SwipeDirection = "left" | "right" | "up" | "down";

type SwipeDeckLayout = "stack" | "fan" | "cascade" | "pile";

interface SwipeDeckSwipeDetails {
  /** The `value` of the card that left. */
  value: string;
  /** The direction it left in. */
  direction: SwipeDirection;
}

type SwipeDeckProps = React.ComponentProps<"div"> & {
  /**
   * Called once a card has left the deck. Remove it from your list to discard
   * it, or move it to the end of your list to cycle it to the back.
   */
  onSwipe?: (details: SwipeDeckSwipeDetails) => void;
  /** The directions a card can leave in. Defaults to left and right. */
  directions?: readonly SwipeDirection[];
  /** Stops cards leaving by pointer, keyboard or action. */
  disabled?: boolean;
  /**
   * How the cards behind the front one sit: `stack` peeks them above it, `fan`
   * turns them out like a hand of cards, `cascade` steps them up and to the
   * side, and `pile` scatters them. Defaults to `stack`. `fan` and `cascade`
   * open toward the start of the line: left in left-to-right text, right in
   * right-to-left.
   */
  layout?: SwipeDeckLayout;
  /** How far the cards behind spread out, from 0 (not at all) to 2. Defaults to 0.5. */
  spread?: number;
  /** How much each card behind shrinks, from 0 (not at all) to 1. Defaults to 0.5. */
  depth?: number;
  /** How many cards show, the front one included; at least 1. Defaults to 4. */
  visible?: number;
};

type SwipeDeckItemProps = React.ComponentProps<"div"> & {
  /** Names the card in `onSwipe`. Use the same id as its `key`. */
  value: string;
};

type SwipeDeckEmptyProps = React.ComponentProps<"div">;

type SwipeDeckActionProps = ButtonProps & {
  /** The direction the front card leaves in when pressed. */
  direction: SwipeDirection;
};

interface Size {
  width: number;
  height: number;
}

interface Sample {
  x: number;
  y: number;
  time: number;
}

interface Drag {
  pointerId: number;
  startX: number;
  startY: number;
  originX: number;
  originY: number;
  moved: boolean;
  samples: Sample[];
}

interface SwipeDeckItemRecord {
  element: HTMLDivElement;
  swipe: (direction: SwipeDirection) => void;
}

interface SwipeDeckContextValue {
  directions: readonly SwipeDirection[];
  disabled: boolean;
  /** False until the cards have registered: before hydration, nothing is known. */
  isReady: boolean;
  /** The card on top: the only one that can be dragged or read. */
  front: string | undefined;
  /** Each resting card's place in the pile, 0 at the front. */
  positions: ReadonlyMap<string, number>;
  leaving: ReadonlySet<string>;
  count: number;
  /** How far the cards behind have lifted toward their next places, 0 to `LIFT`. */
  lift: MotionValue<number>;
  register: (value: string, record: SwipeDeckItemRecord) => () => void;
  leave: (value: string) => void;
  finish: (details: SwipeDeckSwipeDetails) => void;
  swipeFront: (direction: SwipeDirection) => void;
  /** No card in front: the last one is leaving, or none is left. */
  isEmpty: boolean;
  /** The `SwipeDeckEmpty`, read for its text when the deck runs out. */
  emptyRef: React.RefObject<HTMLDivElement | null>;
  focusDeck: () => void;
  /** The front card once it has come to rest there, moved in and faded in. */
  settledFront: string | undefined;
  settle: (value: string) => void;
}

const DEFAULT_DIRECTIONS: readonly SwipeDirection[] = ["left", "right"];

const KEY_DIRECTIONS: Partial<Record<string, SwipeDirection>> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

/** How far (px) a press moves before it becomes a drag, so taps stay clicks. */
const DRAG_SLOP = 6;
/** A card leaves when it comes to rest past this share of its width (or height). */
const LEAVE_SHARE = 0.25;
/** Only pointer samples this recent (ms) set the release speed. */
const VELOCITY_WINDOW = 100;
/**
 * How much a throw counts: its release speed adds this many seconds' worth of
 * travel to where the card is, to decide whether it leaves and which way.
 */
const THROW_TIME = 0.25;
/** A leaving card's exit point is this far (px) past the stack's edge, shadow and all. */
const CLEARANCE = 16;

const RETURN_SPRING = { type: "spring", stiffness: 400, damping: 32 } as const;
/**
 * Carries a leaving card to its exit point. A slow card slides out on it; a
 * thrown one brings its speed and runs out against it, so the harder the
 * throw, the harder the pull back: a limit, not a coast to anywhere.
 */
const EXIT_SPRING = { type: "spring", stiffness: 650, damping: 42 } as const;
/** A leaving card fades once clear of the stack and slowed below this (px/s). */
const CAUGHT_SPEED = 200;
/** Moves a card from one place in the pile to the next. */
const PLACE_SPRING = { type: "spring", stiffness: 260, damping: 24 } as const;
/** How far (in places) the cards behind lift toward the front as it's dragged out. */
const LIFT = 0.4;
/** On mount, the cards behind wait this long (s) for the front card to fade in. */
const ENTER_LEAD = 0.15;
/** Then each card behind comes this long (s) after the one before. */
const ENTER_STAGGER = 0.06;
/** And grows in from this size, the zoom recipes' md step (`--scale-md`). */
const ENTER_SCALE = 0.9;

/** Dash and gap (px) of `SwipeDeckEmpty`'s outline. */
const OUTLINE_DASH = 8;
const OUTLINE_GAP = 6;
/** Points drawn per corner of that outline. */
const OUTLINE_CORNER_STEPS = 24;

/** Presses on these inside a card stay theirs: a slider's thumb, a text box. */
const FIELD_SELECTOR =
  "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role=slider]";

/** Keeps the browser's own panning on the axis the deck doesn't swipe along. */
function touchAction(directions: readonly SwipeDirection[]) {
  const horizontal = directions.some(isHorizontal);
  const vertical = directions.some((direction) => !isHorizontal(direction));
  if (horizontal && vertical) return "touch-none";
  return horizontal ? "touch-pan-y" : "touch-pan-x";
}

function isHorizontal(direction: SwipeDirection) {
  return direction === "left" || direction === "right";
}

/** Lets the cards behind settle back from a lift. */
function releaseLift(lift: MotionValue<number>, isInstant: boolean | null) {
  if (isInstant) lift.jump(0);
  else animate(lift, 0, PLACE_SPRING);
}

/**
 * Resolves once an element's running transitions and animations end. jsdom
 * has no Web Animations, and an endless animation of your own would never
 * end, so neither is waited for.
 */
function transitionsEnd(element: HTMLElement) {
  const animations =
    typeof element.getAnimations === "function"
      ? element
          .getAnimations()
          .filter(
            (animation) =>
              animation.effect?.getComputedTiming().endTime !== Infinity,
          )
      : [];
  return Promise.allSettled(animations.map((animation) => animation.finished));
}

/** `value` kept within `min`–`max`, or `fallback` when it isn't a number. */
function within(value: number, min: number, max: number, fallback: number) {
  return Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

/**
 * Three steady numbers in [-0.5, 0.5] from a card's value: where it lies in a
 * `pile`, the same on every render and server.
 */
function scatterOf(value: string): [number, number, number] {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash = Math.imul(hash ^ value.charCodeAt(index), 16777619);
  }
  const next = () => {
    hash ^= hash << 13;
    hash ^= hash >>> 17;
    hash ^= hash << 5;
    return ((hash >>> 0) % 1000) / 1000 - 0.5;
  };
  return [next(), next(), next()];
}

/** Layout size, without the transform a moving card carries. */
function sizeOf(element: HTMLElement): Size {
  return { width: element.offsetWidth, height: element.offsetHeight };
}

/** Whether a card moved by (x, y) is off the stack. */
function isClear(x: number, y: number, size: Size) {
  return Math.abs(x) >= size.width || Math.abs(y) >= size.height;
}

/**
 * Where a card at (x, y), heading along (dx, dy), first sits `CLEARANCE` past
 * the stack's edge: the nearer of the side edges and the top or bottom edge.
 */
function exitPoint(
  x: number,
  y: number,
  [dx, dy]: readonly [number, number],
  size: Size,
): [number, number] {
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const steps = [
    ux === 0 ? Infinity : (Math.sign(ux) * (size.width + CLEARANCE) - x) / ux,
    uy === 0 ? Infinity : (Math.sign(uy) * (size.height + CLEARANCE) - y) / uy,
  ];
  const step = Math.max(0, Math.min(...steps));
  return [x + step * ux, y + step * uy];
}

/** How far a movement goes toward a direction; negative when it goes away. */
function reach(direction: SwipeDirection, x: number, y: number) {
  switch (direction) {
    case "right":
      return x;
    case "left":
      return -x;
    case "down":
      return y;
    case "up":
      return -y;
  }
}

/**
 * The allowed direction a movement leans furthest into, and how far it goes
 * there as a share of the distance that makes a card leave (1 or more leaves).
 */
function lean(
  directions: readonly SwipeDirection[],
  x: number,
  y: number,
  size: Size,
) {
  let best: { direction: SwipeDirection | undefined; share: number } = {
    direction: undefined,
    share: 0,
  };
  for (const direction of directions) {
    const length = isHorizontal(direction) ? size.width : size.height;
    const share = reach(direction, x, y) / Math.max(length * LEAVE_SHARE, 1);
    if (share > best.share) best = { direction, share };
  }
  return best;
}

/** Pointer speed (px/s) over the samples taken just before `time`. */
function releaseVelocity(samples: Sample[], time: number): [number, number] {
  const recent = samples.filter(
    (sample) => time - sample.time <= VELOCITY_WINDOW,
  );
  const first = recent[0];
  const last = recent.at(-1);
  if (!first || !last || last.time <= first.time) return [0, 0];
  const elapsed = (last.time - first.time) / 1000;
  return [(last.x - first.x) / elapsed, (last.y - first.y) / elapsed];
}

const SwipeDeckContext = React.createContext<SwipeDeckContextValue | null>(
  null,
);

function useSwipeDeckContext(part: string) {
  const context = React.useContext(SwipeDeckContext);
  if (!context) throw new Error(`${part} must be used within a SwipeDeck.`);
  return context;
}

/**
 * A pile of cards people swipe away: drag or throw the front card, press an
 * arrow key while the deck is focused, or use a `SwipeDeckAction`. A let-go
 * card whose position and throw carry it past a quarter of its width leaves:
 * it slides out the way it is heading until clear of the stack, held by a
 * spring that a hard throw runs out against, then fades. Short of that, it
 * springs back. Your list stays the source of truth — `onSwipe` tells you
 * which card left and which way, and you remove it or move it to the back.
 *
 * End the deck with a `SwipeDeckEmpty`: it lies under the last card, so
 * dragging that card shows what comes next. The deck carries `data-empty`
 * once no card is in front (the last one leaving, or none left), for styles
 * of your own.
 *
 * Give the deck an `aria-label`. Screen readers hear the next card after each
 * swipe: its `aria-label` when it has one, otherwise all of its text.
 */
function SwipeDeck({
  onSwipe,
  directions = DEFAULT_DIRECTIONS,
  disabled = false,
  layout = "stack",
  spread = 0.5,
  depth = 0.5,
  visible = 4,
  className,
  style,
  onKeyDown,
  children,
  ref,
  ...props
}: SwipeDeckProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = React.useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const itemsRef = React.useRef(new Map<string, SwipeDeckItemRecord>());
  // Cards whose swipe is reported but who still count as leaving until your
  // list answers `onSwipe`, each with the cards that came after it then.
  const finishedRef = React.useRef(new Map<string, readonly string[]>());
  const statusRef = React.useRef<HTMLSpanElement>(null);
  const emptyRef = React.useRef<HTMLDivElement>(null);
  const sizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const lift = useMotionValue(0);
  const [order, setOrder] = React.useState<readonly string[]>([]);
  const [leavingList, setLeavingList] = React.useState<readonly string[]>([]);
  const [isReady, setIsReady] = React.useState(false);

  // Kept in a ref so a card finishing its glide calls the latest `onSwipe`.
  const onSwipeRef = React.useRef(onSwipe);
  React.useEffect(() => {
    onSwipeRef.current = onSwipe;
  });

  // Cards in DOM order, which is the order of your list.
  const readOrder = React.useCallback(
    () =>
      [...itemsRef.current]
        // oxlint-disable-next-line unicorn/no-array-sort -- sorts a fresh copy; `toSorted` is ES2023 and the lib is ES2022
        .sort(([, a], [, b]) =>
          a.element.compareDocumentPosition(b.element) &
          Node.DOCUMENT_POSITION_FOLLOWING
            ? -1
            : 1,
        )
        .map(([value]) => value),
    [],
  );

  const syncOrder = React.useCallback(() => {
    const items = itemsRef.current;
    const next = readOrder();
    setOrder((previous) =>
      previous.length === next.length &&
      previous.every((value, index) => value === next[index])
        ? previous
        : next,
    );
    // A swiped card rejoins once your list has answered: it is gone, or a
    // card that came after it now comes before it (it moved to the back).
    // Until then it stays out, however long your answer takes. In the same
    // update as the new order, so the front card is right in every render.
    const answered = new Set<string>();
    for (const [value, followers] of finishedRef.current) {
      const index = next.indexOf(value);
      const hasMoved = followers.some((follower) => {
        const followerIndex = next.indexOf(follower);
        return followerIndex !== -1 && followerIndex < index;
      });
      if (index === -1 || hasMoved) {
        answered.add(value);
        finishedRef.current.delete(value);
      }
    }
    setLeavingList((previous) => {
      const kept = previous.filter(
        (value) => items.has(value) && !answered.has(value),
      );
      return kept.length === previous.length ? previous : kept;
    });
  }, [readOrder]);

  // After every render: your list can reorder its cards without mounting or
  // unmounting any, e.g. when a swiped card moves to the end.
  React.useLayoutEffect(() => {
    syncOrder();
  });

  // Once mounted, the deck has met its cards; before (on the server, during
  // hydration) an empty order doesn't mean an empty deck.
  React.useLayoutEffect(() => {
    setIsReady(true);
  }, []);

  // A list kept in a component below the deck can reorder its cards without
  // the deck rendering at all, so watch the deck's children too.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new MutationObserver(syncOrder);
    observer.observe(root, { childList: true });
    return () => observer.disconnect();
  }, [syncOrder]);

  // The cards' size, kept on the deck as `--swipe-deck-card-width` and
  // `-height`, so `SwipeDeckEmpty` keeps it once the last card is gone.
  const sizeObserver = React.useCallback(() => {
    sizeObserverRef.current ??= new ResizeObserver(() => {
      const root = rootRef.current;
      const cards = [...itemsRef.current.values()];
      if (!root || cards.length === 0) return;
      const width = Math.max(
        ...cards.map(({ element }) => element.offsetWidth),
      );
      const height = Math.max(
        ...cards.map(({ element }) => element.offsetHeight),
      );
      root.style.setProperty("--swipe-deck-card-width", `${width}px`);
      root.style.setProperty("--swipe-deck-card-height", `${height}px`);
    });
    return sizeObserverRef.current;
  }, []);
  React.useEffect(() => () => sizeObserverRef.current?.disconnect(), []);

  const register = React.useCallback(
    (value: string, record: SwipeDeckItemRecord) => {
      itemsRef.current.set(value, record);
      sizeObserver().observe(record.element);
      syncOrder();
      return () => {
        if (itemsRef.current.get(value) === record) {
          itemsRef.current.delete(value);
          sizeObserverRef.current?.unobserve(record.element);
          syncOrder();
        }
      };
    },
    [sizeObserver, syncOrder],
  );

  const focusDeck = React.useCallback(() => rootRef.current?.focus(), []);
  const [settledFront, setSettledFront] = React.useState<string>();

  // Lift goes to a CSS variable on the deck, where every card's layout reads it.
  React.useEffect(
    () =>
      lift.on("change", (latest) => {
        rootRef.current?.style.setProperty("--swipe-deck-lift", String(latest));
      }),
    [lift],
  );

  const leave = React.useCallback((value: string) => {
    setLeavingList((previous) =>
      previous.includes(value) ? previous : [...previous, value],
    );
  }, []);

  // The card stays in the leaving list until `syncOrder` sees your list's
  // answer in the DOM; clearing it now would put it back in front.
  const finish = React.useCallback(
    (details: SwipeDeckSwipeDetails) => {
      const current = readOrder();
      finishedRef.current.set(
        details.value,
        current.slice(current.indexOf(details.value) + 1),
      );
      onSwipeRef.current?.(details);
    },
    [readOrder],
  );

  const leaving = React.useMemo(() => new Set(leavingList), [leavingList]);
  const positions = React.useMemo(
    () =>
      new Map(
        order
          .filter((value) => !leaving.has(value))
          .map((value, index) => [value, index]),
      ),
    [order, leaving],
  );
  const front = order.find((value) => !leaving.has(value));

  const swipeFront = React.useCallback(
    (direction: SwipeDirection) => {
      if (disabled || front === undefined || !directions.includes(direction)) {
        return;
      }
      itemsRef.current.get(front)?.swipe(direction);
    },
    [directions, disabled, front],
  );

  // Announce the new front card after a swipe, or the `SwipeDeckEmpty` once
  // none is left. Not on mount, where the deck's own content is read in the
  // normal way.
  const announcedRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    const previous = announcedRef.current;
    announcedRef.current = front;
    const status = statusRef.current;
    if (previous === undefined || previous === front || !status) return;
    const element =
      front === undefined
        ? emptyRef.current
        : itemsRef.current.get(front)?.element;
    // `innerText` keeps the breaks between a title and a button; jsdom has
    // none, so `textContent` stands in there.
    status.textContent = element
      ? (element.getAttribute("aria-label") ??
        (element.innerText || element.textContent || ""))
      : "";
  }, [front]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    // Only while the deck itself has focus: arrows inside a card's own
    // controls (a text field, a slider) keep their usual meaning.
    if (event.defaultPrevented || event.target !== event.currentTarget) return;
    // Modified arrows are the browser's and the system's (back, word jumps).
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
      return;
    const direction = KEY_DIRECTIONS[event.key];
    if (!direction || disabled || !directions.includes(direction)) return;
    event.preventDefault();
    swipeFront(direction);
  };

  const context = React.useMemo<SwipeDeckContextValue>(
    () => ({
      directions,
      disabled,
      isReady,
      front,
      positions,
      leaving,
      count: order.length,
      lift,
      register,
      leave,
      finish,
      swipeFront,
      isEmpty: isReady && front === undefined,
      emptyRef,
      focusDeck,
      settledFront,
      settle: setSettledFront,
    }),
    [
      directions,
      disabled,
      isReady,
      front,
      positions,
      leaving,
      order.length,
      lift,
      register,
      leave,
      finish,
      swipeFront,
      focusDeck,
      settledFront,
    ],
  );

  return (
    <SwipeDeckContext.Provider value={context}>
      {/* oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- the focused deck takes arrow keys to swipe its front card, and SwipeDeckAction does the same by button */}
      <div
        ref={mergedRef}
        data-slot="swipe-deck"
        data-layout={layout}
        // No card in front: the last one is leaving, or none is left.
        data-empty={context.isEmpty ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        role="group"
        // Stays focusable when disabled, so a deck that has focus keeps it.
        tabIndex={0}
        aria-disabled={disabled || undefined}
        className={cn(
          // Its own stacking context: the cards' z-indexes rank only among
          // themselves, never against the page.
          "group/swipe-deck relative isolate grid outline-hidden",
          // Which way `fan` and `cascade` open: toward the start of the line.
          "[--swipe-deck-side:-1] rtl:[--swipe-deck-side:1]",
          // The focus ring sits on the front card; with no cards left, on the
          // deck itself.
          "ring-focus/50 rounded-lg focus-visible:not-has-data-front:ring-3",
          className,
        )}
        // The layout's CSS reads its numbers from these.
        style={
          {
            "--swipe-deck-spread": within(spread, 0, 2, 0.5),
            "--swipe-deck-depth": within(depth, 0, 1, 0.5),
            "--swipe-deck-visible": Math.round(within(visible, 1, Infinity, 4)),
            ...style,
          } as React.CSSProperties
        }
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
        <span
          ref={statusRef}
          data-slot="swipe-deck-status"
          role="status"
          className="sr-only"
        />
      </div>
    </SwipeDeckContext.Provider>
  );
}

/**
 * One card in the deck. It sits in the deck's first grid cell with every other
 * card, so the deck takes the size of its largest card.
 *
 * Styling hooks: `data-front` on the top card, `data-swiping` while it is
 * dragged, `data-leaving` from the moment it leaves, `data-ending-style` once
 * it is clear of the stack and fading (the `motion-fade-lg` recipe), and
 * `data-swipe-direction` for the way it leans or leaves. CSS variables:
 * `--swipe-deck-index` (its place in the pile, 0 at the front),
 * `--swipe-deck-place` (that place as it springs from one to the next, less
 * the lift while the front card is dragged out, as `--swipe-deck-slot`),
 * `--swipe-deck-movement-x` / `-y` in px, and `--swipe-deck-progress` from 0
 * at rest to 1 where letting go makes the card leave.
 *
 * The card owns its translate, rotate and scale, so its motion recipe can only
 * be a `motion-fade-*` one: a recipe that transitions those would lag every
 * drag.
 */
function SwipeDeckItem({
  value,
  className,
  style,
  ref,
  onPointerDown,
  onClickCapture,
  onDragStart,
  ...props
}: SwipeDeckItemProps) {
  const deck = useSwipeDeckContext("SwipeDeckItem");
  const { directions, register, leave, finish } = deck;
  const prefersReducedMotion = useReducedMotion();
  const elementRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = React.useMemo(() => mergeRefs(elementRef, ref), [ref]);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Its place in the pile, springing between whole places.
  const place = useMotionValue(0);
  // A card behind grows in from `ENTER_SCALE` as it appears, on top of its
  // layout's own size.
  const enterScale = useMotionValue(1);
  // Whether its drag lifts the cards behind: only the front card's, until it leaves.
  const drivesLiftRef = React.useRef(false);
  const scatter = React.useMemo(() => scatterOf(value), [value]);
  // The way the card is leaving, for `onSwipe` once its exit ends.
  const leftTowardRef = React.useRef<SwipeDirection | null>(null);
  // Stops watching a leaving card for the moment it clears the stack.
  const stopWatchingRef = React.useRef<(() => void) | null>(null);
  const dragRef = React.useRef<Drag | null>(null);
  // Removes the window listeners of the drag in progress.
  const endDragRef = React.useRef<(() => void) | null>(null);
  // Measured when a drag or glide starts, not every frame.
  const sizeRef = React.useRef<Size>({ width: 0, height: 0 });
  // Set when a drag ends, so the click that follows it doesn't reach the card.
  const draggedRef = React.useRef(false);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);
  // Every card mounts in the fade recipe's starting style (clear, blurred)
  // and drops it when its turn comes, which fades it in.
  const [isStarting, setIsStarting] = React.useState(true);
  const [direction, setDirection] = React.useState<SwipeDirection>();

  const position = deck.positions.get(value);
  const isLeaving = deck.leaving.has(value);
  const isFront = deck.front === value;

  // Read by the drag's window listeners, which outlive the render they were
  // made in.
  const directionsRef = React.useRef(directions);
  const disabledRef = React.useRef(deck.disabled);
  const reducedMotionRef = React.useRef(prefersReducedMotion);
  React.useEffect(() => {
    directionsRef.current = directions;
    disabledRef.current = deck.disabled;
    reducedMotionRef.current = prefersReducedMotion;
    drivesLiftRef.current = isFront && !isLeaving;
  });

  // Movement goes straight to CSS variables, never through React state, so a
  // drag doesn't re-render the card.
  React.useEffect(() => {
    const write = () => {
      const element = elementRef.current;
      if (!element) return;
      const { share } = lean(
        directionsRef.current,
        x.get(),
        y.get(),
        sizeRef.current,
      );
      element.style.setProperty("--swipe-deck-movement-x", `${x.get()}px`);
      element.style.setProperty("--swipe-deck-movement-y", `${y.get()}px`);
      element.style.setProperty(
        "--swipe-deck-progress",
        String(Math.min(share, 1)),
      );
      if (drivesLiftRef.current) deck.lift.set(Math.min(share, 1) * LIFT);
    };
    const stopX = x.on("change", write);
    const stopY = y.on("change", write);
    const stopPlace = place.on("change", (latest) => {
      elementRef.current?.style.setProperty(
        "--swipe-deck-place",
        String(latest),
      );
    });
    const stopEnterScale = enterScale.on("change", (latest) => {
      elementRef.current?.style.setProperty(
        "--swipe-deck-enter-scale",
        String(latest),
      );
    });
    return () => {
      stopX();
      stopY();
      stopPlace();
      stopEnterScale();
      // Removed mid-drag: the cards behind settle back from its lift.
      if (dragRef.current) releaseLift(deck.lift, reducedMotionRef.current);
      endDragRef.current?.();
      stopWatchingRef.current?.();
      x.stop();
      y.stop();
      place.stop();
      enterScale.stop();
    };
  }, [deck.lift, enterScale, place, x, y]);

  const snapBack = React.useCallback(
    ([vx, vy]: readonly [number, number] = [0, 0]) => {
      if (prefersReducedMotion) {
        x.set(0);
        y.set(0);
        return;
      }
      animate(x, 0, { ...RETURN_SPRING, velocity: vx });
      animate(y, 0, { ...RETURN_SPRING, velocity: vy });
    },
    [prefersReducedMotion, x, y],
  );

  // The card goes on the way it is heading (where its throw would carry it,
  // which for a card let go still is where it was dragged) to its exit point,
  // just clear of the stack, on `EXIT_SPRING`. Once clear and caught, its exit
  // recipe fades it. Keys and actions have no heading, so they go straight.
  const fling = React.useCallback(
    (to: SwipeDirection, [vx, vy]: readonly [number, number] = [0, 0]) => {
      // A key or action can send the card off mid-drag: that drag is over.
      endDragRef.current?.();
      setIsSwiping(false);
      leftTowardRef.current = to;
      leave(value);
      setDirection(to);
      // The cards behind settle from their lift into their new places, on
      // the same spring as their places, so the two cancel out smoothly.
      drivesLiftRef.current = false;
      releaseLift(deck.lift, prefersReducedMotion);
      setIsStarting(false);
      if (prefersReducedMotion) {
        setIsFading(true);
        return;
      }
      const size = sizeRef.current;
      const aheadX = x.get() + vx * THROW_TIME;
      const aheadY = y.get() + vy * THROW_TIME;
      const sign = to === "right" || to === "down" ? 1 : -1;
      const heading: [number, number] =
        Math.hypot(aheadX, aheadY) >= 1
          ? [aheadX, aheadY]
          : isHorizontal(to)
            ? [sign, 0]
            : [0, sign];
      const [targetX, targetY] = exitPoint(x.get(), y.get(), heading, size);
      const headingLength = Math.hypot(...heading);
      const [ux, uy] = [heading[0] / headingLength, heading[1] / headingLength];
      const fade = () => {
        stopWatchingRef.current?.();
        stopWatchingRef.current = null;
        setIsFading(true);
      };
      // Fades once clear and caught: a hard throw first runs out against the
      // spring, so its limit shows before the card goes.
      const check = () => {
        const outward = x.getVelocity() * ux + y.getVelocity() * uy;
        if (isClear(x.get(), y.get(), size) && outward <= CAUGHT_SPEED) fade();
      };
      stopWatchingRef.current?.();
      const stopX = x.on("change", check);
      const stopY = y.on("change", check);
      stopWatchingRef.current = () => {
        stopX();
        stopY();
      };
      // Settling is the backstop, on the axis that travels: an axis with
      // nowhere to go finishes at once.
      const isMainX =
        Math.abs(targetX - x.get()) >= Math.abs(targetY - y.get());
      animate(x, targetX, {
        ...EXIT_SPRING,
        velocity: vx,
        onComplete: isMainX ? fade : undefined,
      });
      animate(y, targetY, {
        ...EXIT_SPRING,
        velocity: vy,
        onComplete: isMainX ? undefined : fade,
      });
    },
    [deck.lift, leave, prefersReducedMotion, value, x, y],
  );

  React.useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    return register(value, {
      element,
      swipe: (to) => {
        sizeRef.current = sizeOf(element);
        fling(to);
      },
    });
  }, [fling, register, value]);

  // `onSwipe` waits for the exit recipe to end, as Base UI waits for its own
  // exits. With reduced motion the recipe takes no time, so it comes at once.
  React.useEffect(() => {
    const element = elementRef.current;
    const to = leftTowardRef.current;
    if (!isFading || !element || !to) return;
    let isCancelled = false;
    const frame = requestAnimationFrame(() => {
      void transitionsEnd(element).then(() => {
        if (isCancelled) return;
        x.stop();
        y.stop();
        finish({ value, direction: to });
      });
    });
    return () => {
      isCancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [finish, isFading, value, x, y]);

  // The card's place springs to its new one whenever the pile changes; the
  // first one it takes, it takes at once. A card that finished leaving but
  // stayed in your list (moved to the back, or kept) jumps home and to its new
  // place while it can't be seen; losing `data-ending-style` fades it back in
  // with the same recipe.
  const wasLeavingRef = React.useRef(false);
  const isPlacedRef = React.useRef(false);
  React.useEffect(() => {
    const target = isLeaving ? 0 : position;
    if (target === undefined) return;
    if (wasLeavingRef.current && !isLeaving) {
      x.jump(0);
      y.jump(0);
      place.jump(target);
      setIsFading(false);
    } else if (prefersReducedMotion || !isPlacedRef.current) {
      place.jump(target);
    } else {
      animate(place, target, PLACE_SPRING);
    }
    isPlacedRef.current = true;
    wasLeavingRef.current = isLeaving;
  }, [isLeaving, place, position, prefersReducedMotion, x, y]);

  // The entrance: the front card fades in first, then the cards behind
  // appear one after another, growing in as they fade. Its time is set once,
  // at the first place it takes; reaching the front early cuts it short.
  // With reduced motion the recipe takes no time and they all appear at once.
  const enterAtRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (!isStarting || position === undefined) return;
    if (enterAtRef.current === null) {
      const delay =
        prefersReducedMotion || position === 0
          ? 0
          : ENTER_LEAD + (position - 1) * ENTER_STAGGER;
      enterAtRef.current = performance.now() + delay * 1000;
      if (delay > 0) {
        enterScale.jump(ENTER_SCALE);
        animate(enterScale, 1, { ...PLACE_SPRING, delay });
      }
    } else if (position === 0) {
      animate(enterScale, 1, PLACE_SPRING);
    }
    const wait =
      position === 0 ? 0 : Math.max(0, enterAtRef.current - performance.now());
    let frame = 0;
    // A frame after the wait, so the starting style is painted before it goes.
    const timer = window.setTimeout(() => {
      frame = requestAnimationFrame(() => setIsStarting(false));
    }, wait);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, [enterScale, isStarting, position, prefersReducedMotion]);

  // In front, the card tells the deck once it has come to rest there: its
  // move to the front done and its entrance over. `SwipeDeckEmpty` waits for
  // that, so it never shows around a card still moving in.
  const { settle } = deck;
  React.useEffect(() => {
    const element = elementRef.current;
    if (!isFront || isStarting || !element) return;
    let isCancelled = false;
    const report = () => {
      void transitionsEnd(element).then(() => {
        if (!isCancelled) settle(value);
      });
    };
    const stopListening = place.on("animationComplete", report);
    if (!place.isAnimating()) report();
    return () => {
      isCancelled = true;
      stopListening();
    };
  }, [isFront, isStarting, place, settle, value]);

  // A drag ends early if its card stops being the front one (your list put
  // another card first) or the deck turns disabled; the card springs back.
  // No longer in front, it no longer drives the lift, so let the lift go.
  React.useEffect(() => {
    if ((isFront && !deck.disabled) || !dragRef.current) return;
    endDragRef.current?.();
    setIsSwiping(false);
    snapBack();
    if (!isFront) releaseLift(deck.lift, prefersReducedMotion);
  }, [deck.disabled, deck.lift, isFront, prefersReducedMotion, snapBack]);

  const release = (drag: Drag, event: PointerEvent) => {
    if (!drag.moved) {
      snapBack();
      return;
    }
    setIsSwiping(false);
    // Swallow the click this drag ends with. Cleared on the next task, so a
    // touch drag (which ends without a click) can't eat a later one.
    draggedRef.current = true;
    window.setTimeout(() => {
      draggedRef.current = false;
    });
    // A cancelled pointer (the browser took the gesture over) reports no real
    // position, so only a real release adds its last sample.
    if (event.type === "pointerup") {
      drag.samples.push({
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
      });
    }
    const velocity = releaseVelocity(drag.samples, event.timeStamp);
    if (event.type === "pointerup" && !disabledRef.current) {
      // Where the card is, plus what its throw adds: far enough, and it leaves.
      const ahead = lean(
        directionsRef.current,
        x.get() + velocity[0] * THROW_TIME,
        y.get() + velocity[1] * THROW_TIME,
        sizeRef.current,
      );
      if (ahead.direction && ahead.share >= 1) {
        fling(ahead.direction, velocity);
        return;
      }
    }
    snapBack(velocity);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      !isFront ||
      deck.disabled ||
      dragRef.current
    ) {
      return;
    }
    const element = event.currentTarget;
    const field =
      event.target instanceof Element
        ? event.target.closest(FIELD_SELECTOR)
        : null;
    if (field && element.contains(field)) return;
    // Catch the card where it is, even mid-way through snapping back, and
    // take the lift over from a settle the last card left running.
    deck.lift.stop();
    x.stop();
    y.stop();
    sizeRef.current = sizeOf(element);
    const drag: Drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: x.get(),
      originY: y.get(),
      moved: false,
      samples: [{ x: event.clientX, y: event.clientY, time: event.timeStamp }],
    };
    dragRef.current = drag;

    // On the window, so a press that slips off the card before it becomes a
    // drag still ends.
    const handleMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== drag.pointerId) return;
      const dx = moveEvent.clientX - drag.startX;
      const dy = moveEvent.clientY - drag.startY;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < DRAG_SLOP) return;
        drag.moved = true;
        // Captured only now, not on press: capturing on press would send the
        // click to the card instead of a button or link inside it.
        element.setPointerCapture(drag.pointerId);
        setIsSwiping(true);
      }
      x.set(drag.originX + dx);
      y.set(drag.originY + dy);
      drag.samples.push({
        x: moveEvent.clientX,
        y: moveEvent.clientY,
        time: moveEvent.timeStamp,
      });
      if (drag.samples.length > 20) drag.samples.shift();
      setDirection(
        lean(directionsRef.current, x.get(), y.get(), sizeRef.current)
          .direction,
      );
    };
    const handleEnd = (endEvent: PointerEvent) => {
      if (endEvent.pointerId !== drag.pointerId) return;
      endDrag();
      release(drag, endEvent);
    };
    const endDrag = () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleEnd);
      window.removeEventListener("pointercancel", handleEnd);
      dragRef.current = null;
      endDragRef.current = null;
    };
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleEnd);
    window.addEventListener("pointercancel", handleEnd);
    endDragRef.current = endDrag;
  };

  const handleClickCapture = (event: React.MouseEvent<HTMLDivElement>) => {
    if (draggedRef.current) {
      draggedRef.current = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClickCapture?.(event);
  };

  const zIndex = isLeaving
    ? deck.count + 1
    : position === undefined
      ? undefined
      : deck.count - position;

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- dragging is the swipe gesture; the deck's arrow keys and SwipeDeckAction do the same without it
    <div
      ref={mergedRef}
      data-slot="swipe-deck-item"
      // A group, as slides are in a carousel, so an `aria-label` names it.
      role="group"
      data-front={isFront ? "" : undefined}
      data-swiping={isSwiping ? "" : undefined}
      data-leaving={isLeaving ? "" : undefined}
      data-starting-style={isStarting ? "" : undefined}
      data-ending-style={isFading ? "" : undefined}
      data-swipe-direction={isSwiping || isLeaving ? direction : undefined}
      // Cards behind the front one, or leaving, can't be reached by Tab or
      // screen readers. Unknown before hydration, so nothing is inert then.
      inert={isLeaving || (position !== undefined && position > 0)}
      className={cn(
        "motion-fade-lg relative col-start-1 row-start-1 rounded-lg select-none",
        // Where it sits: its place less the lift, turned into an offset, a
        // turn and a size by the deck's layout, plus the drag on top. Cards
        // past `--swipe-deck-visible` fade out.
        "[--swipe-deck-slot:calc(var(--swipe-deck-place,0)_-_min(var(--swipe-deck-place,0),1)_*_var(--swipe-deck-lift,0))]",
        // Hidden cards wait at the last visible place rather than running on,
        // so a long deck neither overflows the page nor flips its scale.
        "[--swipe-deck-layout-slot:min(var(--swipe-deck-slot),calc(var(--swipe-deck-visible,4)_-_1))]",
        "[translate:calc(var(--swipe-deck-movement-x,0px)_+_var(--swipe-deck-layout-x,0px))_calc(var(--swipe-deck-movement-y,0px)_+_var(--swipe-deck-layout-y,0px))]",
        "[rotate:var(--swipe-deck-layout-rotate,0deg)] [scale:calc(var(--swipe-deck-layout-scale,1)_*_var(--swipe-deck-enter-scale,1))]",
        "[opacity:clamp(0,calc(var(--swipe-deck-visible,4)_-_var(--swipe-deck-slot)),1)]",
        // stack: peeking above the front card.
        "group-data-[layout=stack]/swipe-deck:origin-top",
        "group-data-[layout=stack]/swipe-deck:[--swipe-deck-layout-y:calc(var(--swipe-deck-layout-slot)_*_var(--swipe-deck-spread,0.5)_*_-32px)]",
        "group-data-[layout=stack]/swipe-deck:[--swipe-deck-layout-scale:max(0,calc(1_-_var(--swipe-deck-layout-slot)_*_var(--swipe-deck-depth,0.5)_*_0.1))]",
        // fan: turned out from the bottom corner on the line's start side,
        // like a hand of cards.
        "group-data-[layout=fan]/swipe-deck:origin-[10%_90%] group-data-[layout=fan]/swipe-deck:rtl:origin-[90%_90%]",
        "group-data-[layout=fan]/swipe-deck:[--swipe-deck-layout-rotate:calc(var(--swipe-deck-layout-slot)_*_var(--swipe-deck-spread,0.5)_*_8deg_*_var(--swipe-deck-side,1))]",
        "group-data-[layout=fan]/swipe-deck:[--swipe-deck-layout-scale:max(0,calc(1_-_var(--swipe-deck-layout-slot)_*_var(--swipe-deck-depth,0.5)_*_0.12))]",
        // cascade: stepping up and toward the line's start.
        "group-data-[layout=cascade]/swipe-deck:[--swipe-deck-layout-x:calc(var(--swipe-deck-layout-slot)_*_var(--swipe-deck-spread,0.5)_*_28px_*_var(--swipe-deck-side,1))]",
        "group-data-[layout=cascade]/swipe-deck:[--swipe-deck-layout-y:calc(var(--swipe-deck-layout-slot)_*_var(--swipe-deck-spread,0.5)_*_-28px)]",
        "group-data-[layout=cascade]/swipe-deck:[--swipe-deck-layout-scale:max(0,calc(1_-_var(--swipe-deck-layout-slot)_*_var(--swipe-deck-depth,0.5)_*_0.07))]",
        // pile: each card where it fell, its own scatter.
        "group-data-[layout=pile]/swipe-deck:[--swipe-deck-layout-x:calc(var(--swipe-deck-scatter-x)_*_var(--swipe-deck-spread,0.5)_*_56px)]",
        "group-data-[layout=pile]/swipe-deck:[--swipe-deck-layout-y:calc(var(--swipe-deck-scatter-y)_*_var(--swipe-deck-spread,0.5)_*_44px)]",
        "group-data-[layout=pile]/swipe-deck:[--swipe-deck-layout-rotate:calc(var(--swipe-deck-scatter-rotate)_*_var(--swipe-deck-spread,0.5)_*_40deg)]",
        "group-data-[layout=pile]/swipe-deck:[--swipe-deck-layout-scale:max(0,calc(1_-_var(--swipe-deck-layout-slot)_*_var(--swipe-deck-depth,0.5)_*_0.03))]",
        // The focus ring's colour only while focused, as Card does, so a ring
        // of your own on the card (its edge) keeps its colour at rest.
        "group-focus-visible/swipe-deck:data-front:ring-focus/50 group-focus-visible/swipe-deck:data-front:ring-3",
        "data-front:cursor-grab data-swiping:cursor-grabbing group-data-disabled/swipe-deck:data-front:cursor-auto",
        touchAction(directions),
        className,
      )}
      style={
        {
          zIndex,
          "--swipe-deck-index": isLeaving ? 0 : position,
          "--swipe-deck-scatter-x": scatter[0],
          "--swipe-deck-scatter-y": scatter[1],
          "--swipe-deck-scatter-rotate": scatter[2],
          ...style,
        } as React.CSSProperties
      }
      onPointerDown={handlePointerDown}
      onClickCapture={handleClickCapture}
      // No native drag of images or links inside the card.
      onDragStart={(event) => {
        onDragStart?.(event);
        event.preventDefault();
      }}
      {...props}
    />
  );
}

/**
 * A rounded rectangle, inset half a pixel so a 1px line sits inside the box as
 * a border would, with corners that are superellipses of `exponent` (2 is a
 * circular arc, 4 a squircle). Returns the path and its length.
 */
function outlinePath(
  width: number,
  height: number,
  radius: number,
  exponent: number,
) {
  const inset = 0.5;
  const r = Math.max(0, Math.min(radius, width / 2, height / 2) - inset);
  const [left, top] = [inset, inset];
  const [right, bottom] = [width - inset, height - inset];
  const corners: [number, number, number][] = [
    [right - r, top + r, -Math.PI / 2],
    [right - r, bottom - r, 0],
    [left + r, bottom - r, Math.PI / 2],
    [left + r, top + r, Math.PI],
  ];
  const points: [number, number][] = [];
  for (const [cx, cy, start] of corners) {
    for (let step = 0; step <= OUTLINE_CORNER_STEPS; step++) {
      const angle = start + (step / OUTLINE_CORNER_STEPS) * (Math.PI / 2);
      const [cos, sin] = [Math.cos(angle), Math.sin(angle)];
      points.push([
        cx + r * Math.sign(cos) * Math.abs(cos) ** (2 / exponent),
        cy + r * Math.sign(sin) * Math.abs(sin) ** (2 / exponent),
      ]);
    }
  }
  const length = points.reduce((total, [x, y], index) => {
    const [px, py] = points[(index + points.length - 1) % points.length]!;
    return total + Math.hypot(x - px, y - py);
  }, 0);
  const d = `M ${points.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
  return { d, length };
}

/**
 * A 1px dashed outline with long dashes on the box it sits in. CSS ties a
 * dashed border's dash length to its width, so this one is drawn, on the same
 * corners as the cards: squircles where the browser draws them, arcs elsewhere.
 */
function DashedOutline() {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [outline, setOutline] = React.useState({ d: "", length: 0 });

  React.useLayoutEffect(() => {
    const box = svgRef.current?.parentElement;
    if (!box) return;
    const exponent = CSS.supports("corner-shape", "squircle") ? 4 : 2;
    const draw = () =>
      setOutline(
        outlinePath(
          box.offsetWidth,
          box.offsetHeight,
          parseFloat(getComputedStyle(box).borderTopLeftRadius),
          exponent,
        ),
      );
    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  // A whole number of dashes around, so none is cut where the path closes.
  const period = OUTLINE_DASH + OUTLINE_GAP;
  const pathLength = Math.max(1, Math.round(outline.length / period)) * period;

  return (
    <svg
      data-slot="swipe-deck-empty-outline"
      ref={svgRef}
      className="pointer-events-none absolute inset-0 size-full overflow-visible"
      aria-hidden
    >
      <path
        d={outline.d}
        pathLength={pathLength}
        strokeDasharray={`${OUTLINE_DASH} ${OUTLINE_GAP}`}
        className="stroke-shade fill-none"
      />
    </svg>
  );
}

/**
 * What the deck shows once its cards run out: a message, an action (start
 * over, carry on), anything you put in it. It sits where the cards sit, at
 * their size, inside a dashed outline of their shape (`data-slot`
 * `swipe-deck-empty-outline`, to restyle or hide). It is drawn as soon as one
 * card is left and has come to rest, under that card, so dragging it shows
 * what comes next; it
 * can be reached (Tab, clicks) and screen readers hear it (its `aria-label`,
 * or its text) once that last card has gone too.
 */
function SwipeDeckEmpty({
  className,
  children,
  ref,
  ...props
}: SwipeDeckEmptyProps) {
  const deck = useSwipeDeckContext("SwipeDeckEmpty");
  const { emptyRef, focusDeck, isEmpty } = deck;
  // Drawn when none is left in the pile, or one that has come to rest in
  // front: never around a card still moving in.
  const isDrawn =
    deck.isReady &&
    (deck.positions.size === 0 ||
      (deck.positions.size === 1 && deck.settledFront === deck.front));
  const elementRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = React.useMemo(
    () => mergeRefs(elementRef, emptyRef, ref),
    [emptyRef, ref],
  );

  // Out of reach again with focus inside (your list refilled the deck): hand
  // focus to the deck rather than let it fall to the page. Before paint, so
  // the change never drops it first.
  React.useLayoutEffect(() => {
    if (!isEmpty && elementRef.current?.contains(document.activeElement)) {
      focusDeck();
    }
  }, [focusDeck, isEmpty]);

  return (
    <div
      ref={mergedRef}
      data-slot="swipe-deck-empty"
      // Behind the last card it is seen, not used: no Tab stop or click
      // hidden under a card.
      inert={!isEmpty}
      className={cn(
        "text-muted relative col-start-1 row-start-1 flex min-h-(--swipe-deck-card-height) min-w-(--swipe-deck-card-width) flex-col items-center justify-center gap-3 rounded-lg p-6 text-center text-sm",
        !isDrawn && "invisible",
        className,
      )}
      {...props}
    >
      <DashedOutline />
      {children}
    </div>
  );
}

/**
 * A button that sends the front card off in `direction`: the way to swipe
 * without dragging. Disabled when the deck is empty or can't go that way.
 */
function SwipeDeckAction({
  direction,
  disabled,
  onClick,
  ...props
}: SwipeDeckActionProps) {
  const deck = useSwipeDeckContext("SwipeDeckAction");
  // Before hydration the deck doesn't know its cards yet: not "empty".
  const unavailable =
    deck.disabled ||
    (deck.isReady && deck.front === undefined) ||
    !deck.directions.includes(direction);

  return (
    <Button
      data-slot="swipe-deck-action"
      data-swipe-direction={direction}
      disabled={disabled || unavailable}
      // Keeps focus on the button when the last card leaves.
      focusableWhenDisabled
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) deck.swipeFront(direction);
      }}
      {...props}
    />
  );
}

export { SwipeDeck, SwipeDeckItem, SwipeDeckEmpty, SwipeDeckAction };

export type {
  SwipeDeckLayout,
  SwipeDeckProps,
  SwipeDeckItemProps,
  SwipeDeckEmptyProps,
  SwipeDeckActionProps,
  SwipeDeckSwipeDetails,
  SwipeDirection,
};
