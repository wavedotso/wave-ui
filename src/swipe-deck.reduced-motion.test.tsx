import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SwipeDeck, SwipeDeckItem } from "./swipe-deck";

// Motion reads the system setting once, the first time it's asked, so it is
// set before anything renders: this file runs as a system with reduced motion.
vi.hoisted(() => {
  window.matchMedia = (query: string) =>
    ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
});

function Deck({
  onSwipeComplete,
}: {
  onSwipeComplete?: (details: { value: string }) => void;
}) {
  const [cards, setCards] = React.useState(["a", "b", "c"]);
  return (
    <SwipeDeck
      aria-label="Cards"
      onSwipeComplete={(details) => {
        setCards((previous) => previous.filter((v) => v !== details.value));
        onSwipeComplete?.(details);
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

describe("SwipeDeck with reduced motion", () => {
  it("brings every card in at once", async () => {
    render(<Deck />);
    // No stagger: the last card is in as soon as the first is.
    await waitFor(
      () =>
        expect(document.querySelectorAll("[data-starting-style]")).toHaveLength(
          0,
        ),
      { timeout: 100 },
    );
  });

  it("lets a card go without flying it out", async () => {
    const onSwipeComplete = vi.fn();
    render(<Deck onSwipeComplete={onSwipeComplete} />);
    // Found before the swipe: with no exit to wait for, it's soon gone.
    const a = screen.getByRole("group", { name: "Card a" });
    screen.getByRole("group", { name: "Cards" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() => expect(onSwipeComplete).toHaveBeenCalled(), {
      timeout: 100,
    });
    expect(a.style.getPropertyValue("--swipe-deck-movement-x")).toBe("");
  });

  it("neither lifts nor tilts a pressed card", () => {
    render(<Deck />);
    const a = screen.getByRole("group", { name: "Card a" });
    fireEvent.pointerDown(a, { pointerId: 1, button: 0, clientX: 0 });
    window.dispatchEvent(
      new PointerEvent("pointermove", {
        pointerId: 1,
        buttons: 1,
        clientX: 40,
      }),
    );
    expect(a.style.getPropertyValue("--swipe-deck-pose")).toBe("");
    window.dispatchEvent(
      new PointerEvent("pointerup", { pointerId: 1, clientX: 40 }),
    );
  });
});
