import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "./input";

describe("Input", () => {
  it("renders an accessible textbox", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox", { name: "Name" })).toBeInTheDocument();
  });

  it("fires onValueChange with the typed value and reflects it on the textbox", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<Input aria-label="Name" onValueChange={onValueChange} />);
    const textbox = screen.getByRole("textbox", { name: "Name" });

    await user.type(textbox, "Ada");

    // Base UI's onValueChange fires per keystroke; the final call carries the
    // fully-typed value.
    expect(onValueChange).toHaveBeenLastCalledWith("Ada", expect.anything());
    expect(textbox).toHaveValue("Ada");
  });

  it("carries data-slot for consumer styling hooks", () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute(
      "data-slot",
      "input",
    );
  });
});
