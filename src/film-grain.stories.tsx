import type { Meta, StoryObj } from "@storybook/react-vite"

import { FilmGrain, type FilmGrainProps } from "./film-grain"

/** Force remount when controls change so WebGL reinitializes */
function GrainPreview({
  args,
  bg,
  label,
  labelColor = "rgba(255,255,255,0.6)",
}: {
  args: FilmGrainProps
  bg: string
  label: string
  labelColor?: string
}) {
  const key = `${args.density}-${args.opacity}-${args.fps}-${args.color}-${args.blendMode}`

  return (
    <div
      style={{
        position: "relative",
        width: 800,
        height: 400,
        background: bg,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <FilmGrain key={key} {...args} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: labelColor,
          fontSize: 14,
        }}
      >
        {label}
      </div>
    </div>
  )
}

const meta = {
  title: "Effects/FilmGrain",
  component: FilmGrain,
  argTypes: {
    density: {
      control: { type: "range", min: 0.05, max: 1, step: 0.05 },
    },
    opacity: {
      control: { type: "range", min: 0.01, max: 0.5, step: 0.01 },
    },
    fps: {
      control: { type: "range", min: 1, max: 60, step: 1 },
    },
    color: {
      control: "color",
    },
    blendMode: {
      control: "select",
      options: [
        "normal",
        "multiply",
        "screen",
        "overlay",
        "soft-light",
        "difference",
        "exclusion",
      ],
    },
  },
} satisfies Meta<typeof FilmGrain>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <GrainPreview
      args={args}
      bg="linear-gradient(135deg, #030712, #1f2937)"
      label="WebGL grain with canvas fallback (overlay blend)"
    />
  ),
}

export const OnDarkBackground: Story = {
  args: {
    density: 0.6,
    opacity: 0.08,
    blendMode: "overlay",
  },
  render: (args) => (
    <GrainPreview args={args} bg="#000" label="Film grain on dark background" />
  ),
}

export const OnLightBackground: Story = {
  args: {
    density: 0.5,
    opacity: 0.06,
    color: "#000000",
    blendMode: "overlay",
  },
  render: (args) => (
    <GrainPreview
      args={args}
      bg="#fff"
      label="Dark grain on light background"
      labelColor="rgba(0,0,0,0.6)"
    />
  ),
}

export const SoftLight: Story = {
  args: {
    density: 0.6,
    opacity: 0.12,
    blendMode: "soft-light",
  },
  render: (args) => (
    <GrainPreview
      args={args}
      bg="linear-gradient(135deg, #030712, #1f2937)"
      label="Soft-light blend — closest to analog film"
    />
  ),
}

export const TintedGrain: Story = {
  args: {
    density: 0.5,
    opacity: 0.1,
    color: "#01c3a8",
    blendMode: "overlay",
  },
  render: (args) => (
    <GrainPreview args={args} bg="#030712" label="Tinted grain (#01c3a8)" />
  ),
}

export const WithContent: Story = {
  args: {
    density: 0.6,
    opacity: 0.06,
    blendMode: "soft-light",
  },
  render: (args) => {
    const key = `${args.density}-${args.opacity}-${args.fps}-${args.color}-${args.blendMode}`

    return (
      <div
        style={{
          position: "relative",
          width: 800,
          height: 400,
          background: "linear-gradient(135deg, #030712, #1f2937)",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <FilmGrain key={key} {...args} />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 32,
          }}
        >
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
            Film Grain Overlay
          </h2>
          <p
            style={{
              maxWidth: 400,
              textAlign: "center",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            WebGL shader with dual-layer noise and cinematic smoothstep. Falls
            back to canvas 2D with non-binary grain. Pauses offscreen and
            respects reduced motion.
          </p>
        </div>
      </div>
    )
  },
}
