import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle } from './toggle';

const meta = {
  title: 'Actions/Toggle',
  component: Toggle,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'B',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'B',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'B',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'B',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'B',
  },
};

export const AllVariants: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle>Default</Toggle>
      <Toggle variant="outline">Outline</Toggle>
      <Toggle defaultPressed>Pressed</Toggle>
      <Toggle variant="outline" defaultPressed>
        Pressed
      </Toggle>
    </div>
  ),
};
