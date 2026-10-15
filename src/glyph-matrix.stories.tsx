import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlyphMatrix } from "./glyph-matrix";

const meta: Meta<typeof GlyphMatrix> = {
  title: "Effects/GlyphMatrix",
  component: GlyphMatrix,
  argTypes: {
    glyphs: { control: "text" },
    cellSize: { control: { type: "range", min: 8, max: 32, step: 1 } },
    mutationRate: { control: { type: "range", min: 0, max: 0.3, step: 0.01 } },
    interval: { control: { type: "range", min: 16, max: 500, step: 1 } },
    fadeBottom: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
  },
  decorators: [
    (Story) => (
      <div className="border-line h-72 w-full max-w-xl overflow-hidden rounded-lg border">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    className: "text-primary",
  },
};

export const Binary: Story = {
  args: {
    glyphs: "01",
    cellSize: 16,
  },
};

export const NoFade: Story = {
  args: {
    fadeBottom: 0,
  },
};

export const Background: Story = {
  render: (args) => (
    <div className="relative flex h-full items-center justify-center">
      <GlyphMatrix {...args} className="absolute inset-0" />
      <p className="text-contrast relative text-lg font-medium">
        Content on top
      </p>
    </div>
  ),
};
