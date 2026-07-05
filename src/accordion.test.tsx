import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

function SingleItemAccordion() {
  return (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("renders a collapsed trigger with aria-expanded=false", () => {
    render(<SingleItemAccordion />);
    expect(
      screen.getByRole("button", { name: "Is it accessible?" }),
    ).toHaveAttribute("aria-expanded", "false");
  });

  it("expands the item and reveals content when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<SingleItemAccordion />);

    const trigger = screen.getByRole("button", { name: "Is it accessible?" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      await screen.findByText(
        "Yes. It adheres to the WAI-ARIA design pattern.",
      ),
    ).toBeVisible();
  });

  it("collapses again on a second click (single-item default)", async () => {
    const user = userEvent.setup();
    render(<SingleItemAccordion />);

    const trigger = screen.getByRole("button", { name: "Is it accessible?" });
    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
