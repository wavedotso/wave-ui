import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "./lib/internal-icons";
import { cn } from "./lib/utils";
import {
  SwipeDeck,
  SwipeDeckAction,
  SwipeDeckEmpty,
  SwipeDeckItem,
  type SwipeDeckDirection,
  type SwipeDeckLayout,
  type SwipeDeckProps,
} from "./swipe-deck";

/**
 * The stories' own parts, not the deck's: the buttons are `SwipeDeckAction`
 * children an app renders or leaves out, and a counter is the app's own text.
 * Shown or hidden from the controls.
 */
interface Parts {
  actions?: boolean;
  counter?: boolean;
}

const meta = {
  title: "Data Display/SwipeDeck",
  component: SwipeDeck,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A pile of cards people swipe away, whatever the cards hold: photos, art, products, anything. Drag or flick the front card, focus the deck and press an arrow key, or use the buttons. Your list stays the source of truth: `onSwipe` comes the moment a card is sent off (count it, or cancel to keep it), and `onSwipeComplete` once it has gone, when you remove it from your list. Move a card to the end of your list in `onSwipe` and it slides back under the pile instead. Put a card back at the start of your list to undo. The cards are the deck's own children; for a long list, render the next few dozen. Needs the `motion` package.",
      },
    },
  },
  args: { layout: "fan", spread: 0.5, depth: 0.5, visible: 4, actions: true },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["stack", "fan", "cascade", "pile"],
    },
    spread: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    depth: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    visible: { control: { type: "range", min: 1, max: 10, step: 1 } },
    directions: { table: { disable: true } },
    disabled: { table: { disable: true } },
    actions: {
      control: "boolean",
      description:
        "Story only: the buttons, `SwipeDeckAction` children your app renders or leaves out.",
    },
  },
} satisfies Meta<SwipeDeckProps & Parts>;

export default meta;
type Story = StoryObj<SwipeDeckProps & Parts>;

/** The deck's look, from the story's controls. */
type Look = Pick<SwipeDeckProps, "layout" | "spread" | "depth" | "visible">;

function lookOf({ layout, spread, depth, visible }: Look): Look {
  return { layout, spread, depth, visible };
}

interface DemoProps extends Parts {
  look: Look;
}

/** Shows the Counter control on a story that has one. */
const COUNTER = {
  args: { counter: true },
  argTypes: {
    counter: {
      control: "boolean",
      description: "Story only: your app's own count, from `onSwipe`.",
    },
  },
} satisfies Pick<Story, "args" | "argTypes">;

interface Swatch {
  id: string;
  label: string;
  /** A Wave Palette's 500. */
  color: string;
}

const SWATCHES: Swatch[] = [
  { id: "blue", label: "Blue", color: "bg-(--wave-blue-500)" },
  { id: "indigo", label: "Indigo", color: "bg-(--wave-indigo-500)" },
  { id: "purple", label: "Purple", color: "bg-(--wave-purple-500)" },
  { id: "pink", label: "Pink", color: "bg-(--wave-pink-500)" },
  { id: "red", label: "Red", color: "bg-(--wave-red-500)" },
  { id: "orange", label: "Orange", color: "bg-(--wave-orange-500)" },
  { id: "yellow", label: "Yellow", color: "bg-(--wave-yellow-500)" },
  { id: "lime", label: "Lime", color: "bg-(--wave-lime-500)" },
  { id: "green", label: "Green", color: "bg-(--wave-green-500)" },
  { id: "teal", label: "Teal", color: "bg-(--wave-teal-500)" },
];

const LEFT_RIGHT: SwipeDeckDirection[] = ["left", "right"];
const ALL_DIRECTIONS: SwipeDeckDirection[] = ["left", "right", "up", "down"];

const CHEVRONS: Record<
  SwipeDeckDirection,
  (props: React.SVGProps<SVGSVGElement>) => React.ReactNode
> = {
  left: ChevronLeftIcon,
  right: ChevronRightIcon,
  up: ChevronUpIcon,
  down: ChevronDownIcon,
};

// The same 1px edge as Card and Toast, a border. One shadow, on the card on top:
// stacked cards would stack shadows.
const SWATCH_CARD =
  "border-edge aspect-square border data-front:shadow-md data-leaving:shadow-md";

