import type { Meta, StoryObj } from '@storybook/react-vite';

import { Progress, ProgressLabel, ProgressValue } from './progress';

const meta = {
  title: 'Feedback/Progress',
  component: Progress,
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100 },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 40,
    className: 'w-[300px]',
  },
};

export const Empty: Story = {
  args: {
    value: 0,
    className: 'w-[300px]',
  },
};

export const Full: Story = {
  args: {
    value: 100,
    className: 'w-[300px]',
  },
};

export const WithLabel: Story = {
  args: {
    value: 66,
    className: 'w-[300px]',
  },
  render: (args) => (
    <Progress {...args}>
      <ProgressLabel>Uploading...</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
};
