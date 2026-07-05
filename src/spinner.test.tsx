import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Spinner } from "./spinner";

describe("Spinner", () => {
  it("is an accessible status named Loading", () => {
    render(<Spinner />);
    // The spinner IS the status region, so it must be exposed to AT.
    expect(screen.getByRole("status")).toHaveAccessibleName("Loading");
  });

  it("opts out of the decorative aria-hidden its internal icon carries", () => {
    render(<Spinner />);
    // Internal icons default to aria-hidden=true; the spinner must NOT hide.
    expect(screen.getByRole("status")).not.toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("exposes the data-slot styling hook", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toHaveAttribute("data-slot", "spinner");
  });

  it("forwards className without dropping the styling contract", () => {
    render(<Spinner className="custom" />);
    const spinner = screen.getByRole("status");
    // Consumer classes compose; the slot + a11y contract survives.
    expect(spinner).toHaveAttribute("data-slot", "spinner");
    expect(spinner).toHaveAccessibleName("Loading");
  });
});