function SwatchItem({ swatch }: { swatch: Swatch }) {
  return (
    <SwipeDeckItem
      value={swatch.id}
      aria-label={swatch.label}
      className={cn(SWATCH_CARD, swatch.color)}
    />
  );
}

/** Pass to the left, like to the right. Equal weight, so neither nudges the choice. */
function DecideActions() {
  return (
    // Swipe directions are physical, so their buttons keep left on the left
    // in right-to-left text too.
    <div dir="ltr" className="flex justify-center gap-2">
      <SwipeDeckAction direction="left" variant="secondary">
        <ChevronLeftIcon data-icon="inline-start" />
        Pass
      </SwipeDeckAction>
      <SwipeDeckAction direction="right" variant="secondary">
        Like
        <ChevronRightIcon data-icon="inline-end" />
      </SwipeDeckAction>
    </div>
  );
}

function Actions({
  directions,
}: {
  directions: readonly SwipeDeckDirection[];
}) {
  return (
    // Swipe directions are physical, so their buttons keep left on the left
    // in right-to-left text too.
    <div dir="ltr" className="flex justify-center gap-2">
      {directions.map((direction) => {
        const Chevron = CHEVRONS[direction];
        return (
          <SwipeDeckAction
            key={direction}
            direction={direction}
            variant="secondary"
            size="icon"
            aria-label={`Swipe ${direction}`}
          >
            <Chevron />
          </SwipeDeckAction>
        );
      })}
    </div>
  );
}

/** Moves a card to the end of a list, so the deck never runs out. */
function toBack<T extends { id: string }>(cards: T[], value: string) {
  return [
    ...cards.filter((card) => card.id !== value),
    ...cards.filter((card) => card.id === value),
  ];
}

/**
 * A fresh copy of a list for another round. A card dealt again is a new card,
 * so it gets a new id: the old one may still be leaving, and its late
 * `onSwipeComplete` would otherwise remove the new one.
 */
function dealAgain<T extends { id: string }>(
  cards: readonly T[],
  round: number,
): T[] {
  return cards.map((card) => ({ ...card, id: `${card.id}-${round}` }));
}

function without<T extends { id: string }>(cards: T[], value: string) {
  return cards.filter((card) => card.id !== value);
}

function DiscardDemo({ look, actions = true, counter = true }: DemoProps) {
  const [swatches, setSwatches] = React.useState(SWATCHES);
  const [passed, setPassed] = React.useState(0);
  const round = React.useRef(0);
  const [liked, setLiked] = React.useState(0);

  return (
    <div className="flex w-72 flex-col gap-4">
      <SwipeDeck
        aria-label="Colours"
        className="gap-4"
        {...look}
        // Counted the moment it's sent off, removed once it's gone.
        onSwipe={({ direction }) => {
          if (direction === "right") setLiked((count) => count + 1);
          else setPassed((count) => count + 1);
        }}
        onSwipeComplete={({ value }) =>
          setSwatches((previous) => without(previous, value))
        }
      >
        {swatches.map((swatch) => (
          <SwatchItem key={swatch.id} swatch={swatch} />
        ))}
        <SwipeDeckEmpty>
          <p className="text-contrast font-medium">That's all</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              round.current += 1;
              const fresh = dealAgain(SWATCHES, round.current);
              // Cards still leaving stay until they're gone.
              setSwatches((previous) => [...previous, ...fresh]);
              setPassed(0);
              setLiked(0);
            }}
          >
            Start over
          </Button>
        </SwipeDeckEmpty>
        {actions && <DecideActions />}
      </SwipeDeck>
      {counter && (
        <p className="text-muted text-center text-sm">
          {passed} passed · {liked} liked
        </p>
      )}
    </div>
  );
}

/**
 * Pass or like. `onSwipe` counts each card the moment it's sent off;
 * `onSwipeComplete` drops it from the list once it has gone.
 */
export const Default: Story = {
  ...COUNTER,
  render: (args) => (
    <DiscardDemo
      look={lookOf(args)}
      actions={args.actions}
      counter={args.counter}
    />
  ),
};

