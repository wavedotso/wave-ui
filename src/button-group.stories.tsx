import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group";
import { Input } from "./input";

const meta = {
  title: "Actions/ButtonGroup",
  component: ButtonGroup,
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg"],
    },
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Center</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
};

export const WithSeparator: Story = {
  args: {},
  render: () => (
    <ButtonGroup>
      <Button variant="outline">Cut</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Copy</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Paste</Button>
    </ButtonGroup>
  ),
};

export const WithText: Story = {
  args: {},
  render: () => (
    <ButtonGroup>
      <ButtonGroupText>Label</ButtonGroupText>
      <Button variant="outline">Action</Button>
    </ButtonGroup>
  ),
};

export const WithInput: Story = {
  args: {},
  render: () => (
    <ButtonGroup>
      <Input placeholder="Search…" />
      <Button variant="outline">Go</Button>
    </ButtonGroup>
  ),
};

export const Sizes: Story = {
  args: {},
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup size="xs">
        <ButtonGroupText>Size</ButtonGroupText>
        <Button size="xs" variant="outline">
          XS
        </Button>
      </ButtonGroup>
      <ButtonGroup size="sm">
        <ButtonGroupText>Size</ButtonGroupText>
        <Button size="sm" variant="outline">
          SM
        </Button>
      </ButtonGroup>
      <ButtonGroup size="default">
        <ButtonGroupText>Size</ButtonGroupText>
        <Button variant="outline">Default</Button>
      </ButtonGroup>
      <ButtonGroup size="lg">
        <ButtonGroupText>Size</ButtonGroupText>
        <Button size="lg" variant="outline">
          LG
        </Button>
      </ButtonGroup>
    </div>
  ),
};

export const Vertical: Story = {
  args: {},
  render: () => (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Top</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Bottom</Button>
    </ButtonGroup>
  ),
};

export const Mixed: Story = {
  args: {},
  render: () => (
    <ButtonGroup>
      <Button variant="default">Save</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Cancel</Button>
    </ButtonGroup>
  ),
};
