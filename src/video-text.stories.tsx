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
    autoPlay: { control: "boolean" },
    loop: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="w-2xl max-w-full text-center text-9xl">
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
  },
};

export const MultiLine: Story = {
  args: {
    text: "Designed in the details",
    className: "text-7xl leading-none",
  },
};

export const Heading: Story = {
  args: {
    render: <h1 />,
  },
};

export const Paused: Story = {
  args: {
    autoPlay: false,
  },
};
