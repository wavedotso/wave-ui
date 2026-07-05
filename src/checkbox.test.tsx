import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders a checkbox", () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("reports the indeterminate state via aria-checked=mixed", () => {
    // The Phase-6 fix renders a dash (MinusIcon) in this state; Base UI also
    // exposes it as aria-checked="mixed" for assistive tech.
    render(<Checkbox aria-label="Select all" indeterminate />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("is checked when defaultChecked", () => {
    render(<Checkbox aria-label="On" defaultChecked />);
    expect(screen.getByRole("checkbox")).toBeChecked();
  });
});
