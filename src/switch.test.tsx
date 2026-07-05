import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Switch } from "./switch";

describe("Switch", () => {
  it("renders with role=switch and carries data-slot", () => {
    render(<Switch aria-label="Notifications" />);
    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("data-slot", "switch");
  });

  it("toggles aria-checked from false to true on click (uncontrolled)", async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Notifications" />);
    const toggle = screen.getByRole("switch", { name: "Notifications" });

    expect(toggle).toHaveAttribute("aria-checked", "false");
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
