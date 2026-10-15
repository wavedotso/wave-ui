import type { Meta, StoryObj } from "@storybook/react-vite";

import { VideoText } from "./video-text";

// CC0 sample clip.
const SAMPLE_VIDEO =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm";

const meta: Meta<typeof VideoText> = {
  title: "Effects/VideoText",
  component: VideoText,
  args: {
    src: SAMPLE_VIDEO,
    text: "WAVE",
  },
  argTypes: {
    text: { control: "text" },
    fontSize: { control: { type: "range", min: 5, max: 40, step: 1 } },
    autoPlay: { control: "boolean" },
    loop: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="h-64 w-2xl max-w-full">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Heavy: Story = {
  args: {
    className: "font-black",
    fontSize: 26,
  },
};

export const Paused: Story = {
  args: {
    autoPlay: false,
  },
};