function EmptyMessageDemo({ look, actions = true }: DemoProps) {
  const [swatches, setSwatches] = React.useState(SWATCHES.slice(0, 3));

  return (
    <SwipeDeck
      aria-label="Colours"
      className="w-72 gap-4"
      {...look}
      onSwipeComplete={({ value }) =>
        setSwatches((previous) => without(previous, value))
      }
    >
      {swatches.map((swatch) => (
        <SwatchItem key={swatch.id} swatch={swatch} />
      ))}
      <SwipeDeckEmpty>All colours sorted</SwipeDeckEmpty>
      {actions && <DecideActions />}
    </SwipeDeck>
  );
}

/** `SwipeDeckEmpty` holds whatever ends your deck: here, just a message. */
export const EmptyMessage: Story = {
  render: (args) => (
    <EmptyMessageDemo look={lookOf(args)} actions={args.actions} />
  ),
};

function CycleDemo({ look, actions = true }: DemoProps) {
  const [swatches, setSwatches] = React.useState(SWATCHES);

  return (
    <SwipeDeck
      aria-label="Colours"
      className="w-72 gap-4"
      {...look}
      onSwipe={({ value }) =>
        setSwatches((previous) => toBack(previous, value))
      }
    >
      {swatches.map((swatch) => (
        <SwatchItem key={swatch.id} swatch={swatch} />
      ))}
      {actions && <Actions directions={LEFT_RIGHT} />}
    </SwipeDeck>
  );
}

/**
 * Moved to the end of the list in `onSwipe`, a card slides back under the
 * pile, so the deck never runs out.
 */
export const Cycle: Story = {
  render: (args) => <CycleDemo look={lookOf(args)} actions={args.actions} />,
};

function AllDirectionsDemo({ look, actions = true }: DemoProps) {
  const [swatches, setSwatches] = React.useState(SWATCHES);

  return (
    <SwipeDeck
      aria-label="Colours"
      className="w-72 gap-4"
      {...look}
      directions={ALL_DIRECTIONS}
      onSwipe={({ value }) =>
        setSwatches((previous) => toBack(previous, value))
      }
    >
      {swatches.map((swatch) => (
        <SwatchItem key={swatch.id} swatch={swatch} />
      ))}
      {actions && <Actions directions={ALL_DIRECTIONS} />}
    </SwipeDeck>
  );
}

/** `directions` sets the ways a card can leave; here all four. */
export const AllDirections: Story = {
  render: (args) => (
    <AllDirectionsDemo look={lookOf(args)} actions={args.actions} />
  ),
};

const STAMP =
  "bg-surface/90 text-contrast border-edge absolute top-5 rounded-md px-3 py-1 text-lg font-semibold opacity-0 border";

function StampsDemo({ look, actions = true }: DemoProps) {
  const [swatches, setSwatches] = React.useState(SWATCHES);

  return (
    <SwipeDeck
      aria-label="Colours"
      className="w-72 gap-4"
      {...look}
      onSwipe={({ value }) =>
        setSwatches((previous) => toBack(previous, value))
      }
    >
      {swatches.map((swatch) => (
        <SwipeDeckItem
          key={swatch.id}
          value={swatch.id}
          aria-label={swatch.label}
          className={cn("group/card", SWATCH_CARD, swatch.color)}
        >
          {/* Each stamp shows as the card leans its way, fully where letting go sends it off. */}
          <span
            aria-hidden
            className={cn(
              STAMP,
              "start-5 -rotate-12 group-data-[swipe-direction=right]/card:opacity-(--swipe-deck-progress)",
            )}
          >
            Like
          </span>
          <span
            aria-hidden
            className={cn(
              STAMP,
              "end-5 rotate-12 group-data-[swipe-direction=left]/card:opacity-(--swipe-deck-progress)",
            )}
          >
            Pass
          </span>
        </SwipeDeckItem>
      ))}
      {actions && <DecideActions />}
    </SwipeDeck>
  );
}

/**
 * Stamps made from the card's own hooks: `data-swipe-direction` says which
 * way it leans, and `--swipe-deck-progress` how far, up to 1 where letting go
 * sends it off.
 */
export const Stamps: Story = {
  render: (args) => <StampsDemo look={lookOf(args)} actions={args.actions} />,
};

interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

