import type { Meta, StoryObj } from "@storybook/react-vite";

import { GlyphMatrix } from "./glyph-matrix";

const meta: Meta<typeof GlyphMatrix> = {
  title: "Effects/GlyphMatrix",
  component: GlyphMatrix,
  argTypes: {
    glyphs: { control: "text" },
    speed: { control: { type: "range", min: 0, max: 3, step: 0.1 } },
    glitch: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="border-contour h-72 w-xl max-w-full overflow-hidden rounded-lg border">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// The field behind a line of text, cleared around it by a radial mask.
const behindContent: Story["render"] = (args) => (
  <div className="relative flex h-full items-center justify-center">
    <GlyphMatrix
      {...args}
      className="absolute inset-0 mask-radial-from-transparent mask-radial-to-black"
    />
    <p className="text-contrast relative text-lg font-medium">Content on top</p>
  </div>
);

export const Default: Story = {};

export const Primary: Story = {
  args: {
    className: "text-primary",
  },
};

export const Calm: Story = {
  args: {
    glitch: false,
  },
};

export const CalmClassic: Story = {
  args: {
    glitch: false,
    glyphs: "01·•+*/\\<>=",
    className: "text-muted",
  },
};

export const CalmPrimary: Story = {
  args: {
    glitch: false,
    className: "text-primary",
  },
};

export const CalmFadeBottom: Story = {
  args: {
    glitch: false,
    className: "mask-b-from-40%",
  },
};

export const CalmBackground: Story = {
  args: {
    glitch: false,
  },
  render: behindContent,
};

export const GreenFlares: Story = {
  args: {
    className: "accent-success",
  },
};

export const Binary: Story = {
  args: {
    glyphs: "01",
    className: "text-base",
  },
};

export const FadeBottom: Story = {
  args: {
    className: "mask-b-from-40%",
  },
};

export const Vignette: Story = {
  args: {
    className: "mask-radial-from-40% mask-radial-to-80%",
  },
};

export const Background: Story = {
  render: behindContent,
};
