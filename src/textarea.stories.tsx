import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "./textarea";

const meta = {
  title: "Forms/Textarea",
  component: Textarea,
  argTypes: {
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "This is a pre-filled textarea with some content.",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "Cannot edit this",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Invalid content",
  },
};

/**
 * The shared control ladder: `xs` · `sm` · `default` · `lg`. Same tiers and names
 * as Button and Input, but mapped to a `min-h-*` floor since a textarea grows with
 * its content rather than sitting at a fixed height.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Textarea size="xs" placeholder="xs — 48px min" />
      <Textarea size="sm" placeholder="sm — 56px min" />
      <Textarea size="default" placeholder="default — 64px min" />
      <Textarea size="lg" placeholder="lg — 80px min" />
    </div>
  ),
};
