import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group';
import { CheckIcon, CloseIcon, StarIcon } from './lib/internal-icons';

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

export const WithBlockStartAddon: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupAddon align="block-start" className="border-edge border-b">
        <InputGroupText>Compose</InputGroupText>
        <InputGroupButton className="ml-auto" aria-label="Favorite">
          <StarIcon />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupTextarea placeholder="Write a message..." />
    </InputGroup>
  ),
};

export const WithBlockEndAddon: Story = {
  render: () => (
    <InputGroup className="max-w-xs">
      <InputGroupTextarea placeholder="Write a message..." />
      <InputGroupAddon align="block-end" className="border-edge border-t">
        <InputGroupText>0 / 280</InputGroupText>
        <InputGroupButton size="sm" variant="default" className="ml-auto">
          Send
        </InputGroupButton>
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

/**
 * `InputGroupButton` ships four sizes: text buttons `xs` (default) and
 * `sm`, plus icon-only `icon-xs` and `icon-sm`. Icon-only buttons must
 * carry an `aria-label`.
 */
export const ButtonSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="size=xs (default)" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="xs">Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="size=sm" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm">Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="size=icon-xs" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-xs" aria-label="Confirm">
            <CheckIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="size=icon-sm" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" aria-label="Clear">
            <CloseIcon />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
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
