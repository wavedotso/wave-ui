import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "./badge";
import { CheckIcon, CloseIcon } from "./lib/internal-icons";

const meta = {
  title: "Feedback/Badge",
  component: Badge,
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "success",
        "destructive",
        "warning",
        "secondary",
        "outline",
        "ghost",
        "link",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Success",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children: "Warning",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

/**
 * Leading icon: mark it `data-icon="inline-start"` to tighten the
 * badge's left padding. This is the library-wide convention (same on
 * `Button`) — implementation-agnostic, so it survives an icon-library
 * swap and works for non-svg/wrapped icons too.
 */
export const LeadingIcon: Story = {
  render: () => (
    <Badge variant="success">
      <CheckIcon data-icon="inline-start" />
      Verified
    </Badge>
  ),
};

/**
 * Trailing icon: `data-icon="inline-end"` tightens the right padding —
 * e.g. a dismissible badge.
 */
export const TrailingIcon: Story = {
  render: () => (
    <Badge variant="secondary">
      Dismiss
      <CloseIcon data-icon="inline-end" />
    </Badge>
  ),
};

/**
 * Icon-only: pad it square with `p-1` so the lone icon sits dead-center (the
 * `data-icon` spacing convention is for an icon *next to text*, so it doesn't
 * apply here). Give the badge an accessible label.
 */
export const IconOnly: Story = {
  render: () => (
    <Badge variant="outline" aria-label="Verified" className="p-1">
      <CheckIcon />
    </Badge>
  ),
};

/**
 * The escape hatch the convention is designed for: the icon does NOT have to be
 * a bare `<svg>`. Wrap anything and put `data-icon` on the wrapper — the spacing
 * still applies, and a nested `<svg>` is auto-sized just like a direct one (add
 * a `size-*` class on the icon to opt out).
 */
export const WrappedIcon: Story = {
  render: () => (
    <Badge variant="default">
      <span data-icon="inline-start" className="inline-flex">
        <CheckIcon />
      </span>
      Wrapped
    </Badge>
  ),
};

/**
 * Leading / trailing / icon-only across variants — confirms the
 * `data-icon` padding works regardless of color variant.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">
        <CheckIcon data-icon="inline-start" />
        Leading
      </Badge>
      <Badge variant="default">
        Trailing
        <CloseIcon data-icon="inline-end" />
      </Badge>
      <Badge variant="success">
        <CheckIcon data-icon="inline-start" />
        Active
      </Badge>
      <Badge variant="destructive" aria-label="Error" className="p-1">
        <CloseIcon />
      </Badge>
    </div>
  ),
};
