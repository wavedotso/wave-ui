import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup", () => {
  it("forwards orientation='vertical' as data-orientation on the group", () => {
    render(
      <ToggleGroup orientation="vertical" aria-label="Alignment">
        <ToggleGroupItem value="a" aria-label="A">
          A
        </ToggleGroupItem>
      </ToggleGroup>,
    );

    const group = screen.getByRole("group", { name: "Alignment" });
    expect(group).toHaveAttribute("data-orientation", "vertical");
  });
});

describe("ToggleGroupItem (standalone, outside a ToggleGroup)", () => {
  // Phase 7 fix: context defaults for variant/size are `undefined`, so a
  // standalone item falls back to its OWN props via `context.x ?? x`.
  it("reflects its own variant/size via data-variant/data-size", () => {
    render(
      <ToggleGroupItem value="a" variant="outline" size="sm" aria-label="Bold">
        B
      </ToggleGroupItem>,
    );

    const item = screen.getByRole("button", { name: "Bold" });
    expect(item).toHaveAttribute("data-variant", "outline");
    expect(item).toHaveAttribute("data-size", "sm");
  });

  it("defaults to variant='default' size='default' when no props are given", () => {
    render(
      <ToggleGroupItem value="a" aria-label="Italic">
        I
      </ToggleGroupItem>,
    );

    const item = screen.getByRole("button", { name: "Italic" });
    expect(item).toHaveAttribute("data-variant", "default");
    expect(item).toHaveAttribute("data-size", "default");
  });
});
