import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Field,
  FieldContent,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldValidity,
} from "./field";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { Switch } from "./switch";

const meta = {
  title: "Forms/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<Input placeholder="you@example.com" />} />
    </Field>
  ),
};

export const WithDescription: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldLabel>Username</FieldLabel>
      <FieldControl render={<Input placeholder="@saulo" />} />
      <FieldDescription>
        This is your public display name. It can be your real name or a
        pseudonym.
      </FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  args: {},
  render: () => (
    <Field invalid>
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<Input placeholder="you@example.com" />} />
      <FieldError match>Please enter a valid email address.</FieldError>
    </Field>
  ),
};

/**
 * With both messages, the error comes first, right under the control, and
 * the description stays below it.
 */
export const WithErrorAndDescription: Story = {
  args: {},
  render: () => (
    <Field invalid>
      <FieldLabel>Password</FieldLabel>
      <FieldControl render={<Input type="password" />} />
      <FieldError match>Your password is too short.</FieldError>
      <FieldDescription>Use at least 8 characters.</FieldDescription>
    </Field>
  ),
};

export const Disabled: Story = {
  args: {},
  render: () => (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <FieldControl
        render={<Input placeholder="you@example.com" value="locked@wave.so" />}
      />
      <FieldDescription>This field cannot be edited.</FieldDescription>
    </Field>
  ),
};

/**
 * `FieldItem` lays out a control and its label on a single row (checkbox,
 * radio, switch). The Base UI `Field` wires the label to the control
 * automatically, so no `htmlFor`/`id` is needed.
 */
export const InlineItem: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldItem>
        <FieldControl render={<Checkbox />} />
        <FieldLabel>Subscribe to the newsletter</FieldLabel>
      </FieldItem>
      <FieldDescription>
        We&apos;ll send you product updates once a month. No spam.
      </FieldDescription>
    </Field>
  ),
};

/**
 * `FieldValidity` reads the field's live validity state via a render-prop
 * child, letting you drive custom UI from the control's constraints. Here a
 * `required` input surfaces a hint until it has a value.
 */
export const Validity: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldLabel>Full name</FieldLabel>
      <FieldControl render={<Input required placeholder="Ada Lovelace" />} />
      <FieldValidity>
        {(state) => (
          <FieldDescription>
            {state.validity.valueMissing
              ? "This field is required."
              : "Looks good."}
          </FieldDescription>
        )}
      </FieldValidity>
    </Field>
  ),
};

/**
 * `orientation="horizontal"` puts the label beside the control, as in a
 * settings row.
 */
export const Horizontal: Story = {
  args: {},
  render: () => (
    <Field orientation="horizontal" className="w-80">
      <FieldLabel>Email notifications</FieldLabel>
      <FieldControl render={<Switch />} />
    </Field>
  ),
};

/**
 * In a horizontal row, `FieldContent` stacks the label and its description
 * together beside the control.
 */
export const HorizontalWithContent: Story = {
  args: {},
  render: () => (
    <Field orientation="horizontal" className="w-80">
      <FieldControl render={<Checkbox />} />
      <FieldContent>
        <FieldLabel>Share usage data</FieldLabel>
        <FieldDescription>
          Help us improve Wave by sending anonymous usage statistics.
        </FieldDescription>
      </FieldContent>
    </Field>
  ),
};
