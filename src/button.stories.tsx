import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { CheckIcon, CloseIcon } from './lib/internal-icons';

const meta = {
  title: 'Actions/Button',
  component: Button,
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'outline',
        'secondary',
        'ghost',
        'success',
        'destructive',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'xl', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'XS',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="success">Success</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
    </div>
  ),
};

/**
 * Leading / trailing icons use the library-wide `data-icon` convention
 * (`"inline-start"` / `"inline-end"`) to tighten padding on the icon
 * side. Same mechanism as `Badge`; implementation-agnostic, so it
 * survives an icon-library swap and works for wrapped/non-svg icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <CheckIcon data-icon="inline-start" />
        Confirm
      </Button>
      <Button variant="outline">
        Dismiss
        <CloseIcon data-icon="inline-end" />
      </Button>
      <Button variant="ghost" size="sm" aria-label="Close">
        <CloseIcon data-icon="inline-start" />
      </Button>
    </div>
  ),
};
