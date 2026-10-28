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

type SwipeDeckDirection = "left" | "right" | "up" | "down";

type SwipeDeckLayout = "stack" | "fan" | "cascade" | "pile";

interface SwipeDeckSwipeDetails {
  /** The `value` of the card. */
  value: string;
  /** The direction it leaves in. */
  direction: SwipeDeckDirection;
}

/** What sent a card off: a drag or throw, an arrow key, or a `SwipeDeckAction`. */
type SwipeDeckSwipeEventReason = SwipeDeckSwipeCause["reason"];

type SwipeDeckSwipeCause =
  | { reason: "swipe"; event: PointerEvent }
  | { reason: "keyboard"; event: KeyboardEvent }
  | { reason: "action-press"; event: MouseEvent };

/**
 * `onSwipe`'s second argument: the reason and native event behind a swipe, and
 * a way to cancel it. The parts of Base UI's own event details that apply.
 */
type SwipeDeckSwipeEventDetails = SwipeDeckSwipeCause & {
  /**
   * Keeps the card in front: a dragged card springs back, and a key or
   * action does nothing.
   */
  cancel: () => void;
  /** Whether `cancel` has been called. */
  readonly isCanceled: boolean;
};

type SwipeDeckProps = React.ComponentProps<"div"> & {
  /**
   * Called the moment a card is sent off, before it leaves: count it here, or
   * call `eventDetails.cancel()` to keep it in front. To cycle the deck, move
   * the card to the end of your list here, and it slides back under the pile.
   * Don't remove it here: it would vanish mid-exit, and `onSwipeComplete`
   * would never come.
   */
  onSwipe?: (
    details: SwipeDeckSwipeDetails,
    eventDetails: SwipeDeckSwipeEventDetails,
  ) => void;
  /**
   * Called once a card is done leaving: faded out, or (moved to the back in
   * `onSwipe`) on its way under the pile. Remove it from your list here; a
   * card your list keeps comes back, in front or wherever you moved it.
   * Return a promise, such as a save, to keep a faded card out until it
   * settles; a card sliding under the pile is back already.
   */
  onSwipeComplete?: (details: SwipeDeckSwipeDetails) => void | Promise<unknown>;
  /** The directions a card can leave in. Defaults to left and right. */
  directions?: readonly SwipeDeckDirection[];
  /** Stops cards leaving by pointer, keyboard or action. */
  disabled?: boolean;
  /**
   * How the cards behind the front one sit: `stack` peeks them above it, `fan`
   * turns them out like a hand of cards, `cascade` steps them up and to the
   * side, and `pile` scatters them. Defaults to `fan`. `fan` and `cascade`
   * open toward the end of the line: right in left-to-right text, left in
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
  /**
   * Names the card in `onSwipe`. Use the same id as its `key`, unique among
   * the deck's cards, those still leaving included: a card dealt again is a
   * new card and needs a new value.
   */
  value: string;
};

type SwipeDeckEmptyProps = React.ComponentProps<"div">;

type SwipeDeckActionProps = ButtonProps & {
  /** The direction the front card leaves in when pressed. */
  direction: SwipeDeckDirection;
};

interface Size {
  width: number;
  height: number;
}

/** How far (px) a card must move each way for its far edge to clear the pile. */
interface Extents {
  left: number;
  right: number;
  up: number;
  down: number;
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
  /** Fades the throw's share of the tilt once the pointer stops. */
  idle: number | undefined;
}

interface SwipeDeckItemRecord {
  element: HTMLDivElement;
  swipe: (direction: SwipeDeckDirection, cause: SwipeDeckSwipeCause) => void;
}

interface SwipeDeckContextValue {
  directions: readonly SwipeDeckDirection[];
  disabled: boolean;
  /** False until the cards have registered: before hydration, nothing is known. */
  isReady: boolean;
  /** The card on top: the only one that can be dragged or read. */
  front: string | undefined;
  /** Each resting card's place in the pile, 0 at the front. */
  positions: ReadonlyMap<string, number>;
  leaving: ReadonlySet<string>;
  /** The leaving cards, the one sent off first first. */
  leavingOrder: readonly string[];
  count: number;
  /** How many cards show, the front one included. */
  visible: number;
  /** How far the cards behind have lifted toward their next places, 0 to `LIFT`. */
  lift: MotionValue<number>;
  register: (value: string, record: SwipeDeckItemRecord) => () => void;
  /** Asks `onSwipe` about a card; unless cancelled, it starts leaving. */
  send: (details: SwipeDeckSwipeDetails, cause: SwipeDeckSwipeCause) => boolean;
  /** Whether your list has moved a leaving card behind a card that was behind it. */
  isMovedBack: (value: string) => boolean;
  /** Ends a card's leave at once: it's sliding back under the pile. */
  rejoin: (value: string) => void;
  /** Reports a finished leave to `onSwipeComplete`, then rejoins once it's answered. */
  complete: (details: SwipeDeckSwipeDetails) => void;
  exitExtents: (
    value: string,
    element: HTMLElement,
    x: number,
    y: number,
  ) => Extents;
  swipeFront: (
    direction: SwipeDeckDirection,
    cause: SwipeDeckSwipeCause,
  ) => void;
  /** No card in front: the last one is leaving, or none is left. */
  isEmpty: boolean;
  /** The `SwipeDeckEmpty`, read for its text when the deck runs out. */
  emptyRef: React.RefObject<HTMLDivElement | null>;
  focusDeck: () => void;
  /** The front card once it has come to rest there, moved in and faded in. */
  settledFront: string | undefined;
  settle: (value: string) => void;
}

const DEFAULT_DIRECTIONS: readonly SwipeDeckDirection[] = ["left", "right"];

const KEY_DIRECTIONS: Partial<Record<string, SwipeDeckDirection>> = {
  ArrowLeft: "left",
  ArrowRight: "right",
  ArrowUp: "up",
  ArrowDown: "down",
};

/** One step each way, in screen axes (y grows downward). */
const DIRECTION_VECTORS: Record<SwipeDeckDirection, readonly [number, number]> =
  {
    left: [-1, 0],
    right: [1, 0],
    up: [0, -1],
    down: [0, 1],
  };

/** How far (px) a press moves before it becomes a drag, so taps stay clicks. */
const DRAG_SLOP = 6;
/**
 * How hard a card resists being pulled toward a side it can't leave by: the
 * factor in iOS's rubber band, under which a pull moves it less and less,
 * never past its own length.
 */
const RUBBER_BAND = 0.55;
/** A card leaves when it comes to rest past this share of its width (or height). */
const LEAVE_SHARE = 0.25;
/** Only pointer samples this recent (ms) set the release speed. */
const VELOCITY_WINDOW = 100;
/**
 * How much a throw counts: its release speed adds this many seconds' worth of
 * travel to where the card is, to decide whether it leaves and which way.
 */
