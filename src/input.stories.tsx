import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { Input } from "./input";

const meta = {
  title: "Forms/Input",
  component: Input,
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel", "url"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

export const Email: Story = {
  args: {
    type: "email",
    placeholder: "you@example.com",
  },
};

export const Password: Story = {
  args: {
    type: "password",
    placeholder: "Enter password...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
    defaultValue: "Cannot edit this",
  },
};

export const WithValue: Story = {
  args: {
    defaultValue: "Hello, World!",
  },
};

export const File: Story = {
  args: {
    type: "file",
    size: "default",
  },
};

export const Invalid: Story = {
  args: {
    "aria-invalid": true,
    defaultValue: "Invalid value",
  },
};

/**
 * The shared control ladder: `xs` (24) · `sm` (32) · `default` (36) · `lg` (40).
 * Same tiers and names as Button, so sizes are interchangeable across the form.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3">
      <Input size="xs" placeholder="xs — 24px" />
      <Input size="sm" placeholder="sm — 32px" />
      <Input size="default" placeholder="default — 36px" />
      <Input size="lg" placeholder="lg — 40px" />
    </div>
  ),
};

/**
 * The point of the shared ladder: pair an input with a same-`size` button and
 * the row lines up perfectly.
 */
export const PairedWithButton: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex items-center gap-2">
          <Input size={size} placeholder={`${size} input`} className="w-56" />
          <Button size={size}>Save</Button>
        </div>
      ))}
    </div>
  ),
};
