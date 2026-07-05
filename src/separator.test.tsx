import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Separator } from "./separator";

describe("Separator", () => {
  it("renders with role separator and a horizontal orientation by default", () => {
    render(<Separator />);
    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
  });

  it("reports a vertical orientation via aria-orientation", () => {
    render(<Separator orientation="vertical" />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("carries data-slot for styling hooks", () => {
    render(<Separator />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "data-slot",
      "separator",
    );
  });
});