const THROW_TIME = 0.25;
/** A leaving card's exit point is this far (px) past the pile's edge, shadow and all. */
const CLEARANCE = 16;

const RETURN_SPRING = { type: "spring", stiffness: 400, damping: 32 } as const;
/**
 * Carries a leaving card to its exit point. A slow card slides out on it; a
 * thrown one brings its speed and runs out against it, so the harder the
 * throw, the harder the pull back: a limit, not a coast to anywhere.
 */
const EXIT_SPRING = { type: "spring", stiffness: 650, damping: 42 } as const;
/** A leaving card fades once clear of the pile and slowed below this (px/s). */
const CAUGHT_SPEED = 200;
/** Moves a card from one place in the pile to the next. */
const PLACE_SPRING = { type: "spring", stiffness: 260, damping: 24 } as const;
/** Brings a card your list moved to the back from its exit point under the pile. */
const TUCK_SPRING = { type: "spring", stiffness: 240, damping: 28 } as const;
/** How far (in places) the cards behind lift toward the front as it's dragged out. */
const LIFT = 0.4;
/** On mount, the cards behind wait this long (s) for the front card to fade in. */
const ENTER_LEAD = 0.15;
/** Then each card behind comes this long (s) after the one before. */
const ENTER_STAGGER = 0.06;
/** And grows in from this size, the zoom recipes' md step (`--scale-md`). */
const ENTER_SCALE = 0.9;

/** A pressed card lifts to this size, under the pointer. */
const PRESS_SCALE = 1.035;
const PRESS_SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;
/** How far (deg) a dragged card tilts toward the viewer at most. */
const TILT = 30;
/** And how far (deg) it turns in its own plane, carried sideways. */
const SPIN = 6;
/** The pointer speed (px/s) that tilts a card all the way. */
const LEAN_SPEED = 1300;
/** The drag (px) that tilts and turns a card all the way. */
const LEAN_REACH = 260;
/** A still pointer stops tilting the card after this long (ms). */
const LEAN_IDLE = 70;
/** The depth (px) the tilt is seen from. */
const PERSPECTIVE = 800;
const LEAN_SPRING = { type: "spring", stiffness: 240, damping: 28 } as const;
/** Lays a card flat and lowers it once it's let go. */
const FACE_SPRING = { type: "spring", stiffness: 240, damping: 30 } as const;

/** Dash and gap (px) of `SwipeDeckEmpty`'s outline. */
const OUTLINE_DASH = 8;
const OUTLINE_GAP = 6;
/** Points drawn per corner of that outline. */
const OUTLINE_CORNER_STEPS = 24;

/** Presses on these inside a card stay theirs: a slider's thumb, a text box. */
const FIELD_SELECTOR =
  "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role=slider]";

const ITEM_SELECTOR = "[data-slot=swipe-deck-item]";

/**
 * Keeps the browser's own panning on the axis the deck doesn't swipe along,
 * and its pinch zoom everywhere.
 */
function touchAction(directions: readonly SwipeDeckDirection[]) {
  const horizontal = directions.some(isHorizontal);
  const vertical = directions.some((direction) => !isHorizontal(direction));
  if (horizontal && vertical) return "touch-pinch-zoom";
  return horizontal
    ? "touch-pan-y touch-pinch-zoom"
    : "touch-pan-x touch-pinch-zoom";
}

function isHorizontal(direction: SwipeDeckDirection) {
  return direction === "left" || direction === "right";
}

/** Whether `offset` on an axis is on a side the card can leave by. */
function isOpenSide(
  directions: readonly SwipeDeckDirection[],
  horizontal: boolean,
  offset: number,
) {
  if (offset === 0) return true;
  const toward = horizontal
    ? offset > 0
      ? "right"
      : "left"
    : offset > 0
      ? "down"
      : "up";
  return directions.includes(toward);
}

/** Where a pull of `offset` toward a closed side leaves the card. */
function resist(offset: number, length: number) {
  if (length <= 0) return 0;
  const pull = Math.abs(offset);
  return (
    Math.sign(offset) * (1 - 1 / ((pull * RUBBER_BAND) / length + 1)) * length
  );
}

/** The pull that `resist` turns into `offset`, to catch a resisted card. */
function unresist(offset: number, length: number) {
  if (length <= 0) return 0;
  const share = Math.min(Math.abs(offset) / length, 0.99);
  return (Math.sign(offset) * (1 / (1 - share) - 1) * length) / RUBBER_BAND;
}

/** A drag's offset on one axis, resisted when it points to a closed side. */
function follow(
  directions: readonly SwipeDeckDirection[],
  horizontal: boolean,
  pull: number,
  length: number,
) {
  return isOpenSide(directions, horizontal, pull) ? pull : resist(pull, length);
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

function isThenable(value: unknown): value is PromiseLike<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof value.then === "function"
  );
}

function createSwipeEventDetails(
  cause: SwipeDeckSwipeCause,
): SwipeDeckSwipeEventDetails {
  let isCanceled = false;
  return {
    ...cause,
    cancel: () => {
      isCanceled = true;
    },
    get isCanceled() {
      return isCanceled;
    },
  };
}

const subscribeToNothing = () => () => {};

/**
 * False while React renders on the server or hydrates what the server sent,
 * true for a render made in the browser.
 */
