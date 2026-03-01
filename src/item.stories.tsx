import type { Meta, StoryObj } from '@storybook/react-vite';

import { Badge } from './badge';
import { Button } from './button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './item';

const meta = {
  title: 'Data Display/Item',
  component: Item,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'muted'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'xs'],
    },
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Item>
      <ItemContent>
        <ItemTitle>Project Alpha</ItemTitle>
        <ItemDescription>A brief description of the project.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const Outline: Story = {
  args: {},
  render: () => (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>Project Alpha</ItemTitle>
        <ItemDescription>A brief description of the project.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const Muted: Story = {
  args: {},
  render: () => (
    <Item variant="muted">
      <ItemContent>
        <ItemTitle>Project Alpha</ItemTitle>
        <ItemDescription>A brief description of the project.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const WithActions: Story = {
  args: {},
  render: () => (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle>
          Design System
          <Badge variant="success">Active</Badge>
        </ItemTitle>
        <ItemDescription>Component library and design tokens.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </ItemActions>
    </Item>
  ),
};

export const WithImage: Story = {
  args: {},
  render: () => (
    <Item variant="outline">
      <ItemMedia variant="image">
        <img src="https://i.pravatar.cc/150?u=wave" alt="User" />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Saulo</ItemTitle>
        <ItemDescription>saulo@wave.so</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const Group: Story = {
  args: {},
  render: () => (
    <ItemGroup>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Dashboard</ItemTitle>
          <ItemDescription>Overview of key metrics.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Settings</ItemTitle>
          <ItemDescription>Manage your preferences.</ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Billing</ItemTitle>
          <ItemDescription>Subscription and payment info.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
};

export const Small: Story = {
  args: {},
  render: () => (
    <Item variant="outline" size="sm">
      <ItemContent>
        <ItemTitle>Compact Item</ItemTitle>
        <ItemDescription>Smaller padding for dense layouts.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};

export const ExtraSmall: Story = {
  args: {},
  render: () => (
    <Item variant="outline" size="xs">
      <ItemContent>
        <ItemTitle>Tiny Item</ItemTitle>
        <ItemDescription>Minimal padding for menus.</ItemDescription>
      </ItemContent>
    </Item>
  ),
};
