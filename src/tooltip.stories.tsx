import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "Overlay/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>This is a tooltip</TooltipContent>
    </Tooltip>
  ),
};

export const WithArrow: Story = {
  args: {},
  render: () => (
    <Tooltip>
      <TooltipTrigger>
        <Button variant="outline">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent arrow>Tooltip with arrow</TooltipContent>
    </Tooltip>
  ),
};

export const Positions: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top" arrow>
          Top tooltip
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right" arrow>
          Right tooltip
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" arrow>
          Bottom tooltip
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left" arrow>
          Left tooltip
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};