function useIsClientRender() {
  return React.useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
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

/**
 * Where a pointer at (clientX, clientY) is on a card, in px from its transform
 * origin, the card's own turn and size taken back out: the middle of its
 * bounding box is where its middle is drawn, however it is turned.
 */
function grabPoint(
  element: HTMLElement,
  clientX: number,
  clientY: number,
  size: Size,
): [number, number] {
  const box = element.getBoundingClientRect();
  const style = getComputedStyle(element);
  const angle = ((Number.parseFloat(style.rotate) || 0) * Math.PI) / 180;
  const [scaleX = 1, scaleY = scaleX] =
    style.scale && style.scale !== "none"
      ? style.scale.split(" ").map((part) => Number.parseFloat(part) || 1)
      : [];
  const dx = clientX - (box.left + box.width / 2);
  const dy = clientY - (box.top + box.height / 2);
  const [cos, sin] = [Math.cos(-angle), Math.sin(-angle)];
  const [originX = 0, originY = 0] = style.transformOrigin
    .split(" ")
    .map((part) => Number.parseFloat(part) || 0);
  return [
    within(size.width / 2 + (dx * cos - dy * sin) / scaleX, 0, size.width, 0) -
      originX,
    within(
      size.height / 2 + (dx * sin + dy * cos) / scaleY,
      0,
      size.height,
      0,
    ) - originY,
  ];
}

/** Whether a card's press and tilt have settled, its pose drawn as `none`. */
function isPoseAtRest(
  press: MotionValue<number>,
  spin: MotionValue<number>,
  tiltX: MotionValue<number>,
  tiltY: MotionValue<number>,
) {
  return (
    Math.abs(press.get() - 1) < 1e-4 &&
    Math.abs(spin.get()) < 1e-3 &&
    Math.abs(tiltX.get()) < 1e-3 &&
    Math.abs(tiltY.get()) < 1e-3
  );
}

/** Whether a card moved by (x, y) is off the pile. */
function isClear(x: number, y: number, extents: Extents) {
  return (
    x >= extents.right ||
    -x >= extents.left ||
    y >= extents.down ||
    -y >= extents.up
  );
}

/**
 * Where a card at (x, y), heading along (dx, dy), first sits `CLEARANCE` past
 * the pile's edge: the nearer of the side edges and the top or bottom edge.
 */
function exitPoint(
  x: number,
  y: number,
  [dx, dy]: readonly [number, number],
  extents: Extents,
): [number, number] {
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const edgeX = ux > 0 ? extents.right + CLEARANCE : -extents.left - CLEARANCE;
  const edgeY = uy > 0 ? extents.down + CLEARANCE : -extents.up - CLEARANCE;
  const steps = [
    ux === 0 ? Infinity : (edgeX - x) / ux,
    uy === 0 ? Infinity : (edgeY - y) / uy,
  ];
  const step = Math.max(0, Math.min(...steps));
  return [x + step * ux, y + step * uy];
}

/** How far a movement goes toward a direction; negative when it goes away. */
function reach(direction: SwipeDeckDirection, x: number, y: number) {
  const [dx, dy] = DIRECTION_VECTORS[direction];
  return x * dx + y * dy;
}

/**
 * The allowed direction a movement leans furthest into, and how far it goes
 * there as a share of the distance that makes a card leave (1 or more leaves).
 */
function lean(
  directions: readonly SwipeDeckDirection[],
  x: number,
  y: number,
  size: Size,
) {
  let best: { direction: SwipeDeckDirection | undefined; share: number } = {
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

function clampUnit(value: number) {
  return Math.min(1, Math.max(-1, value));
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
 * card whose position and throw carry it past a quarter of its width (or of
 * its height, up and down) leaves:
 * it slides out the way it is heading until clear of the pile, held by a
 * spring that a hard throw runs out against, then fades. Short of that, it
 * springs back. Pressed, a card lifts under the pointer; dragged, it tilts
 * with the throw.
 *
 * Your list stays the source of truth. `onSwipe` comes the moment a card is
 * sent off: count it there, or cancel to keep it. `onSwipeComplete` comes once
 * it has gone: remove it from your list then, not in `onSwipe`, where removing
 * it would cut its exit short. To cycle the deck instead, move the card to
 * the end of your list in `onSwipe`, and it slides back under the pile. To
 * undo a swipe, put the card back at the start of your list.
 *
 * The cards are the deck's own children, in your list's order. A long list
 * needn't be rendered whole: the deck shows `visible` cards, so the next few
 * dozen are plenty.
 *
 * End the deck with a `SwipeDeckEmpty`: it lies under the last card, so
 * dragging that card shows what comes next.
 *
 * Styling hooks: `data-layout`, `data-disabled`, and `data-empty` once no
 * card is in front (the last one leaving, or none left). CSS variables:
 * `--swipe-deck-card-width` / `-height`, the size of the largest card.
 *
 * Give the deck an `aria-label`. Screen readers hear the next card after each
 * swipe: its `aria-label` when it has one, otherwise all of its text.
 */
function SwipeDeck({
  onSwipe,
  onSwipeComplete,
  directions = DEFAULT_DIRECTIONS,
  disabled = false,
  layout = "fan",
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
  // Which card each registered element is, to read the order off the DOM.
  const valuesRef = React.useRef(new WeakMap<Element, string>());
  // Cards sent off and not yet back, each with the number of its leave, known
  // at once rather than a render later: two quick presses send two cards, and
  // a late answer to one leave can't end the card's next one.
  const sentRef = React.useRef(new Map<string, number>());
  const leavesRef = React.useRef(0);
  // For each leaving card, the cards that came after it when it was sent off:
  // one of them before it, at any point since, means your list moved it to
  // the back.
  const followersRef = React.useRef(new Map<string, readonly string[]>());
  const movedBackRef = React.useRef(new Set<string>());
  const statusRef = React.useRef<HTMLSpanElement>(null);
  const emptyRef = React.useRef<HTMLDivElement>(null);
  const sizeObserverRef = React.useRef<ResizeObserver | null>(null);
  const lift = useMotionValue(0);
  const [order, setOrder] = React.useState<readonly string[]>([]);
  const [leavingList, setLeavingList] = React.useState<readonly string[]>([]);
  const [isReady, setIsReady] = React.useState(false);
  const visibleCount = Math.round(within(visible, 1, Infinity, 4));

  // Kept in refs so a card finishing its exit calls the latest callbacks.
  // Updated before paint, so a press right after a render sees them.
  const onSwipeRef = React.useRef(onSwipe);
  const onSwipeCompleteRef = React.useRef(onSwipeComplete);
  React.useLayoutEffect(() => {
    onSwipeRef.current = onSwipe;
    onSwipeCompleteRef.current = onSwipeComplete;
  });

  // Cards in DOM order, which is the order of your list: one walk of the
  // deck's children. A card inside an element of yours is found the long way.
  const readOrder = React.useCallback(() => {
    const root = rootRef.current;
    if (!root) return [];
    const read = (elements: Iterable<Element>) => {
      const next: string[] = [];
      for (const element of elements) {
        const value = valuesRef.current.get(element);
        if (value !== undefined) next.push(value);
      }
      return next;
    };
    const next = read(root.children);
    return next.length === itemsRef.current.size
      ? next
      : read(root.querySelectorAll(ITEM_SELECTOR));
  }, []);

  // Notes each leaving card your list has moved behind a card that was behind
  // it. Kept once seen: two quick swipes of a two-card deck move it back and
  // forth again before it's clear of the pile.
  const noteMovedBack = React.useCallback((current: readonly string[]) => {
    if (followersRef.current.size === 0) return;
    const indexes = new Map(current.map((card, index) => [card, index]));
    for (const [value, followers] of followersRef.current) {
      const own = indexes.get(value);
      if (
        own !== undefined &&
        followers.some((follower) => (indexes.get(follower) ?? Infinity) < own)
      ) {
        movedBackRef.current.add(value);
      }
    }
  }, []);

  const syncOrder = React.useCallback(() => {
    // Hidden by React (a Suspense fallback, an Activity) rather than gone:
    // the cards come back as they were, so nothing is forgotten meanwhile.
    if (!rootRef.current) return;
    const next = readOrder();
    noteMovedBack(next);
    setOrder((previous) =>
      previous.length === next.length &&
      previous.every((value, index) => value === next[index])
        ? previous
        : next,
    );
    // A card your list dropped is no longer leaving.
    for (const value of sentRef.current.keys()) {
      if (itemsRef.current.has(value)) continue;
      sentRef.current.delete(value);
      followersRef.current.delete(value);
      movedBackRef.current.delete(value);
    }
    setLeavingList((previous) => {
      const kept = previous.filter((value) => itemsRef.current.has(value));
      return kept.length === previous.length ? previous : kept;
    });
  }, [noteMovedBack, readOrder]);

  // Cards register in their own effects; one read after all of them is enough.
  const isSyncQueuedRef = React.useRef(false);
  const syncSoon = React.useCallback(() => {
    if (isSyncQueuedRef.current) return;
    isSyncQueuedRef.current = true;
    queueMicrotask(() => {
      isSyncQueuedRef.current = false;
      syncOrder();
    });
  }, [syncOrder]);

  // After every render: your list can reorder its cards without mounting or
  // unmounting any, e.g. when a swiped card moves to the end. It runs after
  // the cards' own effects, so the order is right before the first paint.
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
      const items = itemsRef.current;
      const existing = items.get(value);
      if (
        process.env.NODE_ENV === "development" &&
        existing &&
        existing.element !== record.element
      ) {
        console.warn(
          `SwipeDeck: more than one card has the value "${value}". Give each SwipeDeckItem its own value, the same as its key.`,
        );
      }
      items.set(value, record);
      valuesRef.current.set(record.element, value);
      sizeObserver().observe(record.element);
      syncSoon();
      return () => {
        valuesRef.current.delete(record.element);
        if (items.get(value) === record) {
          items.delete(value);
          sizeObserverRef.current?.unobserve(record.element);
        }
        syncSoon();
      };
    },
    [sizeObserver, syncSoon],
  );

  const focusDeck = React.useCallback(() => rootRef.current?.focus(), []);
  const [settledFront, setSettledFront] = React.useState<string>();

  const send = React.useCallback(
    (details: SwipeDeckSwipeDetails, cause: SwipeDeckSwipeCause) => {
      if (sentRef.current.has(details.value)) return false;
      // Before `onSwipe`, which may move the card.
      const current = readOrder();
      const followers = current.slice(current.indexOf(details.value) + 1);
      const eventDetails = createSwipeEventDetails(cause);
      onSwipeRef.current?.(details, eventDetails);
      if (eventDetails.isCanceled) return false;
      leavesRef.current += 1;
      sentRef.current.set(details.value, leavesRef.current);
      followersRef.current.set(details.value, followers);
      // Focus inside goes to the deck now: moving the card to the back
      // would drop it before any effect of ours could catch it.
      const element = itemsRef.current.get(details.value)?.element;
      if (element?.contains(document.activeElement)) focusDeck();
      setLeavingList((previous) =>
        previous.includes(details.value)
          ? previous
          : [...previous, details.value],
      );
      return true;
    },
    [focusDeck, readOrder],
  );

  const isMovedBack = React.useCallback(
    (value: string) => {
      noteMovedBack(readOrder());
      return movedBackRef.current.has(value);
    },
    [noteMovedBack, readOrder],
  );

  // Ends these leaves, each named by its number: a card sent off again since
  // is on another leave, and stays out.
  const returnNow = React.useCallback((leaves: ReadonlyMap<string, number>) => {
    const back = new Set<string>();
    for (const [value, leave] of leaves) {
      if (sentRef.current.get(value) !== leave) continue;
      back.add(value);
      sentRef.current.delete(value);
      followersRef.current.delete(value);
      movedBackRef.current.delete(value);
    }
    if (back.size === 0) return;
    setLeavingList((previous) => {
      const kept = previous.filter((value) => !back.has(value));
      return kept.length === previous.length ? previous : kept;
    });
  }, []);

  // Back at once: a card sliding back under the pile.
  const rejoin = React.useCallback(
    (value: string) => {
      const leave = sentRef.current.get(value);
      if (leave !== undefined) returnNow(new Map([[value, leave]]));
    },
    [returnNow],
  );

  // Leaves your list has answered, waiting for the render after the answer.
  const answeredRef = React.useRef(new Map<string, number>());
  const [answers, setAnswers] = React.useState(0);
  const endLeave = React.useCallback((value: string, leave: number) => {
    answeredRef.current.set(value, leave);
    // A transition renders after anything your `onSwipeComplete` just
    // changed, so the card is gone by then if your list dropped it.
    React.startTransition(() => setAnswers((count) => count + 1));
  }, []);
  // In the render that transition makes, not before: an update of yours in a
  // transition of its own renders with it.
  React.useLayoutEffect(() => {
    if (answeredRef.current.size === 0) return;
    const answered = answeredRef.current;
    answeredRef.current = new Map();
    returnNow(answered);
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- `answers` is the trigger: the effect runs in the render it makes
  }, [answers, returnNow]);

  const complete = React.useCallback(
    (details: SwipeDeckSwipeDetails) => {
      const leave = sentRef.current.get(details.value);
      // A card that slid back under the pile is back already; only one that
      // faded out waits on your answer.
      if (leave === undefined) {
        onSwipeCompleteRef.current?.(details);
        return;
      }
      let answer: unknown;
      try {
        answer = onSwipeCompleteRef.current?.(details);
      } finally {
        // A promise keeps the card out until it settles; `finally` passes a
        // rejection on, so an error of yours still surfaces. One thrown
        // here ends the leave too, then goes on up.
        if (isThenable(answer)) {
          void Promise.resolve(answer).finally(() =>
            endLeave(details.value, leave),
          );
        } else {
          endLeave(details.value, leave);
        }
      }
    },
    // oxlint-disable-next-line react/memo-dependencies -- `endLeave` is used, in the `finally` block, which this rule misreads
    [endLeave],
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

  // A new front card has yet to come to rest there.
  React.useLayoutEffect(() => {
    setSettledFront(undefined);
    // oxlint-disable-next-line react/exhaustive-effect-dependencies -- `front` is the trigger: each new front card settles afresh
  }, [front]);

  // Read when a card is sent off, by an exit that outlives this render.
  const positionsRef = React.useRef(positions);
  const visibleRef = React.useRef(visibleCount);
  React.useLayoutEffect(() => {
    positionsRef.current = positions;
    visibleRef.current = visibleCount;
  });

  // How far a card sent off from (x, y) must go each way to clear every card
  // in sight, however the layout turns and scatters them.
  const exitExtents = React.useCallback(
    (value: string, element: HTMLElement, x: number, y: number): Extents => {
      const own = element.getBoundingClientRect();
      const home = {
        left: own.left - x,
        right: own.right - x,
        top: own.top - y,
        bottom: own.bottom - y,
      };
      const pile = { ...home };
      for (const [card, record] of itemsRef.current) {
        const position = positionsRef.current.get(card);
        if (
          card === value ||
          position === undefined ||
          position >= visibleRef.current
        ) {
          continue;
        }
        const box = record.element.getBoundingClientRect();
        pile.left = Math.min(pile.left, box.left);
        pile.right = Math.max(pile.right, box.right);
        pile.top = Math.min(pile.top, box.top);
        pile.bottom = Math.max(pile.bottom, box.bottom);
      }
      return {
        right: pile.right - home.left,
        left: home.right - pile.left,
        down: pile.bottom - home.top,
        up: home.bottom - pile.top,
      };
    },
    [],
  );

  // The front card as of now, not of the last render: a second press before
  // the deck re-renders goes to the card after the one just sent.
  const swipeFront = React.useCallback(
    (direction: SwipeDeckDirection, cause: SwipeDeckSwipeCause) => {
      if (disabled || !directions.includes(direction)) return;
      const next = readOrder().find((value) => !sentRef.current.has(value));
      if (next !== undefined)
        itemsRef.current.get(next)?.swipe(direction, cause);
    },
    [directions, disabled, readOrder],
  );

  // Announce the new front card after a swipe or a refill, or the
  // `SwipeDeckEmpty` once none is left. Not on mount, where the deck's own
  // content is read in the normal way.
  const announcedRef = React.useRef<{ front: string | undefined } | null>(null);
  React.useEffect(() => {
    if (!isReady) return;
    const previous = announcedRef.current;
    announcedRef.current = { front };
    const status = statusRef.current;
    if (!previous || previous.front === front || !status) return;
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
  }, [front, isReady]);

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
    // Held down, it would send the whole deck: one card per press.
    if (event.repeat) return;
    swipeFront(direction, { reason: "keyboard", event: event.nativeEvent });
  };

  const context = React.useMemo<SwipeDeckContextValue>(
    () => ({
      directions,
      disabled,
      isReady,
      front,
      positions,
      leaving,
      leavingOrder: leavingList,
      count: order.length,
      visible: visibleCount,
      lift,
      register,
      send,
      isMovedBack,
      rejoin,
      complete,
      exitExtents,
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
      leavingList,
      order.length,
      visibleCount,
      lift,
      register,
      send,
      isMovedBack,
      rejoin,
      complete,
      exitExtents,
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
          // Which way `fan` and `cascade` open: toward the end of the line.
          "[--swipe-deck-side:1] rtl:[--swipe-deck-side:-1]",
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
            "--swipe-deck-visible": visibleCount,
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
 * One card in the deck, a direct child of it. It sits in the deck's first grid
 * cell with every other card, so the deck takes the size of its largest card.
 *
 * Styling hooks: `data-front` on the top card, `data-swiping` while it is
 * dragged, `data-leaving` from the moment it leaves, `data-starting-style`
 * while it comes in and `data-ending-style` once it is clear of the pile and
 * fading (the `motion-fade-lg` recipe), and `data-swipe-direction` for the
 * way it leans or leaves. CSS variables, which what's inside the card can
 * read too: `--swipe-deck-index` (its place in the pile, 0 at the front),
 * `--swipe-deck-place` (that place as it springs from one to the next),
 * `--swipe-deck-movement-x` / `-y` in px, and `--swipe-deck-progress` from 0
 * at rest to 1 where letting go makes the card leave.
 *
 * The card owns its translate, rotate, scale and transform, so its motion
 * recipe can only be a `motion-fade-*` one: a recipe that transitions those
 * would lag every drag.
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
  const {
    directions,
    register,
    send,
    complete,
    rejoin,
    isMovedBack,
    exitExtents,
    focusDeck,
    settle,
  } = deck;
  const prefersReducedMotion = useReducedMotion();
  // Server-rendered and now hydrating: on screen before any script ran.
  const isHydrating = !useIsClientRender();
  const wasHydratedRef = React.useRef(isHydrating);
  const elementRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = React.useMemo(() => mergeRefs(elementRef, ref), [ref]);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Its place in the pile, springing between whole places.
  const place = useMotionValue(0);
  // A card behind grows in from `ENTER_SCALE` as it appears, on top of its
  // layout's own size.
  const enterScale = useMotionValue(1);
  // The press and the lean: a lift under the pointer, a tilt with the throw.
  const press = useMotionValue(1);
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const spin = useMotionValue(0);
  // Where it was grabbed (px from its transform origin), the pivot of both.
  const grabRef = React.useRef<readonly [number, number]>([0, 0]);
  // Whether its drag lifts the cards behind: only the front card's, until it leaves.
  const drivesLiftRef = React.useRef(false);
  const scatter = React.useMemo(() => scatterOf(value), [value]);
  // The way the card is leaving, for `onSwipeComplete` once its exit ends.
  const leftTowardRef = React.useRef<SwipeDeckDirection | null>(null);
  // Stops watching a leaving card for the moment it clears the pile.
  const stopWatchingRef = React.useRef<(() => void) | null>(null);
  // Where a leaving card is headed, until it gets there.
  const exitRef = React.useRef<readonly [number, number] | null>(null);
  // Set when it clears the pile after your list moved it to the back: it
  // slides back under the pile rather than fading.
  const isTuckingRef = React.useRef(false);
  const dragRef = React.useRef<Drag | null>(null);
  // Removes the window listeners of the drag in progress.
  const endDragRef = React.useRef<(() => void) | null>(null);
  // Measured when a drag or exit starts, not every frame.
  const sizeRef = React.useRef<Size>({ width: 0, height: 0 });
  // Set when a drag ends, so the click that follows it doesn't reach the card.
  const draggedRef = React.useRef(false);
  const [isSwiping, setIsSwiping] = React.useState(false);
  const [isFading, setIsFading] = React.useState(false);
  // Every card mounts in the fade recipe's starting style (clear, blurred)
  // and drops it when its turn comes, which fades it in. A card the server
  // drew is on screen already, so it starts without one.
  const [isStarting, setIsStarting] = React.useState(!isHydrating);
  const [direction, setDirection] = React.useState<SwipeDeckDirection>();

  const position = deck.positions.get(value);
  const isLeaving = deck.leaving.has(value);
  const isFront = deck.front === value;
  // Cards behind the front one, or leaving, can't be reached by Tab or screen
  // readers. Unknown before hydration, so nothing is inert then.
  const isInert = isLeaving || (position !== undefined && position > 0);

  // Read by the drag's window listeners, which outlive the render they were
  // made in.
  const directionsRef = React.useRef(directions);
  const disabledRef = React.useRef(deck.disabled);
  const reducedMotionRef = React.useRef(prefersReducedMotion);
  React.useLayoutEffect(() => {
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
    // The press and the tilt, pivoting where the card was grabbed, in Motion's
    // order. `none` at rest, so a still card is drawn flat and sharp.
    const writePose = () => {
      const element = elementRef.current;
      if (!element) return;
      const [grabX, grabY] = grabRef.current;
      element.style.setProperty(
        "--swipe-deck-pose",
        isPoseAtRest(press, spin, tiltX, tiltY)
          ? "none"
          : `translate(${grabX}px, ${grabY}px) perspective(${PERSPECTIVE}px) scale(${press.get()}) rotate(${spin.get()}deg) rotateX(${tiltX.get()}deg) rotateY(${tiltY.get()}deg) translate(${-grabX}px, ${-grabY}px)`,
      );
    };
    const writeNumber = (name: string) => (latest: number) => {
      elementRef.current?.style.setProperty(name, String(latest));
    };
    const stops = [
      x.on("change", write),
      y.on("change", write),
      place.on("change", writeNumber("--swipe-deck-place")),
      enterScale.on("change", writeNumber("--swipe-deck-enter-scale")),
      press.on("change", writePose),
      spin.on("change", writePose),
      tiltX.on("change", writePose),
      tiltY.on("change", writePose),
    ];
    // Shown again after React hid the deck mid-exit (a Suspense fallback, an
    // Activity): the exit stopped with it, so the card finishes leaving.
    const exit = exitRef.current;
    if (exit) {
      exitRef.current = null;
      x.jump(exit[0]);
      y.jump(exit[1]);
      setIsFading(true);
    }
    return () => {
      for (const stop of stops) stop();
      // Removed mid-drag: the cards behind settle back from its lift.
      if (dragRef.current) releaseLift(deck.lift, reducedMotionRef.current);
      endDragRef.current?.();
      stopWatchingRef.current?.();
      for (const motionValue of [
        x,
        y,
        place,
        enterScale,
        press,
        spin,
        tiltX,
        tiltY,
      ]) {
        motionValue.stop();
      }
    };
  }, [deck.lift, enterScale, place, press, spin, tiltX, tiltY, x, y]);

  // The lift, written on the cards it moves: the front card's (which may be
  // moving up from behind) and those behind, up to the first one out of
  // sight, which it fades in. On the deck it would restyle all of it.
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element || position === undefined || position > deck.visible) return;
    const writeLift = (latest: number) =>
      element.style.setProperty("--swipe-deck-lift", String(latest));
    writeLift(deck.lift.get());
    const stop = deck.lift.on("change", writeLift);
    return () => {
      stop();
      element.style.removeProperty("--swipe-deck-lift");
    };
  }, [deck.lift, deck.visible, position]);

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

  // Lowers the card and lays it flat once it's let go.
  const settleFace = React.useCallback(() => {
    for (const [motionValue, rest] of [
      [press, 1],
      [spin, 0],
      [tiltX, 0],
      [tiltY, 0],
    ] as const) {
      if (reducedMotionRef.current) motionValue.jump(rest);
      else animate(motionValue, rest, FACE_SPRING);
    }
  }, [press, spin, tiltX, tiltY]);

  // Tilts the dragged card toward where it's going: mostly with the pointer's
  // speed, some with how far it has come.
  const tilt = React.useCallback(
    (vx: number, vy: number) => {
      if (reducedMotionRef.current) return;
      const sideways =
        clampUnit(vx / LEAN_SPEED) * 0.7 +
        clampUnit(x.get() / LEAN_REACH) * 0.3;
      const upward =
        clampUnit(-vy / LEAN_SPEED) * 0.7 +
        clampUnit(-y.get() / LEAN_REACH) * 0.3;
      animate(tiltY, sideways * TILT, LEAN_SPRING);
      animate(tiltX, upward * TILT, LEAN_SPRING);
      animate(spin, clampUnit(x.get() / LEAN_REACH) * SPIN, LEAN_SPRING);
    },
    [spin, tiltX, tiltY, x, y],
  );

  // The card goes on the way it is heading (where its throw would carry it,
  // which for a card let go still is where it was dragged) to its exit point,
  // just clear of the pile, on `EXIT_SPRING`. Once clear and caught, its exit
  // recipe fades it, or it slides back under the pile if your list moved it
  // to the back. Keys and actions have no heading, so they go straight, the
  // way pressed, wherever the card was.
  const fling = React.useCallback(
    (to: SwipeDeckDirection, velocity?: readonly [number, number]) => {
      const [vx, vy] = velocity ?? [0, 0];
      // A key or action can send the card off mid-drag: that drag is over.
      endDragRef.current?.();
      setIsSwiping(false);
      leftTowardRef.current = to;
      setDirection(to);
      // The cards behind settle from their lift into their new places, on
      // the same spring as their places, so the two cancel out smoothly.
      drivesLiftRef.current = false;
      releaseLift(deck.lift, prefersReducedMotion);
      settleFace();
      setIsStarting(false);
      const element = elementRef.current;
      if (prefersReducedMotion || !element) {
        setIsFading(true);
        return;
      }
      const extents = exitExtents(value, element, x.get(), y.get());
      const aheadX = x.get() + vx * THROW_TIME;
      const aheadY = y.get() + vy * THROW_TIME;
      const heading: readonly [number, number] =
        velocity && Math.hypot(aheadX, aheadY) >= 1
          ? [aheadX, aheadY]
          : DIRECTION_VECTORS[to];
      const [targetX, targetY] = exitPoint(x.get(), y.get(), heading, extents);
      exitRef.current = [targetX, targetY];
      const headingLength = Math.hypot(...heading);
      const [ux, uy] = [heading[0] / headingLength, heading[1] / headingLength];
      let isOut = false;
      const leaveSight = () => {
        if (isOut) return;
        isOut = true;
        exitRef.current = null;
        stopWatchingRef.current?.();
        stopWatchingRef.current = null;
        if (isMovedBack(value)) {
          isTuckingRef.current = true;
          rejoin(value);
        } else {
          setIsFading(true);
        }
      };
      // Out once clear and caught: a hard throw first runs out against the
      // spring, so its limit shows before the card goes.
      const check = () => {
        const outward = x.getVelocity() * ux + y.getVelocity() * uy;
        if (isClear(x.get(), y.get(), extents) && outward <= CAUGHT_SPEED) {
          leaveSight();
        }
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
        onComplete: isMainX ? leaveSight : undefined,
      });
      animate(y, targetY, {
        ...EXIT_SPRING,
        velocity: vy,
        onComplete: isMainX ? undefined : leaveSight,
      });
    },
    [
      deck.lift,
      exitExtents,
      isMovedBack,
      prefersReducedMotion,
      rejoin,
      settleFace,
      value,
      x,
      y,
    ],
  );

  // Asks your `onSwipe`, then sends the card off unless it was cancelled.
  const swipe = (
    to: SwipeDeckDirection,
    cause: SwipeDeckSwipeCause,
    velocity?: readonly [number, number],
  ) => {
    if (!send({ value, direction: to }, cause)) return false;
    fling(to, velocity);
    return true;
  };
  const swipeRef = React.useRef(swipe);
  React.useEffect(() => {
    swipeRef.current = swipe;
  });

  React.useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    return register(value, {
      element,
      swipe: (to, cause) => {
        sizeRef.current = sizeOf(element);
        swipeRef.current(to, cause);
      },
    });
  }, [register, value]);

  // `onSwipeComplete` waits for the exit recipe to end, as Base UI waits for
  // its own exits. With reduced motion the recipe takes no time, so it comes
  // at once.
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
        complete({ value, direction: to });
      });
    });
    return () => {
      isCancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [complete, isFading, value, x, y]);

  // The card's place springs to its new one whenever the pile changes; the
  // first one it takes, and any out of sight, it takes at once. A card back
  // from leaving either slides home under the pile (your list moved it to
  // the back as it left) or, faded out, comes in again like a dealt card.
  const wasLeavingRef = React.useRef(false);
  const isPlacedRef = React.useRef(false);
  // Out of sight, one place looks like any other: it springs as far as the
  // first hidden place and jumps the rest, rather than rushing past the cards
  // in sight on its way to a place far back.
  const springPlace = React.useCallback(
    (target: number, spring: typeof PLACE_SPRING | typeof TUCK_SPRING) => {
      const shown = Math.min(target, deck.visible);
      animate(place, shown, {
        ...spring,
        onComplete: shown === target ? undefined : () => place.jump(target),
      });
    },
    [deck.visible, place],
  );
  const enterAtRef = React.useRef<number | null>(null);
  const isReenteringRef = React.useRef(false);
  React.useEffect(() => {
    const target = isLeaving ? 0 : position;
    if (target === undefined) return;
    if (wasLeavingRef.current && !isLeaving) {
      // Its exit is over, whichever way it ends.
      stopWatchingRef.current?.();
      stopWatchingRef.current = null;
      exitRef.current = null;
      if (isTuckingRef.current) {
        isTuckingRef.current = false;
        animate(x, 0, TUCK_SPRING);
        animate(y, 0, TUCK_SPRING);
        springPlace(target, TUCK_SPRING);
        const to = leftTowardRef.current;
        if (to) complete({ value, direction: to });
      } else {
        x.jump(0);
        y.jump(0);
        place.jump(target);
        setIsFading(false);
        enterAtRef.current = null;
        isReenteringRef.current = true;
        setIsStarting(true);
      }
    } else if (
      prefersReducedMotion ||
      !isPlacedRef.current ||
      // Where it is now, not where it was last sent: a card still sliding in
      // under the pile is in sight.
      (place.get() > deck.visible && target > deck.visible)
    ) {
      place.jump(target);
    } else {
      springPlace(target, PLACE_SPRING);
    }
    isPlacedRef.current = true;
    wasLeavingRef.current = isLeaving;
  }, [
    complete,
    deck.visible,
    isLeaving,
    place,
    position,
    prefersReducedMotion,
    springPlace,
    value,
    x,
    y,
  ]);

  // Drawn by the server, the front card was on screen before any script ran,
  // and the cards behind were hidden (see the classes below): those now come
  // in behind it, as they would have.
  React.useLayoutEffect(() => {
    if (
      wasHydratedRef.current &&
      elementRef.current?.matches(`${ITEM_SELECTOR} ~ *`)
    ) {
      setIsStarting(true);
    }
  }, []);

  // The entrance: the front card fades in first, then the cards behind
  // appear one after another, growing in as they fade. Its time is set once,
  // at the first place it takes; reaching the front early cuts it short. A
  // card coming back comes at once. With reduced motion the recipe takes no
  // time and they all appear at once; cards out of sight skip it.
  React.useEffect(() => {
    if (!isStarting || position === undefined) return;
    if (enterAtRef.current === null) {
      const isBehind =
        !prefersReducedMotion && position > 0 && position < deck.visible;
      const delay =
        isBehind && !isReenteringRef.current
          ? ENTER_LEAD + (position - 1) * ENTER_STAGGER
          : 0;
      isReenteringRef.current = false;
      enterAtRef.current = performance.now() + delay * 1000;
      if (isBehind) {
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
  }, [deck.visible, enterScale, isStarting, position, prefersReducedMotion]);

  // In front, the card tells the deck once it has come to rest there: its
  // move to the front done and its entrance over. `SwipeDeckEmpty` waits for
  // that, so it never shows around a card still moving in.
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

  // Out of reach with focus inside (a button of yours in the card, as it
  // leaves or as your list puts another card first): hand focus to the deck
  // rather than let it fall to the page. Before paint, so it's never dropped.
  React.useLayoutEffect(() => {
    if (isInert && elementRef.current?.contains(document.activeElement)) {
      focusDeck();
    }
  }, [focusDeck, isInert]);

  // A drag ends early if its card stops being the front one (your list put
  // another card first) or the deck turns disabled; the card springs back.
  // No longer in front, it no longer drives the lift, so let the lift go.
  React.useEffect(() => {
    if ((isFront && !deck.disabled) || !dragRef.current) return;
    endDragRef.current?.();
    setIsSwiping(false);
    settleFace();
    snapBack();
    if (!isFront) releaseLift(deck.lift, prefersReducedMotion);
  }, [
    deck.disabled,
    deck.lift,
    isFront,
    prefersReducedMotion,
    settleFace,
    snapBack,
  ]);

  const release = (drag: Drag, event: PointerEvent) => {
    settleFace();
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
    // A resisted axis moved slower than the pointer: it brings no throw.
    const [pointerVx, pointerVy] = releaseVelocity(
      drag.samples,
      event.timeStamp,
    );
    const velocity: [number, number] = [
      isOpenSide(directionsRef.current, true, x.get()) ? pointerVx : 0,
      isOpenSide(directionsRef.current, false, y.get()) ? pointerVy : 0,
    ];
    if (event.type === "pointerup" && !disabledRef.current) {
      // Where the card is, plus what its throw adds: far enough, and it leaves.
      const ahead = lean(
        directionsRef.current,
        x.get() + velocity[0] * THROW_TIME,
        y.get() + velocity[1] * THROW_TIME,
        sizeRef.current,
      );
      if (
        ahead.direction &&
        ahead.share >= 1 &&
        swipe(ahead.direction, { reason: "swipe", event }, velocity)
      ) {
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
    const size = sizeOf(element);
    sizeRef.current = size;
    // The press lifts the card under the pointer, the tilt turns it there.
    // Pressed again before the last pose settles, it keeps that pivot, so
    // the card doesn't jump.
    if (isPoseAtRest(press, spin, tiltX, tiltY)) {
      grabRef.current = grabPoint(element, event.clientX, event.clientY, size);
    }
    if (!prefersReducedMotion) animate(press, PRESS_SCALE, PRESS_SPRING);
    // A card caught while resisted sits short of the pointer's pull: start
    // from that pull, so it doesn't jump.
    const openAtPress = directionsRef.current;
    const drag: Drag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: isOpenSide(openAtPress, true, x.get())
        ? x.get()
        : unresist(x.get(), size.width),
      originY: isOpenSide(openAtPress, false, y.get())
        ? y.get()
        : unresist(y.get(), size.height),
      moved: false,
      samples: [{ x: event.clientX, y: event.clientY, time: event.timeStamp }],
      idle: undefined,
    };
    dragRef.current = drag;

    // On the window, so a press that slips off the card before it becomes a
    // drag still ends.
    const handleMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== drag.pointerId) return;
      // No button down any more, yet no release came (a system menu took it,
      // as macOS's Control-click does): the press is over, as if cancelled.
      if (moveEvent.buttons === 0) {
        endDrag();
        release(drag, moveEvent);
        return;
      }
      const dx = moveEvent.clientX - drag.startX;
      const dy = moveEvent.clientY - drag.startY;
      if (!drag.moved) {
        if (Math.hypot(dx, dy) < DRAG_SLOP) return;
        drag.moved = true;
        // Captured only now, not on press: capturing on press would send the
        // click to the card instead of a button or link inside it. A pointer
        // already gone (or a test DOM without capture) can't be captured;
        // the window listeners follow the drag all the same.
        try {
          element.setPointerCapture(drag.pointerId);
        } catch {
          // Nothing to undo: the drag goes on without capture.
        }
        setIsSwiping(true);
      }
      // Free toward a side it can leave by; resisting toward one it can't,
      // so the drag shows that way won't work before letting go does.
      const allowed = directionsRef.current;
      const { width, height } = sizeRef.current;
      x.set(follow(allowed, true, drag.originX + dx, width));
      y.set(follow(allowed, false, drag.originY + dy, height));
      drag.samples.push({
        x: moveEvent.clientX,
        y: moveEvent.clientY,
        time: moveEvent.timeStamp,
      });
      if (drag.samples.length > 20) drag.samples.shift();
      setDirection(lean(allowed, x.get(), y.get(), sizeRef.current).direction);
      const [pointerVx, pointerVy] = releaseVelocity(
        drag.samples,
        moveEvent.timeStamp,
      );
      tilt(
        isOpenSide(allowed, true, x.get()) ? pointerVx : 0,
        isOpenSide(allowed, false, y.get()) ? pointerVy : 0,
      );
      // Held still, the throw's share of the tilt goes.
      window.clearTimeout(drag.idle);
      drag.idle = window.setTimeout(() => {
        if (dragRef.current === drag) tilt(0, 0);
      }, LEAN_IDLE);
    };
    const handleEnd = (endEvent: PointerEvent) => {
      if (endEvent.pointerId !== drag.pointerId) return;
      endDrag();
      release(drag, endEvent);
    };
    const endDrag = () => {
      window.clearTimeout(drag.idle);
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

  // Leaving cards stay above the pile, the one sent off first on top: it was
  // above the others in the pile too.
  const zIndex = isLeaving
    ? deck.count + deck.leavingOrder.length - deck.leavingOrder.indexOf(value)
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
      inert={isInert}
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
        // The press and the tilt, on top of all that.
        "[transform:var(--swipe-deck-pose,none)]",
        "[opacity:clamp(0,calc(var(--swipe-deck-visible,4)_-_var(--swipe-deck-slot)),1)]",
        // stack: peeking above the front card.
        "group-data-[layout=stack]/swipe-deck:origin-top",
        "group-data-[layout=stack]/swipe-deck:[--swipe-deck-layout-y:calc(var(--swipe-deck-layout-slot)_*_var(--swipe-deck-spread,0.5)_*_-32px)]",
        "group-data-[layout=stack]/swipe-deck:[--swipe-deck-layout-scale:max(0,calc(1_-_var(--swipe-deck-layout-slot)_*_var(--swipe-deck-depth,0.5)_*_0.1))]",
        // fan: turned out from the bottom corner on the line's end side, like
        // a hand of cards.
        "group-data-[layout=fan]/swipe-deck:origin-[90%_90%] group-data-[layout=fan]/swipe-deck:rtl:origin-[10%_90%]",
        "group-data-[layout=fan]/swipe-deck:[--swipe-deck-layout-rotate:calc(var(--swipe-deck-layout-slot)_*_var(--swipe-deck-spread,0.5)_*_8deg_*_var(--swipe-deck-side,1))]",
        "group-data-[layout=fan]/swipe-deck:[--swipe-deck-layout-scale:max(0,calc(1_-_var(--swipe-deck-layout-slot)_*_var(--swipe-deck-depth,0.5)_*_0.12))]",
        // cascade: stepping up and toward the line's end.
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
        // No iOS image menu or tap flash from a long press mid-swipe.
        "[-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]",
        // Before the deck has met its cards (as the server drew them), only
        // the first is shown, in front where it belongs.
        // Clear as well as hidden, as in the fade's starting style, so the
        // cards behind deal in from nothing once the script runs.
        !deck.isReady &&
          "[&:is([data-slot=swipe-deck-item]~*)]:invisible [&:is([data-slot=swipe-deck-item]~*)]:opacity-0",
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
        data-slot="swipe-deck-empty-outline-path"
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
 * what comes next; it can be reached (Tab, clicks) and screen readers hear it
 * (its `aria-label`, or its text) once that last card has gone too.
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
 * without dragging. Disabled (and still focusable) when the deck is disabled,
 * has no card in front, or can't go that way.
 */
function SwipeDeckAction({
  direction,
  disabled,
  onClick,
  onKeyDown,
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
        if (!event.defaultPrevented) {
          deck.swipeFront(direction, {
            reason: "action-press",
            event: event.nativeEvent,
          });
        }
      }}
      // Enter held down presses a button again and again: one card per press.
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.repeat && event.key === "Enter") event.preventDefault();
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
  SwipeDeckSwipeEventDetails,
  SwipeDeckSwipeEventReason,
  SwipeDeckDirection,
};
