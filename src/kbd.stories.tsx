import type { Meta, StoryObj } from '@storybook/react';

import { Kbd, KbdGroup } from './kbd';

const meta = {
  title: 'Data Display/Kbd',
  component: Kbd,
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single keyboard key. */
export const Default: Story = {
  args: {
    children: 'K',
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
    <p className="text-sm text-muted-foreground">
      Press{' '}
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </KbdGroup>{' '}
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