const FLASHCARDS: Flashcard[] = [
  {
    id: "hue",
    question: "What does a colour's hue describe?",
    answer: "Where it sits on the colour wheel: red, green, blue and so on.",
  },
  {
    id: "lightness",
    question: "What does lightness measure?",
    answer: "How close a colour is to white or to black.",
  },
  {
    id: "chroma",
    question: "What is chroma?",
    answer: "How vivid a colour is, from grey to full colour.",
  },
  {
    id: "contrast",
    question: "How much contrast does body text need?",
    answer: "At least 4.5 to 1 against its background.",
  },
  {
    id: "meaning",
    question: "Why shouldn't colour carry meaning alone?",
    answer:
      "Not everyone sees colour the same way: pair it with words or an icon.",
  },
];

function FlashcardItem({
  card,
  isAnswerShown,
  onToggleAnswer,
}: {
  card: Flashcard;
  isAnswerShown: boolean;
  onToggleAnswer: () => void;
}) {
  return (
    <SwipeDeckItem
      value={card.id}
      className="bg-surface text-contrast border-edge flex aspect-[4/3] flex-col gap-3 p-6 border data-front:shadow-md data-leaving:shadow-md"
    >
      <p className="text-base font-medium">{card.question}</p>
      {isAnswerShown && <p className="text-muted text-sm">{card.answer}</p>}
      {/* The same button both ways, so focus stays on it. */}
      <Button
        variant="outline"
        size="sm"
        className="mt-auto self-start"
        onClick={onToggleAnswer}
      >
        {isAnswerShown ? "Hide answer" : "Show answer"}
      </Button>
    </SwipeDeckItem>
  );
}

function FlashcardsDemo({ look, actions = true }: DemoProps) {
  const [cards, setCards] = React.useState(FLASHCARDS);
  const [shown, setShown] = React.useState<ReadonlySet<string>>(new Set());
  const round = React.useRef(0);

  const showAnswer = (id: string, isShown: boolean) =>
    setShown((previous) => {
      const next = new Set(previous);
      if (isShown) next.add(id);
      else next.delete(id);
      return next;
    });

  return (
    <SwipeDeck
      aria-label="Flashcards"
      className="w-80 gap-4"
      {...look}
      // Not known yet: back to the end of the pile at once, question up.
      onSwipe={({ value, direction }) => {
        if (direction === "left") {
          setCards((previous) => toBack(previous, value));
          showAnswer(value, false);
        }
      }}
      // Known: gone once it has left.
      onSwipeComplete={({ value, direction }) => {
        if (direction === "right") {
          setCards((previous) => without(previous, value));
        }
      }}
    >
      {cards.map((card) => (
        <FlashcardItem
          key={card.id}
          card={card}
          isAnswerShown={shown.has(card.id)}
          onToggleAnswer={() => showAnswer(card.id, !shown.has(card.id))}
        />
      ))}
      <SwipeDeckEmpty>
        <p className="text-contrast font-medium">All learned</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            round.current += 1;
            const fresh = dealAgain(FLASHCARDS, round.current);
            setCards((previous) => [...previous, ...fresh]);
          }}
        >
          Start over
        </Button>
      </SwipeDeckEmpty>
      {actions && (
        <div dir="ltr" className="flex justify-center gap-2">
          <SwipeDeckAction direction="left" variant="secondary">
            <ChevronLeftIcon data-icon="inline-start" />
            Again
          </SwipeDeckAction>
          <SwipeDeckAction direction="right" variant="secondary">
            Got it
            <ChevronRightIcon data-icon="inline-end" />
          </SwipeDeckAction>
        </div>
      )}
    </SwipeDeck>
  );
}

/**
 * Cards with real content, a button inside each. Not known yet, a card goes
 * to the back of the pile in `onSwipe`; known, it's dropped in
 * `onSwipeComplete`.
 */
export const Flashcards: Story = {
  render: (args) => (
    <FlashcardsDemo look={lookOf(args)} actions={args.actions} />
  ),
};

const LIKES = 3;

