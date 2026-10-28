import * as React from "react";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  SwipeDeck,
  SwipeDeckAction,
  SwipeDeckEmpty,
  SwipeDeckItem,
  type SwipeDeckProps,
  type SwipeDeckSwipeDetails,
} from "./swipe-deck";

const CARDS = ["a", "b", "c"];

type DeckProps = Omit<SwipeDeckProps, "children"> & {
  cards?: string[];
  /** What the list does once a card has gone: drop it (the default) or keep it. */
  answer?: "remove" | "keep";
};

// Removes each swiped card from the list once it has gone, as an app that
// decides would.
function Deck({
  cards: initial = CARDS,
  answer = "remove",
  ...props
}: DeckProps) {
  const [cards, setCards] = React.useState(initial);
  return (
    <SwipeDeck
      aria-label="Cards"
      {...props}
      onSwipeComplete={(details) => {
        if (answer === "remove") {
          setCards((previous) => previous.filter((v) => v !== details.value));
        }
        return props.onSwipeComplete?.(details);
      }}
    >
      {cards.map((card) => (
        <SwipeDeckItem key={card} value={card} aria-label={`Card ${card}`}>
          {card}
          <button type="button">Open {card}</button>
        </SwipeDeckItem>
      ))}
      <SwipeDeckAction direction="left">Pass</SwipeDeckAction>
      <SwipeDeckAction direction="right">Like</SwipeDeckAction>
    </SwipeDeck>
  );
}

// Moves each swiped card to the back as it's sent off.
function CycleDeck({
  cards: initial = CARDS,
  ...props
}: Omit<SwipeDeckProps, "children"> & { cards?: string[] }) {
  const [cards, setCards] = React.useState(initial);
  return (
    <SwipeDeck
      aria-label="Cards"
      {...props}
      onSwipe={(details, eventDetails) => {
        setCards((previous) => [
          ...previous.filter((v) => v !== details.value),
          details.value,
        ]);
        props.onSwipe?.(details, eventDetails);
      }}
    >
      {cards.map((card) => (
        <SwipeDeckItem key={card} value={card} aria-label={`Card ${card}`}>
          {card}
        </SwipeDeckItem>
      ))}
    </SwipeDeck>
  );
}

// The flight is a real spring in jsdom, so give it time to land.
const FLIGHT = { timeout: 2000 };

const card = (name: string) =>
  screen.getByRole("group", { name: `Card ${name}` });
const deckOf = () => screen.getByRole("group", { name: "Cards" });

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function pointer(type: string, clientX: number, clientY = 0) {
  return new PointerEvent(type, {
    pointerId: 1,
    button: 0,
    // Held down until let go.
    buttons: type === "pointerup" ? 0 : 1,
    clientX,
    clientY,
    bubbles: true,
  });
}

/**
 * Drags a card from (0, 0) along `path`, then lets go. With `pause`, it is
 * held still first, so it leaves without a throw.
 */
async function drag(
  element: HTMLElement,
  path: [number, number][],
  { pause = 150 }: { pause?: number } = {},
) {
  fireEvent(element, pointer("pointerdown", 0));
  for (const [x, y] of path) {
    window.dispatchEvent(pointer("pointermove", x, y));
    // oxlint-disable-next-line no-await-in-loop -- one move after another, as a pointer makes them
    await wait(20);
  }
  await wait(pause);
  const [x, y] = path.at(-1)!;
  window.dispatchEvent(pointer("pointerup", x, y));
}

