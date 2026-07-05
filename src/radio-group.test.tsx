import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { RadioGroup, RadioGroupItem } from "./radio-group";

function Options() {
  return (
    <RadioGroup defaultValue="apple">
      <label>
        <RadioGroupItem value="apple" />
        Apple
      </label>
      <label>
        <RadioGroupItem value="banana" />
        Banana
      </label>
      <label>
        <RadioGroupItem value="cherry" />
        Cherry
      </label>
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("renders one radio per option", () => {
    render(<Options />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Apple" })).toBeChecked();
  });

  it("checks the clicked option and unchecks the previous one", async () => {
    const user = userEvent.setup();
    render(<Options />);

    const apple = screen.getByRole("radio", { name: "Apple" });
    const banana = screen.getByRole("radio", { name: "Banana" });
    expect(apple).toBeChecked();
    expect(banana).not.toBeChecked();

    await user.click(banana);

    expect(banana).toBeChecked();
    expect(apple).not.toBeChecked();
  });
});
