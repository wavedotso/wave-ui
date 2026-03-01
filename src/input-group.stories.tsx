import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group';

const meta = {
  title: 'Forms/InputGroup',
  component: InputGroup,
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
    </InputGroup>
  ),
};

export const WithInlineStartAddon: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupAddon align="inline-start">
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="example.com" />
    </InputGroup>
  ),
};

export const WithInlineEndAddon: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="0.00" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithBothAddons: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupAddon align="inline-start">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>USD</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <InputGroupButton>Go</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const WithTextarea: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupTextarea placeholder="Write a message..." />
    </InputGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupAddon align="inline-start">
        <InputGroupText>$</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput placeholder="0.00" disabled />
    </InputGroup>
  ),
};
