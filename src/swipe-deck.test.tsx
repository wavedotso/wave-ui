import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  SwipeDeck,
  SwipeDeckAction,
  SwipeDeckEmpty,
  SwipeDeckItem,
  type SwipeDeckProps,
} from "./swipe-deck";

const CARDS = ["a", "b", "c"];

// Removes each swiped card from the list, as an app that decides would.
function Deck(props: Omit<SwipeDeckProps, "children">) {
  const [cards, setCards] = React.useState(CARDS);
  return (
    <SwipeDeck
      aria-label="Cards"
      {...props}
      onSwipe={(details) => {
        setCards((previous) => previous.filter((v) => v !== details.value));
        props.onSwipe?.(details);
      }}
    >
      {cards.map((card) => (
        <SwipeDeckItem key={card} value={card} aria-label={`Card ${card}`}>
          {card}
        </SwipeDeckItem>
      ))}
      <SwipeDeckAction direction="left">Pass</SwipeDeckAction>
      <SwipeDeckAction direction="right">Like</SwipeDeckAction>
    </SwipeDeck>
  );
}

// The flight is a real spring in jsdom, so give it time to land.
const FLIGHT = { timeout: 2000 };

describe("SwipeDeck", () => {
  it("stacks the cards by default and takes another layout", () => {
    const { rerender } = render(<Deck />);
    const deck = screen.getByRole("group", { name: "Cards" });
    expect(deck).toHaveAttribute("data-layout", "stack");
    rerender(<Deck layout="fan" />);
    expect(deck).toHaveAttribute("data-layout", "fan");
  });

  it("keeps spread, depth and visible within range", () => {
    render(<Deck spread={5} depth={-1} visible={0} />);
    const deck = screen.getByRole("group", { name: "Cards" });
    expect(deck.style.getPropertyValue("--swipe-deck-spread")).toBe("2");
    expect(deck.style.getPropertyValue("--swipe-deck-depth")).toBe("0");
    expect(deck.style.getPropertyValue("--swipe-deck-visible")).toBe("1");
  });

  it("leaves only the front card reachable", () => {
    render(<Deck />);
    expect(screen.getByRole("group", { name: "Card a" })).not.toHaveAttribute(
      "inert",
    );
    const [, b, c] = document.querySelectorAll("[data-slot=swipe-deck-item]");
    expect(b).toHaveAttribute("inert");
    expect(c).toHaveAttribute("inert");
  });

  it("swipes the front card with the arrow keys", async () => {
    const onSwipe = vi.fn();
    render(<Deck onSwipe={onSwipe} />);
    screen.getByRole("group", { name: "Cards" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(
      () =>
        expect(onSwipe).toHaveBeenCalledWith({
          value: "a",
          direction: "right",
        }),
      FLIGHT,
    );
    expect(screen.getByRole("group", { name: "Card b" })).toHaveAttribute(
      "data-front",
    );
  });

  it("ignores directions the deck doesn't allow", async () => {
    render(<Deck />);
    screen.getByRole("group", { name: "Cards" }).focus();
    await userEvent.keyboard("{ArrowUp}");
    const a = screen.getByRole("group", { name: "Card a" });
    expect(a).toHaveAttribute("data-front");
    expect(a).not.toHaveAttribute("data-ending-style");
  });

  it("swipes the front card from an action", async () => {
    const onSwipe = vi.fn();
    render(<Deck onSwipe={onSwipe} />);
    await userEvent.click(screen.getByRole("button", { name: "Pass" }));
    await waitFor(
      () =>
        expect(onSwipe).toHaveBeenCalledWith({ value: "a", direction: "left" }),
      FLIGHT,
    );
  });

  it("lets the next card be swiped while the last one is still leaving", async () => {
    const onSwipe = vi.fn();
    render(<Deck onSwipe={onSwipe} />);
    const like = screen.getByRole("button", { name: "Like" });
    await userEvent.click(like);
    await userEvent.click(like);
    await waitFor(() => expect(onSwipe).toHaveBeenCalledTimes(2), FLIGHT);
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
    const deck = screen.getByRole("group", { name: "Cards" });
    deck.focus();
    expect(deck).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.click(like);
    expect(screen.getByRole("group", { name: "Card a" })).not.toHaveAttribute(
      "data-ending-style",
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(onSwipe).not.toHaveBeenCalled();
  });

  it("leaves modified arrows to the browser", async () => {
    render(<Deck />);
    screen.getByRole("group", { name: "Cards" }).focus();
    await userEvent.keyboard("{Alt>}{ArrowRight}{/Alt}");
    expect(screen.getByRole("group", { name: "Card a" })).not.toHaveAttribute(
      "data-ending-style",
    );
  });

  it("keeps a swiped card out until the list answers, however late", async () => {
    function LateDeck() {
      const [cards, setCards] = React.useState(CARDS);
      return (
        <SwipeDeck
          aria-label="Cards"
          onSwipe={({ value }) => {
            // An app that saves first and removes the card after.
            setTimeout(
              () => setCards((previous) => previous.filter((v) => v !== value)),
              200,
            );
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
    render(<LateDeck />);
    screen.getByRole("group", { name: "Cards" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    const a = screen.getByRole("group", { name: "Card a" });
    // Reported, not yet answered: still out, and b stays in front.
    await waitFor(() => expect(a).toHaveAttribute("data-ending-style"), FLIGHT);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(a).not.toHaveAttribute("data-front");
    expect(screen.getByRole("group", { name: "Card b" })).toHaveAttribute(
      "data-front",
    );
    await waitFor(() => expect(a).not.toBeInTheDocument(), FLIGHT);
  });

  it("brings a card moved to the back into the pile", async () => {
    function CycleDeck() {
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
          {cards.map((card) => (
            <SwipeDeckItem key={card} value={card} aria-label={`Card ${card}`}>
              {card}
            </SwipeDeckItem>
          ))}
        </SwipeDeck>
      );
    }
    render(<CycleDeck />);
    screen.getByRole("group", { name: "Cards" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    const a = screen.getByRole("group", { name: "Card a" });
    await waitFor(() => expect(a).not.toHaveAttribute("data-leaving"), FLIGHT);
    expect(a.style.getPropertyValue("--swipe-deck-index")).toBe("2");
    expect(screen.getByRole("group", { name: "Card b" })).toHaveAttribute(
      "data-front",
    );
  });

  describe("SwipeDeckEmpty", () => {
    function EmptyDeck() {
      const [cards, setCards] = React.useState(["a"]);
      return (
        <SwipeDeck
          aria-label="Cards"
          onSwipe={({ value }) =>
            setCards((previous) => previous.filter((v) => v !== value))
          }
        >
          {cards.map((card) => (
            <SwipeDeckItem key={card} value={card} aria-label={`Card ${card}`}>
              {card}
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
      const deck = screen.getByRole("group", { name: "Cards" });
      const empty = deck.querySelector("[data-slot=swipe-deck-empty]")!;
      // One card left: drawn under it once it has come to rest, out of reach.
      expect(empty).toHaveClass("invisible");
      await waitFor(() => expect(empty).not.toHaveClass("invisible"));
      expect(empty).toHaveAttribute("inert");
      deck.focus();
      await userEvent.keyboard("{ArrowRight}");
      expect(screen.getByRole("group", { name: "Card a" })).toHaveAttribute(
        "data-leaving",
      );
      expect(empty).not.toHaveAttribute("inert");
      expect(deck).toHaveAttribute("data-empty");
      expect(screen.getByRole("status")).toHaveTextContent("All done");
    });

    it("is not drawn while two or more cards are left", () => {
      const { container } = render(
        <SwipeDeck aria-label="Three">
          {CARDS.map((card) => (
            <SwipeDeckItem key={card} value={card}>
              {card}
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
      const deck = screen.getByRole("group", { name: "Cards" });
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
