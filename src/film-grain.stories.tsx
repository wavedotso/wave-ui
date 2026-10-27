import type { Meta, StoryObj } from "@storybook/react-vite";

import { FilmGrain, type FilmGrainProps } from "./film-grain";

/**
 * Force remount when controls change so WebGL reinitializes. `bg` is the
 * wrapper's classes: a pinned theme (`ink` / `paper`) and its backdrop.
 */
function GrainPreview({
  args,
  bg,
  label,
}: {
  args: FilmGrainProps;
  bg: string;
  label: string;
}) {
  const key = `${args.density}-${args.opacity}-${args.fps}-${args.color}-${args.blendMode}`;

  return (
    <div
      className={bg}
      style={{
        position: "relative",
        width: 800,
        height: 400,
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      <FilmGrain key={key} {...args} />
      <div
        className="text-muted"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 14,
        }}
      >
        {label}
      </div>
    </div>
  );
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
} satisfies Meta<typeof FilmGrain>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <GrainPreview
      args={args}
      bg="ink bg-linear-135 from-foundation to-elevated text-contrast"
      label="WebGL grain with canvas fallback (overlay blend)"
    />
  ),
};

export const OnDarkBackground: Story = {
  args: {
    density: 0.6,
    opacity: 0.08,
    blendMode: "overlay",
  },
  render: (args) => (
    <GrainPreview
      args={args}
      bg="ink bg-foundation text-contrast"
      label="Film grain on dark background"
    />
  ),
};

export const OnLightBackground: Story = {
  args: {
    density: 0.5,
    opacity: 0.06,
    color: "#0D0D0D", // paper-950, the Paper theme's contrast
    blendMode: "overlay",
  },
  render: (args) => (
    <GrainPreview
      args={args}
      bg="paper bg-foundation text-contrast"
      label="Dark grain on light background"
    />
  ),
};

export const SoftLight: Story = {
  args: {
    density: 0.6,
    opacity: 0.12,
    blendMode: "soft-light",
  },
  render: (args) => (
    <GrainPreview
      args={args}
      bg="ink bg-linear-135 from-foundation to-elevated text-contrast"
      label="Soft-light blend — closest to analog film"
    />
  ),
};

export const TintedGrain: Story = {
  args: {
    density: 0.5,
    opacity: 0.1,
    color: "#37D3DE", // teal-300
    blendMode: "overlay",
  },
  render: (args) => (
    <GrainPreview
      args={args}
      bg="ink bg-foundation text-contrast"
      label="Tinted grain (teal-300)"
    />
  ),
};

export const WithContent: Story = {
  args: {
    density: 0.6,
    opacity: 0.06,
    blendMode: "soft-light",
  },
  render: (args) => {
    const key = `${args.density}-${args.opacity}-${args.fps}-${args.color}-${args.blendMode}`;

    return (
      <div
        className="ink bg-linear-135 from-foundation to-elevated text-contrast"
        style={{
          position: "relative",
          width: 800,
          height: 400,
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
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>Film Grain Overlay</h2>
          <p
            className="text-muted"
            style={{
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            WebGL shader with dual-layer noise and cinematic smoothstep. Falls
            back to canvas 2D with non-binary grain. Pauses offscreen and
            respects reduced motion.
          </p>
        </div>
      </div>
    );
  },
};
