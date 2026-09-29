import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";
import { CheckIcon, CloseIcon, StarIcon } from "./lib/internal-icons";

const meta = {
  title: "Forms/InputGroup",
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

/**
 * The shared control ladder — `xs` · `sm` · `default` · `lg` (24 / 32 / 36 / 44).
 * The height lives on the group; the inner control tracks it via CSS.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex max-w-xs flex-col gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <InputGroup key={size} size={size}>
          <InputGroupInput placeholder={`${size} — search...`} />
          <InputGroupAddon align="inline-end">
            <StarIcon />
          </InputGroupAddon>
        </InputGroup>
      ))}
    </div>
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
        <InputGroupButton size="icon" className="ml-auto" aria-label="Favorite">
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
        <InputGroupButton variant="default" className="ml-auto">
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
 * `InputGroupButton` has two shapes: `default` (a padded pill) and `icon` (a
 * square). There is no tier prop — both stretch to the field height and inherit
 * the group's size, so a button in a `sm` group is tighter than one in an `lg`
 * group with nothing to set per button. Icon buttons must carry an `aria-label`.
 */
export const Buttons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <InputGroup size="xs" className="max-w-xs">
        <InputGroupInput placeholder="xs group" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon" aria-label="Clear">
            <CloseIcon />
          </InputGroupButton>
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup size="sm" className="max-w-xs">
        <InputGroupInput placeholder="sm group" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon" aria-label="Clear">
            <CloseIcon />
          </InputGroupButton>
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup className="max-w-xs">
        <InputGroupInput placeholder="default group" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon" aria-label="Clear">
            <CloseIcon />
          </InputGroupButton>
          <InputGroupButton>Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup size="lg" className="max-w-xs">
        <InputGroupInput placeholder="lg group" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon" aria-label="Confirm">
            <CheckIcon />
          </InputGroupButton>
          <InputGroupButton>Go</InputGroupButton>
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
