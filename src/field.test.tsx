import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field, FieldControl, FieldError, FieldLabel } from "./field";
import { Input } from "./input";

describe("Field", () => {
  it("wires the label to the control as its accessible name", () => {
    // Base UI's Field auto-associates <FieldLabel> with the composed control;
    // no explicit htmlFor/id is needed. The control is an <Input> rendered
    // through FieldControl's `render` prop.
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<Input />} />
      </Field>,
    );

    const control = screen.getByRole("textbox", { name: "Email" });
    expect(control).toBeInTheDocument();
    expect(control).toHaveAccessibleName("Email");
  });

  it("describes the control with the error text when the field is invalid", () => {
    render(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <FieldControl render={<Input />} />
        {/* `match` forces the error to show and hands visibility to the
            caller — this is how the RHF <FormField> wrapper surfaces
            server/schema errors. */}
        <FieldError match>Please enter a valid email address.</FieldError>
      </Field>,
    );

    const control = screen.getByRole("textbox", { name: "Email" });
    // Base UI points the control's aria-describedby at the rendered error,
    // exposing it as the control's accessible description for assistive tech.
    expect(control).toHaveAccessibleDescription(
      "Please enter a valid email address.",
    );
  });
});
