import type { Meta, StoryObj } from "@storybook/react-vite";

import { Label } from "./label";
import { RadioGroup } from "./radio-group";
import { Radio } from "./radio";

const meta = {
  title: "Forms/Radio",
  component: Radio,
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex flex-col gap-3">
        <div className="group/field flex items-center gap-2">
          <Radio id="compact" value="compact" />
          <Label htmlFor="compact">Compact</Label>
        </div>
        <div className="group/field flex items-center gap-2">
          <Radio id="comfortable" value="comfortable" />
          <Label htmlFor="comfortable">Comfortable</Label>
        </div>
        <div className="group/field flex items-center gap-2">
          <Radio id="spacious" value="spacious" />
          <Label htmlFor="spacious">Spacious</Label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <div className="flex flex-col gap-3">
        <div className="group/field flex items-center gap-2">
          <Radio id="option-1" value="option-1" />
          <Label htmlFor="option-1">Selected but disabled</Label>
        </div>
        <div className="group/field flex items-center gap-2">
          <Radio id="option-2" value="option-2" />
          <Label htmlFor="option-2">Disabled</Label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="light">
      <div className="flex items-center gap-4">
        <div className="group/field flex items-center gap-2">
          <Radio id="light" value="light" />
          <Label htmlFor="light">Light</Label>
        </div>
        <div className="group/field flex items-center gap-2">
          <Radio id="dark" value="dark" />
          <Label htmlFor="dark">Dark</Label>
        </div>
        <div className="group/field flex items-center gap-2">
          <Radio id="system" value="system" />
          <Label htmlFor="system">System</Label>
        </div>
      </div>
    </RadioGroup>
  ),
};
