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
  type SwipeDeckLayout,
  type SwipeDeckProps,
  type SwipeDirection,
} from "./swipe-deck";

const meta = {
  title: "Data Display/SwipeDeck",
  component: SwipeDeck,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A pile of cards people swipe away, whatever the cards hold: photos, art, products, anything. Drag or flick the front card, focus the deck and press an arrow key, or use the buttons. Your list stays the source of truth: `onSwipe` says which card left and which way, and you remove it or move it to the end. Needs the `motion` package.",
      },
    },
  },
  args: { layout: "stack", spread: 0.5, depth: 0.5, visible: 4 },
  argTypes: {
    layout: {
      control: "inline-radio",
      options: ["stack", "fan", "cascade", "pile"],
    },
    spread: { control: { type: "range", min: 0, max: 2, step: 0.05 } },
    depth: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
    visible: { control: { type: "range", min: 1, max: 10, step: 1 } },
  },
} satisfies Meta<typeof SwipeDeck>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The deck's look, from the story's controls. */
type Look = Pick<SwipeDeckProps, "layout" | "spread" | "depth" | "visible">;

function lookOf({ layout, spread, depth, visible }: Look): Look {
  return { layout, spread, depth, visible };
}

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

const LEFT_RIGHT: SwipeDirection[] = ["left", "right"];
const ALL_DIRECTIONS: SwipeDirection[] = ["left", "right", "up", "down"];

const CHEVRONS: Record<
  SwipeDirection,
  (props: React.SVGProps<SVGSVGElement>) => React.ReactNode
> = {
  left: ChevronLeftIcon,
  right: ChevronRightIcon,
  up: ChevronUpIcon,
  down: ChevronDownIcon,
};

function SwatchItem({ swatch }: { swatch: Swatch }) {
  return (
    <SwipeDeckItem
      value={swatch.id}
      aria-label={swatch.label}
      // One shadow, on the card on top: stacked cards would stack shadows.
      className={cn(
        "aspect-square data-front:shadow-md data-leaving:shadow-md",
        swatch.color,
      )}
    />
  );
}

/** Pass to the left, like to the right. Equal weight, so neither nudges the choice. */
function DecideActions() {
  return (
    <div className="flex justify-center gap-2">
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

function Actions({ directions }: { directions: readonly SwipeDirection[] }) {
  return (
    <div className="flex justify-center gap-2">
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

/** Moves a swiped card to the end of the list, so the deck never runs out. */
function toBack(swatches: Swatch[], value: string) {
  return [
    ...swatches.filter((s) => s.id !== value),
    ...swatches.filter((s) => s.id === value),
  ];
}

function DiscardDemo(look: Look) {
  const [swatches, setSwatches] = React.useState(SWATCHES);
  const [passed, setPassed] = React.useState(0);
  const [liked, setLiked] = React.useState(0);

  return (
    <div className="flex w-72 flex-col gap-4">
      <SwipeDeck
        aria-label="Colours"
        className="gap-4"
        {...look}
        onSwipe={({ value, direction }) => {
          setSwatches((previous) => previous.filter((s) => s.id !== value));
          if (direction === "right") setLiked((count) => count + 1);
          else setPassed((count) => count + 1);
        }}
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
              setSwatches(SWATCHES);
              setPassed(0);
              setLiked(0);
            }}
          >
            Start over
          </Button>
        </SwipeDeckEmpty>
        <DecideActions />
      </SwipeDeck>
      <p className="text-muted text-center text-sm">
        {passed} passed · {liked} liked
      </p>
    </div>
  );
}

/** Pass or like: each card leaves for good, and the list drops it in `onSwipe`. */
export const Default: Story = {
  render: (args) => <DiscardDemo {...lookOf(args)} />,
};

function EmptyMessageDemo(look: Look) {
  const [swatches, setSwatches] = React.useState(SWATCHES.slice(0, 3));

  return (
    <SwipeDeck
      aria-label="Colours"
      className="w-72 gap-4"
      {...look}
      onSwipe={({ value }) =>
        setSwatches((previous) => previous.filter((s) => s.id !== value))
      }
    >
      {swatches.map((swatch) => (
        <SwatchItem key={swatch.id} swatch={swatch} />
      ))}
      <SwipeDeckEmpty>All colours sorted</SwipeDeckEmpty>
      <DecideActions />
    </SwipeDeck>
  );
}

/** `SwipeDeckEmpty` holds whatever ends your deck: here, just a message. */
export const EmptyMessage: Story = {
  render: (args) => <EmptyMessageDemo {...lookOf(args)} />,
};

function CycleDemo(look: Look) {
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
      <Actions directions={LEFT_RIGHT} />
    </SwipeDeck>
  );
}

/** A swiped card moves to the end of the list, so the deck never runs out. */
export const Cycle: Story = {
  render: (args) => <CycleDemo {...lookOf(args)} />,
};

function AllDirectionsDemo(look: Look) {
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
      <Actions directions={ALL_DIRECTIONS} />
    </SwipeDeck>
  );
}

/** `directions` sets the ways a card can leave; here all four. */
export const AllDirections: Story = {
  render: (args) => <AllDirectionsDemo {...lookOf(args)} />,
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
      <DecideActions />
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
          <CycleDemo layout={layout} />
          <p className="text-muted text-sm">{layout}</p>
        </div>
      ))}
    </div>
  ),
};
