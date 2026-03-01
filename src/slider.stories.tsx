import type { Meta, StoryObj } from '@storybook/react-vite';

import { Slider } from './slider';

const meta = {
  title: 'Forms/Slider',
  component: Slider,
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    defaultValue: [40],
    disabled: true,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const CustomRange: Story = {
  args: {
    defaultValue: [5],
    min: 0,
    max: 10,
    step: 1,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