describe("SwipeDeck", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("fans the cards by default and takes another layout", () => {
    const { rerender } = render(<Deck />);
    expect(deckOf()).toHaveAttribute("data-layout", "fan");
    rerender(<Deck layout="stack" />);
    expect(deckOf()).toHaveAttribute("data-layout", "stack");
  });

  it("keeps spread, depth and visible within range", () => {
    render(<Deck spread={5} depth={-1} visible={0} />);
    const deck = deckOf();
    expect(deck.style.getPropertyValue("--swipe-deck-spread")).toBe("2");
    expect(deck.style.getPropertyValue("--swipe-deck-depth")).toBe("0");
    expect(deck.style.getPropertyValue("--swipe-deck-visible")).toBe("1");
  });

  it("leaves only the front card reachable", () => {
    render(<Deck />);
    expect(card("a")).not.toHaveAttribute("inert");
    const [, b, c] = document.querySelectorAll("[data-slot=swipe-deck-item]");
    expect(b).toHaveAttribute("inert");
    expect(c).toHaveAttribute("inert");
  });

  it("calls onSwipe at once and onSwipeComplete once the card has gone", async () => {
    const onSwipe = vi.fn();
    const onSwipeComplete = vi.fn();
    render(<Deck onSwipe={onSwipe} onSwipeComplete={onSwipeComplete} />);
    deckOf().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onSwipe).toHaveBeenCalledWith(
      { value: "a", direction: "right" },
      expect.objectContaining({ reason: "keyboard", isCanceled: false }),
    );
    expect(onSwipeComplete).not.toHaveBeenCalled();
    expect(card("b")).toHaveAttribute("data-front");
    await waitFor(
      () =>
        expect(onSwipeComplete).toHaveBeenCalledWith({
          value: "a",
          direction: "right",
        }),
      FLIGHT,
    );
  });

  it("ignores directions the deck doesn't allow", async () => {
    const onSwipe = vi.fn();
    render(<Deck onSwipe={onSwipe} />);
    deckOf().focus();
    await userEvent.keyboard("{ArrowUp}");
    expect(card("a")).toHaveAttribute("data-front");
    expect(card("a")).not.toHaveAttribute("data-leaving");
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it("swipes the front card from an action", async () => {
    const onSwipe = vi.fn();
    render(<Deck onSwipe={onSwipe} />);
    await userEvent.click(screen.getByRole("button", { name: "Pass" }));
    expect(onSwipe).toHaveBeenCalledWith(
      { value: "a", direction: "left" },
      expect.objectContaining({ reason: "action-press" }),
    );
  });

  it("sends the next card when pressed again before the deck re-renders", async () => {
    const onSwipe = vi.fn();
    render(<Deck onSwipe={onSwipe} />);
    const like = screen.getByRole("button", { name: "Like" });
    act(() => {
      fireEvent.click(like);
      fireEvent.click(like);
    });
    expect(onSwipe.mock.calls.map(([details]) => details.value)).toEqual([
      "a",
      "b",
    ]);
  });

  it("swipes nothing when disabled", async () => {
    const onSwipe = vi.fn();
    render(<Deck onSwipe={onSwipe} disabled />);
    const like = screen.getByRole("button", { name: "Like" });
    expect(like).toHaveAttribute("aria-disabled", "true");
    const deck = deckOf();
    deck.focus();
    expect(deck).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.click(like);
    expect(card("a")).not.toHaveAttribute("data-leaving");
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it("leaves modified arrows to the browser", async () => {
    render(<Deck />);
    deckOf().focus();
    await userEvent.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(card("a")).not.toHaveAttribute("data-leaving");
  });

  describe("cancelling", () => {
    it("keeps a card a key sent off", async () => {
      const onSwipeComplete = vi.fn();
      render(
        <Deck
          onSwipe={(_, eventDetails) => eventDetails.cancel()}
          onSwipeComplete={onSwipeComplete}
        />,
      );
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(card("a")).toHaveAttribute("data-front");
      expect(card("a")).not.toHaveAttribute("data-leaving");
      await wait(100);
      expect(onSwipeComplete).not.toHaveBeenCalled();
    });

    it("springs a dragged card back", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(
        200,
      );
      const onSwipe = vi.fn((_, eventDetails) => eventDetails.cancel());
      render(<Deck onSwipe={onSwipe} />);
      await drag(card("a"), [
        [40, 0],
        [120, 0],
      ]);
      expect(onSwipe).toHaveBeenCalledWith(
        { value: "a", direction: "right" },
        expect.objectContaining({ reason: "swipe", isCanceled: true }),
      );
      expect(card("a")).not.toHaveAttribute("data-leaving");
      await waitFor(
        () =>
          expect(
            card("a").style.getPropertyValue("--swipe-deck-movement-x"),
          ).toBe("0px"),
        FLIGHT,
      );
    });
  });

  describe("dragging", () => {
    it("springs a short drag back", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(
        200,
      );
      const onSwipe = vi.fn();
      render(<Deck onSwipe={onSwipe} />);
      // 30px of a 200px card: short of the quarter that sends it off.
      await drag(card("a"), [
        [10, 0],
        [30, 0],
      ]);
      expect(onSwipe).not.toHaveBeenCalled();
      expect(card("a")).toHaveAttribute("data-front");
      await waitFor(
        () =>
          expect(
            card("a").style.getPropertyValue("--swipe-deck-movement-x"),
          ).toBe("0px"),
        FLIGHT,
      );
    });

    it("sends off a card dragged past a quarter of its width", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(
        200,
      );
      const onSwipe = vi.fn();
      render(<Deck onSwipe={onSwipe} />);
      await drag(card("a"), [
        [-30, 0],
        [-80, 0],
      ]);
      expect(onSwipe).toHaveBeenCalledWith(
        { value: "a", direction: "left" },
        expect.objectContaining({ reason: "swipe" }),
      );
      expect(card("a")).toHaveAttribute("data-leaving");
      await waitFor(() => expect(screen.queryByText("a")).toBeNull(), FLIGHT);
    });

    it("sends off a short drag thrown hard", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(
        200,
      );
      const onSwipe = vi.fn();
      render(<Deck onSwipe={onSwipe} />);
      // 30px, but let go moving fast: the throw carries it past the line.
      await drag(
        card("a"),
        [
          [10, 0],
          [30, 0],
        ],
        { pause: 0 },
      );
      expect(onSwipe).toHaveBeenCalledWith(
        { value: "a", direction: "right" },
        expect.anything(),
      );
    });

    it("resists a drag toward a side the card can't leave by", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(
        200,
      );
      render(<Deck />);
      fireEvent(card("a"), pointer("pointerdown", 0));
      window.dispatchEvent(pointer("pointermove", 0, 150));
      const moved = Number.parseFloat(
        card("a").style.getPropertyValue("--swipe-deck-movement-y"),
      );
      expect(moved).toBeGreaterThan(0);
      expect(moved).toBeLessThan(150);
      window.dispatchEvent(pointer("pointerup", 0, 150));
    });

    it("keeps the click a drag ends with from reaching the card", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(
        200,
      );
      const onClick = vi.fn();
      render(
        <SwipeDeck aria-label="Cards">
          <SwipeDeckItem value="a" aria-label="Card a">
            <button type="button" onClick={onClick}>
              Open
            </button>
          </SwipeDeckItem>
        </SwipeDeck>,
      );
      const button = screen.getByRole("button", { name: "Open" });
      fireEvent(button, pointer("pointerdown", 0));
      window.dispatchEvent(pointer("pointermove", 20));
      window.dispatchEvent(pointer("pointerup", 20));
      fireEvent.click(button);
      expect(onClick).not.toHaveBeenCalled();
      await wait(10);
      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe("your list's answer", () => {
    it("brings back a card the list keeps", async () => {
      const onSwipeComplete = vi.fn();
      render(<Deck answer="keep" onSwipeComplete={onSwipeComplete} />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(card("b")).toHaveAttribute("data-front");
      await waitFor(() => expect(onSwipeComplete).toHaveBeenCalled(), FLIGHT);
      await waitFor(() => expect(card("a")).toHaveAttribute("data-front"));
      expect(card("a")).not.toHaveAttribute("data-leaving");
    });

    it("keeps a card out until a returned promise settles", async () => {
      function SavingDeck() {
        const [cards, setCards] = React.useState(CARDS);
        return (
          <SwipeDeck
            aria-label="Cards"
            onSwipeComplete={async ({ value }) => {
              await wait(300);
              setCards((previous) => previous.filter((v) => v !== value));
            }}
          >
            {cards.map((name) => (
              <SwipeDeckItem
                key={name}
                value={name}
                aria-label={`Card ${name}`}
              >
                {name}
              </SwipeDeckItem>
            ))}
          </SwipeDeck>
        );
      }
      render(<SavingDeck />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      const a = card("a");
      await waitFor(
        () => expect(a).toHaveAttribute("data-ending-style"),
        FLIGHT,
      );
      await wait(150);
      // Saving: still out, and b stays in front.
      expect(a).toHaveAttribute("data-leaving");
      expect(card("b")).toHaveAttribute("data-front");
      await waitFor(() => expect(a).not.toBeInTheDocument(), FLIGHT);
    });

    it("slides a card moved to the back in onSwipe under the pile", async () => {
      render(<CycleDeck />);
      const a = card("a");
      const seen = new Set<string>();
      const observer = new MutationObserver((records) => {
        for (const record of records) {
          if (a.hasAttribute(record.attributeName!)) {
            seen.add(record.attributeName!);
          }
        }
      });
      observer.observe(a, { attributes: true });
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(
        () => expect(a).not.toHaveAttribute("data-leaving"),
        FLIGHT,
      );
      observer.disconnect();
      // Under the pile from where it flew to: no fade out and back in.
      expect(seen.has("data-ending-style")).toBe(false);
      expect(a.style.getPropertyValue("--swipe-deck-index")).toBe("2");
      expect(card("b")).toHaveAttribute("data-front");
    });

    it("fades a card moved to the back in onSwipeComplete back in there", async () => {
      function LateCycleDeck() {
        const [cards, setCards] = React.useState(CARDS);
        return (
          <SwipeDeck
            aria-label="Cards"
            onSwipeComplete={({ value }) =>
              setCards((previous) => [
                ...previous.filter((v) => v !== value),
                value,
              ])
            }
          >
            {cards.map((name) => (
              <SwipeDeckItem
                key={name}
                value={name}
                aria-label={`Card ${name}`}
              >
                {name}
              </SwipeDeckItem>
            ))}
          </SwipeDeck>
        );
      }
      render(<LateCycleDeck />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      const a = card("a");
      await waitFor(
        () => expect(a).not.toHaveAttribute("data-leaving"),
        FLIGHT,
      );
      expect(a.style.getPropertyValue("--swipe-deck-index")).toBe("2");
      // In again from the fade recipe's starting style, then resting.
      await waitFor(() => expect(a).not.toHaveAttribute("data-starting-style"));
      expect(a).not.toHaveAttribute("data-ending-style");
    });

    it("brings back the only card of a cycling deck", async () => {
      render(<CycleDeck cards={["a"]} />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(card("a")).toHaveAttribute("data-leaving");
      await waitFor(
        () => expect(card("a")).toHaveAttribute("data-front"),
        FLIGHT,
      );
    });
  });

  it("hands focus to the deck when a card leaves with focus inside", async () => {
    render(<Deck />);
    screen.getByRole("button", { name: "Open a" }).focus();
    // `fireEvent` doesn't move focus, as a click on the action would.
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Like" }));
    });
    expect(deckOf()).toHaveFocus();
  });

  it("announces the next card after a swipe", async () => {
    render(<Deck />);
    deckOf().focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("status")).toHaveTextContent("Card b");
  });

  it("warns in development when two cards share a value", () => {
    vi.stubEnv("NODE_ENV", "development");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <SwipeDeck aria-label="Cards">
        <SwipeDeckItem key="1" value="a" />
        <SwipeDeckItem key="2" value="a" />
      </SwipeDeck>,
    );
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('"a"'));
  });

  describe("on the server", () => {
    it("draws the front card visible and hides the rest", () => {
      const container = document.createElement("div");
      container.innerHTML = renderToString(<Deck />);
      const [a, b, c] = container.querySelectorAll(
        "[data-slot=swipe-deck-item]",
      );
      expect(a).not.toHaveAttribute("data-starting-style");
      expect(b).not.toHaveAttribute("data-starting-style");
      expect(a!.className).toContain("~*)]:invisible");
      expect(a!.className).toContain("~*)]:opacity-0");
      // The class hides a card only after another card, which `a` isn't.
      expect(a!.matches("[data-slot=swipe-deck-item] ~ *")).toBe(false);
      expect(b!.matches("[data-slot=swipe-deck-item] ~ *")).toBe(true);
      expect(c!.matches("[data-slot=swipe-deck-item] ~ *")).toBe(true);
    });

    it("brings the cards behind in once hydrated, not the front one", async () => {
      const container = document.createElement("div");
      container.innerHTML = renderToString(<Deck />);
      document.body.append(container);
      const error = vi.spyOn(console, "error");
      await act(async () => {
        hydrateRoot(container, <Deck />);
      });
      expect(error).not.toHaveBeenCalled();
      const [a, b] = container.querySelectorAll("[data-slot=swipe-deck-item]");
      expect(a).not.toHaveAttribute("data-starting-style");
      expect(b).toHaveAttribute("data-starting-style");
      await waitFor(() => expect(b).not.toHaveAttribute("data-starting-style"));
      container.remove();
    });
  });

  describe("SwipeDeckEmpty", () => {
    function EmptyDeck() {
      const [cards, setCards] = React.useState(["a"]);
      return (
        <SwipeDeck
          aria-label="Cards"
          onSwipeComplete={({ value }) =>
            setCards((previous) => previous.filter((v) => v !== value))
          }
        >
          {cards.map((name) => (
            <SwipeDeckItem key={name} value={name} aria-label={`Card ${name}`}>
              {name}
            </SwipeDeckItem>
          ))}
          <SwipeDeckEmpty>
            All done
            <button type="button" onClick={() => setCards(["a"])}>
              Again
            </button>
          </SwipeDeckEmpty>
        </SwipeDeck>
      );
    }

    it("lies under the last card, and is usable and announced once it goes", async () => {
      render(<EmptyDeck />);
      const deck = deckOf();
      const empty = deck.querySelector("[data-slot=swipe-deck-empty]")!;
      // One card left: drawn under it once it has come to rest, out of reach.
      expect(empty).toHaveClass("invisible");
      await waitFor(() => expect(empty).not.toHaveClass("invisible"));
      expect(empty).toHaveAttribute("inert");
      deck.focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(card("a")).toHaveAttribute("data-leaving");
      expect(empty).not.toHaveAttribute("inert");
      expect(deck).toHaveAttribute("data-empty");
      expect(screen.getByRole("status")).toHaveTextContent("All done");
    });

    it("is not drawn while two or more cards are left", () => {
      const { container } = render(
        <SwipeDeck aria-label="Three">
          {CARDS.map((name) => (
            <SwipeDeckItem key={name} value={name}>
              {name}
            </SwipeDeckItem>
          ))}
          <SwipeDeckEmpty>All done</SwipeDeckEmpty>
        </SwipeDeck>,
      );
      expect(
        container.querySelector("[data-slot=swipe-deck-empty]"),
      ).toHaveClass("invisible");
    });

    it("hands focus to the deck when the deck refills", async () => {
      render(<EmptyDeck />);
      const deck = deckOf();
      deck.focus();
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(
        () => expect(screen.queryByText("a")).not.toBeInTheDocument(),
        FLIGHT,
      );
      await userEvent.click(screen.getByRole("button", { name: "Again" }));
      expect(deck).toHaveFocus();
      expect(
        deck.querySelector("[data-slot=swipe-deck-empty]"),
      ).toHaveAttribute("inert");
    });
  });

  describe("after the review", () => {
    it("cancels a press whose release never comes", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(
        200,
      );
      const onSwipe = vi.fn();
      render(<Deck onSwipe={onSwipe} />);
      fireEvent(card("a"), pointer("pointerdown", 0));
      window.dispatchEvent(pointer("pointermove", 120));
      // A system menu took the release: the next move has no button down.
      window.dispatchEvent(
        new PointerEvent("pointermove", { pointerId: 1, clientX: 140 }),
      );
      window.dispatchEvent(pointer("pointerup", 300));
      expect(onSwipe).not.toHaveBeenCalled();
      expect(card("a")).not.toHaveAttribute("data-swiping");
      await waitFor(
        () =>
          expect(
            card("a").style.getPropertyValue("--swipe-deck-movement-x"),
          ).toBe("0px"),
        FLIGHT,
      );
    });

    it("sends a card the way an action says, wherever it was dragged", async () => {
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(
        200,
      );
      render(<Deck />);
      const a = card("a");
      const xs: number[] = [];
      const observer = new MutationObserver(() =>
        xs.push(
          Number.parseFloat(
            a.style.getPropertyValue("--swipe-deck-movement-x"),
          ),
        ),
      );
      observer.observe(a, { attributeFilter: ["style"] });
      fireEvent(a, pointer("pointerdown", 0));
      window.dispatchEvent(pointer("pointermove", 40));
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Pass" }));
      });
      await waitFor(() => expect(Math.min(...xs)).toBeLessThan(0), FLIGHT);
      observer.disconnect();
    });

    it("sends one card per press, not one per key repeat", () => {
      const onSwipe = vi.fn();
      render(<Deck onSwipe={onSwipe} />);
      const deck = deckOf();
      deck.focus();
      fireEvent.keyDown(deck, { key: "ArrowRight" });
      fireEvent.keyDown(deck, { key: "ArrowRight", repeat: true });
      fireEvent.keyDown(deck, { key: "ArrowRight", repeat: true });
      expect(onSwipe).toHaveBeenCalledOnce();
    });

    it("keeps an action's cancel too", async () => {
      const onSwipe = vi.fn((_, eventDetails) => eventDetails.cancel());
      render(<Deck onSwipe={onSwipe} />);
      await userEvent.click(screen.getByRole("button", { name: "Like" }));
      expect(onSwipe).toHaveBeenCalledWith(
        { value: "a", direction: "right" },
        expect.objectContaining({ reason: "action-press", isCanceled: true }),
      );
      expect(card("a")).toHaveAttribute("data-front");
    });

    it("keeps focus in the deck when a focused card moves to the back", () => {
      function FocusDeck() {
        const [cards, setCards] = React.useState(CARDS);
        return (
          <SwipeDeck
            aria-label="Cards"
            onSwipe={({ value }) =>
              setCards((previous) => [
                ...previous.filter((v) => v !== value),
                value,
              ])
            }
          >
            {cards.map((name) => (
              <SwipeDeckItem
                key={name}
                value={name}
                aria-label={`Card ${name}`}
              >
                <button type="button">Open {name}</button>
              </SwipeDeckItem>
            ))}
            <SwipeDeckAction direction="left">Again</SwipeDeckAction>
          </SwipeDeck>
        );
      }
      render(<FocusDeck />);
      screen.getByRole("button", { name: "Open a" }).focus();
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Again" }));
      });
      expect(deckOf()).toHaveFocus();
    });

    it("reports a card sliding back under the pile to onSwipeComplete", async () => {
      const onSwipeComplete = vi.fn();
      function CompleteCycleDeck() {
        const [cards, setCards] = React.useState(CARDS);
        return (
          <SwipeDeck
            aria-label="Cards"
            onSwipe={({ value }) =>
              setCards((previous) => [
                ...previous.filter((v) => v !== value),
                value,
              ])
            }
            onSwipeComplete={onSwipeComplete}
          >
            {cards.map((name) => (
              <SwipeDeckItem
                key={name}
                value={name}
                aria-label={`Card ${name}`}
              >
                {name}
              </SwipeDeckItem>
            ))}
          </SwipeDeck>
        );
      }
      render(<CompleteCycleDeck />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(
        () =>
          expect(onSwipeComplete).toHaveBeenCalledWith({
            value: "a",
            direction: "right",
          }),
        FLIGHT,
      );
    });

    it("never lets a late answer to one swipe end the card's next", async () => {
      const onSwipeComplete = vi.fn<
        (details: SwipeDeckSwipeDetails) => Promise<unknown>
      >(() => wait(500));
      render(
        <CycleDeck cards={["a", "b"]} onSwipeComplete={onSwipeComplete} />,
      );
      deckOf().focus();
      // a slides under b, and its answer starts; then b slides under a.
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(
        () => expect(card("a")).not.toHaveAttribute("data-leaving"),
        FLIGHT,
      );
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(
        () => expect(card("b")).not.toHaveAttribute("data-leaving"),
        FLIGHT,
      );
      expect(card("a")).toHaveAttribute("data-front");
      // Sent off again while the first answer still runs.
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(
        () =>
          expect(
            onSwipeComplete.mock.calls.filter(
              ([details]) => details.value === "a",
            ),
          ).toHaveLength(2),
        { timeout: 3000 },
      );
    });

    it("finishes a swipe React hid the deck in the middle of", async () => {
      const onSwipeComplete = vi.fn();
      function HiddenDeck({ mode }: { mode: "visible" | "hidden" }) {
        return (
          <React.Activity mode={mode}>
            <Deck onSwipeComplete={onSwipeComplete} />
          </React.Activity>
        );
      }
      const { rerender } = render(<HiddenDeck mode="visible" />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      await wait(50);
      rerender(<HiddenDeck mode="hidden" />);
      await wait(50);
      rerender(<HiddenDeck mode="visible" />);
      await waitFor(() => expect(onSwipeComplete).toHaveBeenCalled(), FLIGHT);
      await waitFor(() => expect(screen.queryByText("a")).toBeNull(), FLIGHT);
    });

    it("keeps the card sent off first above the next one", () => {
      render(<Deck />);
      const like = screen.getByRole("button", { name: "Like" });
      act(() => {
        fireEvent.click(like);
        fireEvent.click(like);
      });
      expect(Number(card("a").style.zIndex)).toBeGreaterThan(
        Number(card("b").style.zIndex),
      );
    });

    it("brings a card put back at the start in on top", async () => {
      function UndoDeck() {
        const [cards, setCards] = React.useState(CARDS);
        return (
          <>
            <SwipeDeck
              aria-label="Cards"
              onSwipeComplete={({ value }) =>
                setCards((previous) => previous.filter((v) => v !== value))
              }
            >
              {cards.map((name) => (
                <SwipeDeckItem
                  key={name}
                  value={name}
                  aria-label={`Card ${name}`}
                >
                  {name}
                </SwipeDeckItem>
              ))}
            </SwipeDeck>
            <button type="button" onClick={() => setCards((p) => ["a", ...p])}>
              Undo
            </button>
          </>
        );
      }
      render(<UndoDeck />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(() => expect(screen.queryByText("a")).toBeNull(), FLIGHT);
      await userEvent.click(screen.getByRole("button", { name: "Undo" }));
      expect(card("a")).toHaveAttribute("data-front");
      expect(card("a")).toHaveAttribute("data-starting-style");
      await waitFor(() =>
        expect(card("a")).not.toHaveAttribute("data-starting-style"),
      );
      expect(card("b").style.getPropertyValue("--swipe-deck-index")).toBe("1");
    });

    it("lifts a pressed card and lays it back down", async () => {
      render(<Deck />);
      fireEvent(card("a"), pointer("pointerdown", 0));
      await waitFor(() =>
        expect(card("a").style.getPropertyValue("--swipe-deck-pose")).toContain(
          "scale(1.0",
        ),
      );
      window.dispatchEvent(pointer("pointerup", 0));
      await waitFor(
        () =>
          expect(card("a").style.getPropertyValue("--swipe-deck-pose")).toBe(
            "none",
          ),
        FLIGHT,
      );
    });

    it("announces the front card again once the deck is refilled", async () => {
      function RefillDeck() {
        const [cards, setCards] = React.useState(["a"]);
        return (
          <SwipeDeck
            aria-label="Cards"
            onSwipeComplete={({ value }) =>
              setCards((previous) => previous.filter((v) => v !== value))
            }
          >
            {cards.map((name) => (
              <SwipeDeckItem
                key={name}
                value={name}
                aria-label={`Card ${name}`}
              >
                {name}
              </SwipeDeckItem>
            ))}
            <SwipeDeckEmpty>
              <button type="button" onClick={() => setCards(["b"])}>
                Again
              </button>
            </SwipeDeckEmpty>
          </SwipeDeck>
        );
      }
      render(<RefillDeck />);
      deckOf().focus();
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(() => expect(screen.queryByText("a")).toBeNull(), FLIGHT);
      await userEvent.click(screen.getByRole("button", { name: "Again" }));
      expect(screen.getByRole("status")).toHaveTextContent("Card b");
    });
  });

  it("disables the actions once the deck is empty", async () => {
    render(<Deck />);
    const like = screen.getByRole("button", { name: "Like" });
    await userEvent.click(like);
    await userEvent.click(like);
    await userEvent.click(like);
    await waitFor(
      () => expect(like).toHaveAttribute("aria-disabled", "true"),
      FLIGHT,
    );
    // Still focusable, so focus isn't dropped when the last card leaves.
    expect(like).not.toHaveAttribute("disabled");
  });
});