function LimitDemo({ look, actions = true, counter = true }: DemoProps) {
  const [swatches, setSwatches] = React.useState(SWATCHES);
  const [likesLeft, setLikesLeft] = React.useState(LIKES);
  // Counted in a ref as well, so two swipes in one moment can't both take
  // the last like.
  const likesLeftRef = React.useRef(LIKES);
  const round = React.useRef(0);

  return (
    <div className="flex w-72 flex-col gap-4">
      <SwipeDeck
        aria-label="Colours"
        className="gap-4"
        {...look}
        onSwipe={({ direction }, eventDetails) => {
          if (direction !== "right") return;
          // Out of likes: the card stays in front.
          if (likesLeftRef.current === 0) {
            eventDetails.cancel();
            return;
          }
          likesLeftRef.current -= 1;
          setLikesLeft(likesLeftRef.current);
        }}
        onSwipeComplete={({ value }) =>
          setSwatches((previous) => without(previous, value))
        }
      >
        {swatches.map((swatch) => (
          <SwatchItem key={swatch.id} swatch={swatch} />
        ))}
        <SwipeDeckEmpty>
          <p className="text-contrast font-medium">That's all</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              round.current += 1;
              const fresh = dealAgain(SWATCHES, round.current);
              setSwatches((previous) => [...previous, ...fresh]);
              likesLeftRef.current = LIKES;
              setLikesLeft(LIKES);
            }}
          >
            Start over
          </Button>
        </SwipeDeckEmpty>
        {actions && <DecideActions />}
      </SwipeDeck>
      {counter && (
        <p className="text-muted text-center text-sm">
          {likesLeft === 0
            ? "No likes left: passing only"
            : `${likesLeft} ${likesLeft === 1 ? "like" : "likes"} left`}
        </p>
      )}
    </div>
  );
}

/** `eventDetails.cancel()` in `onSwipe` keeps the card: here, after three likes. */
export const Limit: Story = {
  ...COUNTER,
  render: (args) => (
    <LimitDemo
      look={lookOf(args)}
      actions={args.actions}
      counter={args.counter}
    />
  ),
};

function UndoDemo({ look, actions = true }: DemoProps) {
  const [swatches, setSwatches] = React.useState(SWATCHES);
  const [gone, setGone] = React.useState<Swatch[]>([]);
  const last = gone.at(-1);

  return (
    <div className="flex w-72 flex-col gap-4">
      <SwipeDeck
        aria-label="Colours"
        className="gap-4"
        {...look}
        onSwipeComplete={({ value }) => {
          const swatch = SWATCHES.find((s) => s.id === value);
          if (swatch) setGone((previous) => [...previous, swatch]);
          setSwatches((previous) => without(previous, value));
        }}
      >
        {swatches.map((swatch) => (
          <SwatchItem key={swatch.id} swatch={swatch} />
        ))}
        <SwipeDeckEmpty>That's all</SwipeDeckEmpty>
        {actions && <DecideActions />}
      </SwipeDeck>
      <Button
        variant="ghost"
        size="sm"
        className="self-center"
        disabled={!last}
        onClick={() => {
          if (!last) return;
          setGone((previous) => previous.slice(0, -1));
          setSwatches((previous) => [last, ...previous]);
        }}
      >
        Undo
      </Button>
    </div>
  );
}

/** Undo puts the last card back at the start of the list, and it comes in on top. */
export const Undo: Story = {
  render: (args) => <UndoDemo look={lookOf(args)} actions={args.actions} />,
};

/** Nothing leaves: no drag, no arrow keys, and the buttons are off. */
export const Disabled: Story = {
  render: (args) => (
    <SwipeDeck
      aria-label="Colours"
      className="w-72 gap-4"
      {...lookOf(args)}
      disabled
    >
      {SWATCHES.map((swatch) => (
        <SwatchItem key={swatch.id} swatch={swatch} />
      ))}
      {args.actions && <DecideActions />}
    </SwipeDeck>
  ),
};

const LAYOUTS: SwipeDeckLayout[] = ["stack", "fan", "cascade", "pile"];

/** The four layouts side by side, each cycling. */
export const Layouts: Story = {
  // Each deck sets its own layout, so the controls would do nothing here.
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid grid-cols-2 gap-x-24 gap-y-28 p-16">
      {LAYOUTS.map((layout) => (
        <div key={layout} className="flex flex-col items-center gap-4">
          <CycleDemo look={{ layout }} />
          <p className="text-muted text-sm">{layout}</p>
        </div>
      ))}
    </div>
  ),
};

/** In right-to-left text, `fan` and `cascade` open to the left. */
export const RightToLeft: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div dir="rtl" className="grid grid-cols-2 gap-x-24 gap-y-16 p-16">
      {(["fan", "cascade"] as const).map((layout) => (
        <div key={layout} className="flex flex-col items-center gap-4">
          <CycleDemo look={{ layout }} />
          <p className="text-muted text-sm">{layout}</p>
        </div>
      ))}
    </div>
  ),
};
