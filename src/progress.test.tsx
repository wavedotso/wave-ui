import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Progress } from "./progress";

describe("Progress", () => {
  it("exposes the progressbar role", () => {
    render(<Progress aria-label="Upload" value={60} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("reports the current value via aria-valuenow", () => {
    render(<Progress aria-label="Upload" value={60} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "60",
    );
  });

  it("is indeterminate (no aria-valuenow) when value is null", () => {
    render(<Progress aria-label="Loading" value={null} />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow",
    );
  });
});
