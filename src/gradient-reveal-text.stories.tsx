import type { Meta, StoryObj } from "@storybook/react-vite"
import { GradientRevealText } from "./gradient-reveal-text"

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
    fontFamily: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, background: "black", padding: 32, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof GradientRevealText>

export const Default: Story = {
  args: { text: "WAVE SOCIAL" },
}

export const CustomColors: Story = {
  args: {
    text: "WAVE",
    colors: ["#22d3ee", "#a78bfa", "#f472b6"],
  },
}

export const SmoothFollow: Story = {
  name: "Smooth Spotlight",
  args: {
    text: "SMOOTH",
    duration: 2,
    spotlightSize: 0.8,
  },
}

export const LargeSpotlight: Story = {
  args: {
    text: "GLOW",
    spotlightSize: 1.5,
    hoverOpacity: 0.5,
  },
}

export const OnLightBackground: Story = {
  name: "Light Background",
  args: {
    text: "LIGHT",
    baseOpacity: 0.15,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 600, background: "white", padding: 32, borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
}
