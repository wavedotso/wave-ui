import type { Meta, StoryObj } from "@storybook/react-vite";
import { GradientRevealText } from "./gradient-reveal-text";

const meta: Meta<typeof GradientRevealText> = {
  title: "Effects/GradientRevealText",
  component: GradientRevealText,
  tags: ["autodocs"],
  parameters: {
    docs: {
      story: {
        inline: false,
        height: "400px",
      },
    },
  },
  argTypes: {
    text: { control: "text" },
    duration: { control: { type: "number", min: 0, max: 1, step: 0.05 } },
    baseOpacity: { control: { type: "number", min: 0, max: 1, step: 0.05 } },
    hoverOpacity: { control: { type: "number", min: 0, max: 1, step: 0.05 } },
    spotlightSize: { control: { type: "number", min: 0.2, max: 2, step: 0.1 } },
    strokeWidth: { control: { type: "number", min: 0.5, max: 8, step: 0.5 } },
    baseColor: { control: "color" },
    fontFamily: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div className="ink w-150 max-w-full rounded-lg bg-foundation p-8 text-contrast">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GradientRevealText>;

export const Default: Story = {
  args: { text: "WAVE SOCIAL" },
};

export const CustomColors: Story = {
  args: {
    text: "WAVE",
    colors: [
      "var(--wave-teal-300)",
      "var(--wave-purple-400)",
      "var(--wave-pink-400)",
    ],
  },
};

export const SmoothFollow: Story = {
  name: "Smooth Spotlight",
  args: {
    text: "SMOOTH",
    duration: 2,
    spotlightSize: 0.8,
  },
};

export const LargeSpotlight: Story = {
  args: {
    text: "GLOW",
    spotlightSize: 1.5,
    hoverOpacity: 0.5,
  },
};

export const ThickStroke: Story = {
  name: "Thick Stroke",
  args: {
    text: "BOLD",
    strokeWidth: 4,
    baseOpacity: 0.4,
  },
};

export const CustomBaseColor: Story = {
  name: "Custom Base Color",
  args: {
    text: "TINT",
    baseColor: "var(--primary)",
    baseOpacity: 0.5,
  },
};

export const OnLightBackground: Story = {
  name: "Light Background",
  args: {
    text: "LIGHT",
    baseOpacity: 0.15,
  },
  decorators: [
    (Story) => (
      <div className="paper w-150 max-w-full rounded-lg bg-foundation p-8 text-contrast">
        <Story />
      </div>
    ),
  ],
};
