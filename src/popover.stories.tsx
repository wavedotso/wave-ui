import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
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
              className="border-input bg-transparent col-span-2 h-8 rounded-md border px-3 text-sm"
              defaultValue="100%"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <label className="text-sm">Height</label>
            <input
              className="border-input bg-transparent col-span-2 h-8 rounded-md border px-3 text-sm"
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
