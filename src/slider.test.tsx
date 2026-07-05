import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Slider } from "./slider";

// Base UI renders each thumb as a native `<input type="range">` (role="slider")
// wrapped in a thumb element that is `visibility: hidden` until measured. In
// jsdom there is no layout pass, so the thumbs stay hidden — query with
// `{ hidden: true }` to reach them. jsdom's name-computation returns "" for a
// hidden input, so `getThumbAriaLabel` passthrough is asserted via the
// `aria-label` attribute that names the thumb for assistive tech.
describe("Slider", () => {
  it("renders one slider thumb per value", () => {
    render(<Slider defaultValue={[40]} aria-label="Volume" />);
    expect(screen.getAllByRole("slider", { hidden: true })).toHaveLength(1);
  });

  it("labels the thumb via getThumbAriaLabel", () => {
    render(<Slider defaultValue={[40]} getThumbAriaLabel={() => "Volume"} />);
    expect(screen.getByRole("slider", { hidden: true })).toHaveAttribute(
      "aria-label",
      "Volume",
    );
  });

  it("labels each thumb by index for a range slider", () => {
    render(
      <Slider
        defaultValue={[20, 80]}
        getThumbAriaLabel={(index) => `Thumb ${index}`}
      />,
    );
    const thumbs = screen.getAllByRole("slider", { hidden: true });
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute("aria-label", "Thumb 0");
    expect(thumbs[1]).toHaveAttribute("aria-label", "Thumb 1");
  });
});
