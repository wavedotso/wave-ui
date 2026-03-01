import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup } from '@base-ui/react/radio-group';

import { Label } from './label';
import { Radio } from './radio';

const meta = {
  title: 'Forms/Radio',
  component: Radio,
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Radio value="compact" />
          <Label>Compact</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio value="comfortable" />
          <Label>Comfortable</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio value="spacious" />
          <Label>Spacious</Label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" disabled>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Radio value="option-1" />
          <Label>Selected but disabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio value="option-2" />
          <Label>Disabled</Label>
        </div>
      </div>
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="light">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Radio value="light" />
          <Label>Light</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio value="dark" />
          <Label>Dark</Label>
        </div>
        <div className="flex items-center gap-2">
          <Radio value="system" />
          <Label>System</Label>
        </div>
      </div>
    </RadioGroup>
  ),
};
