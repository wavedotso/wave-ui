import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import { Kbd, KbdGroup } from "./kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta = {
  title: "Data Display/Kbd",
  component: Kbd,
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single keyboard key. */
export const Default: Story = {
  args: {
    children: "K",
  },
};

/** Modifier + key shortcut rendered as a group. */
export const Shortcut: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </KbdGroup>
  ),
};

/** Multi-key sequences for complex shortcuts. */
export const MultiKey: Story = {
  render: () => (
    <KbdGroup>
      <Kbd>Ctrl</Kbd>
      <Kbd>Shift</Kbd>
      <Kbd>P</Kbd>
    </KbdGroup>
  ),
};

/** Keyboard hints inline with surrounding text. */
export const InlineWithText: Story = {
  render: () => (
    <p className="text-sm text-muted">
      Press{" "}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{" "}
      to open the command palette
    </p>
  ),
};

/** Various common key representations. */
export const AllKeys: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Kbd>⌘</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>↵</Kbd>
      <Kbd>⌫</Kbd>
      <Kbd>⎋</Kbd>
      <Kbd>Tab</Kbd>
      <Kbd>Space</Kbd>
      <Kbd>↑</Kbd>
      <Kbd>↓</Kbd>
      <Kbd>←</Kbd>
      <Kbd>→</Kbd>
    </div>
  ),
};

/** Inside a tooltip, the key takes the tooltip's inverse colors. */
export const InTooltip: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip defaultOpen>
        <TooltipTrigger>
          <Button variant="outline">Search</Button>
        </TooltipTrigger>
        <TooltipContent>
          Search
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

/** A shortcut hint at the end of a search field. */
export const InInputGroup: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  ),
};
