import type { Meta, StoryObj } from '@storybook/react-vite';

import { Separator } from './separator';

const meta = {
  title: 'Layout/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    className: 'w-[300px]',
  },
};

export const Vertical: Story = {
  args: {
    orientation: 'vertical',
    className: 'h-8',
  },
};

export const InContent: Story = {
  render: () => (
    <div className="w-[300px]">
      <div className="text-sm font-medium">Title</div>
      <p className="text-sm text-muted-foreground mt-1">A short description.</p>
      <Separator className="my-4" />
      <div className="text-sm font-medium">Another Section</div>
      <p className="text-sm text-muted-foreground mt-1">More details here.</p>
    </div>
  ),
};
