import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders its children inside a button", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("exposes data-variant and data-size for styling hooks", () => {
    render(
      <Button variant="outline" size="sm">
        X
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveAttribute("data-size", "sm");
  });

  it("carries data-slot", () => {
    render(<Button>Y</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
  });
});
