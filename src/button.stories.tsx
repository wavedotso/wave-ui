import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { CheckIcon, CloseIcon } from "./lib/internal-icons";

const meta = {
  title: "Actions/Button",
  component: Button,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "outline",
        "secondary",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: {
      control: "select",
      options: [
        "default",
        "xs",
        "sm",
        "lg",
        "icon",
        "icon-xs",
        "icon-sm",
        "icon-lg",
      ],
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/**
 * Square icon-only sizes. Each button holds a single icon and provides an
 * accessible name via `aria-label`, since there's no visible text.
 */
export const AllIconSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon-xs" variant="outline" aria-label="Confirm">
        <CheckIcon />
      </Button>
      <Button size="icon-sm" variant="outline" aria-label="Confirm">
        <CheckIcon />
      </Button>
      <Button size="icon" variant="outline" aria-label="Confirm">
        <CheckIcon />
      </Button>
      <Button size="icon-lg" variant="outline" aria-label="Confirm">
        <CheckIcon />
      </Button>
    </div>
  ),
};

/**
 * Leading / trailing icons use the library-wide `data-icon` convention
 * (`"inline-start"` / `"inline-end"`) to tighten padding on the icon
 * side. Same mechanism as `Badge`; implementation-agnostic, so it
 * survives an icon-library swap and works for wrapped/non-svg icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <CheckIcon data-icon="inline-start" />
        Confirm
      </Button>
      <Button variant="outline">
        Dismiss
        <CloseIcon data-icon="inline-end" />
      </Button>
      <Button variant="ghost" size="icon-sm" aria-label="Close">
        <CloseIcon />
      </Button>
    </div>
  ),
};
