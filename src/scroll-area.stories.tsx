import type { Meta, StoryObj } from '@storybook/react-vite';

import { ScrollArea, ScrollBar } from './scroll-area';
import { Separator } from './separator';

const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

const tags = Array.from({ length: 50 }, (_, i) => `v1.${i}.0`);

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-lg border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tags.map((tag, i) => (
          <div key={tag}>
            {i > 0 && <Separator className="my-2" />}
            <div className="text-sm">{tag}</div>
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-72 rounded-lg border">
      <div className="flex gap-4 p-4">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="bg-muted flex size-24 shrink-0 items-center justify-center rounded-lg text-sm font-medium"
          >
            Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const Both: Story = {
  render: () => (
    <ScrollArea className="h-72 w-72 rounded-lg border">
      <div className="p-4" style={{ width: 600 }}>
        {Array.from({ length: 30 }, (_, i) => (
          <p key={i} className="text-sm leading-relaxed">
            Line {i + 1} — This is a long line of text to demonstrate both vertical and horizontal scrollbars working together in the scroll area component.
          </p>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
