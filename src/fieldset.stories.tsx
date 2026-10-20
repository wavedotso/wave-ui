import type { Meta, StoryObj } from "@storybook/react-vite";

import { Field, FieldControl, FieldDescription, FieldLabel } from "./field";
import { Fieldset, FieldsetLegend } from "./fieldset";
import { Input } from "./input";

const meta: Meta<typeof Fieldset> = {
  title: "Forms/Fieldset",
  component: Fieldset,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Fieldset {...args}>
      <FieldsetLegend>Shipping address</FieldsetLegend>
      <Field>
        <FieldLabel>Street</FieldLabel>
        <FieldControl render={<Input placeholder="1 Wave Street" />} />
      </Field>
      <Field>
        <FieldLabel>City</FieldLabel>
        <FieldControl render={<Input placeholder="Lisbon" />} />
        <FieldDescription>Where the parcel is delivered.</FieldDescription>
      </Field>
    </Fieldset>
  ),
};

/** `disabled` on the fieldset disables every field inside it. */
export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: Default.render,
};
