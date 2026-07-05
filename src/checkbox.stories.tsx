import type { Meta, StoryObj } from "@storybook/react-vite";

import { Checkbox } from "./checkbox";
import { Label } from "./label";

const meta = {
  title: "Forms/Checkbox",
  component: Checkbox,
  argTypes: {
    disabled: { control: "boolean" },
    defaultChecked: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

/**
 * The third checkbox state, for a "select all" parent whose children are only
 * partially selected. It renders a dash (not a check) on a filled box.
 */
export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" {...args} />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Invalid: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="required" aria-invalid />
      <Label htmlFor="required">This field is required</Label>
    </div>
  ),
};
