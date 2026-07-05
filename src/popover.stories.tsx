import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Popover,
  PopoverBackdrop,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverPortal,
  PopoverTitle,
  PopoverTrigger,
} from './popover';
import { Button } from './button';

const meta = {
  title: 'Overlay/Popover',
  component: Popover,
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-sm">Width</label>
            <input
              className="border-edge bg-transparent col-span-2 h-8 rounded-md border px-3 text-sm"
              defaultValue="100%"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-sm">Height</label>
            <input
              className="border-edge bg-transparent col-span-2 h-8 rounded-md border px-3 text-sm"
              defaultValue="25px"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const SideRight: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Right side
      </PopoverTrigger>
      <PopoverContent side="right">
        <PopoverHeader>
          <PopoverTitle>Right popover</PopoverTitle>
          <PopoverDescription>
            This popover opens to the right.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

export const SideTop: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Top side
      </PopoverTrigger>
      <PopoverContent side="top">
        <PopoverHeader>
          <PopoverTitle>Top popover</PopoverTitle>
          <PopoverDescription>
            This popover opens above the trigger.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * A `PopoverBackdrop` dims the rest of the page while the popover is open,
 * pulling focus to the surface. Render it through `PopoverPortal` as a sibling
 * of `PopoverContent` so it shares the popover's portal layer. It closes on an
 * outside click like the default backdrop-less popover.
 */
export const WithBackdrop: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open with backdrop
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverBackdrop className="bg-scrim supports-backdrop-filter:backdrop-blur-xs" />
      </PopoverPortal>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Dimmed background</PopoverTitle>
          <PopoverDescription>
            The backdrop darkens the page behind this popover to focus
            attention on it.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

/**
 * `restoreFocusOnClose` governs where focus lands after the popover closes.
 * The default (`"always"`) returns focus to the trigger. `"keyboard"` restores
 * only on a keyboard close, leaving pointer closes where they are — ideal for
 * hover-revealed triggers. `"never"` never auto-restores. Open each popover,
 * then close with <kbd>Esc</kbd> vs. an outside click to compare the outline
 * on the trigger afterwards.
 */
export const RestoreFocusOnClose: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Restore: always
        </PopoverTrigger>
        <PopoverContent restoreFocusOnClose="always">
          <PopoverHeader>
            <PopoverTitle>Always restore</PopoverTitle>
            <PopoverDescription>
              Closing this popover always returns focus to the trigger.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Restore: keyboard
        </PopoverTrigger>
        <PopoverContent restoreFocusOnClose="keyboard">
          <PopoverHeader>
            <PopoverTitle>Keyboard only</PopoverTitle>
            <PopoverDescription>
              Focus returns to the trigger only on a keyboard close; a pointer
              close leaves focus where it is.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Restore: never
        </PopoverTrigger>
        <PopoverContent restoreFocusOnClose="never">
          <PopoverHeader>
            <PopoverTitle>Never restore</PopoverTitle>
            <PopoverDescription>
              Focus is never auto-restored to the trigger on close.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
