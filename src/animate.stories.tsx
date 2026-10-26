import { type CSSProperties, forwardRef, useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimateOnView, AnimateIn, Stagger, Pulse, Float } from "./animate";
import { Button } from "./button";

const meta: Meta = {
  title: "Effects/Animate",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    from: {
      control: "select",
      options: ["up", "down", "left", "right"],
    },
    delay: { control: { type: "number", min: 0, max: 2, step: 0.1 } },
    distance: { control: { type: "number", min: 0, max: 100, step: 5 } },
    scale: { control: "boolean" },
    blur: { control: "boolean" },
    rotate: { control: { type: "number", min: -180, max: 180, step: 5 } },
    flip: { control: "boolean" },
    spring: { control: "boolean" },
  },
};
export default meta;

// ── Helpers ──────────────────────────────────────────────────────────

const DemoCard = forwardRef<
  HTMLDivElement,
  { label: string; color?: string; style?: CSSProperties }
>(({ label, color, style, ...rest }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg p-6 text-center text-sm font-medium ${
      color
        ? "border border-contour text-white"
        : "bg-elevated text-contrast ring-1 ring-contrast/10"
    }`}
    style={{ background: color, ...style }}
    {...rest}
  >
    {label}
  </div>
));
DemoCard.displayName = "DemoCard";

function Replay({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0);
  const replay = useCallback(() => setKey((k) => k + 1), []);

  return (
    <div className="relative w-[800px] py-[120px] flex items-center justify-center mx-auto">
      <Button
        variant="outline"
        size="xs"
        onClick={replay}
        className="absolute top-3 right-3 z-50"
        aria-label="Replay animation"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M2 8a6 6 0 0 1 10.3-4.2L11 5h4V1l-1.7 1.7A8 8 0 1 0 16 8h-2a6 6 0 0 1-12 0Z"
            fill="currentColor"
          />
        </svg>
        Replay
      </Button>
      <div key={key} className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENTRANCE ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MountAnimation: StoryObj = {
  name: "AnimateIn",
  args: {
    from: "down",
    delay: 0,
    distance: 20,
    scale: false,
    blur: false,
    rotate: 0,
    flip: false,
    spring: false,
  },
  render: (args) => (
    <Replay key={JSON.stringify(args)}>
      <div className="p-8">
        <AnimateIn {...args}>
          <DemoCard label="I animate on mount" />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const OnViewAnimation: StoryObj = {
  name: "AnimateOnView",
  args: {
    from: "down",
    delay: 0,
    distance: 20,
    scale: false,
    blur: false,
    rotate: 0,
    flip: false,
    spring: false,
  },
  render: (args) => (
    <Replay key={JSON.stringify(args)}>
      <div className="p-8">
        <AnimateOnView {...args}>
          <DemoCard label="I animate when scrolled into view" />
        </AnimateOnView>
      </div>
    </Replay>
  ),
};

export const RepeatOnView: StoryObj = {
  name: "AnimateOnView (once={false})",
  render: () => (
    <div className="w-[800px] mx-auto py-[60px] px-8">
      <p className="mb-8 text-center text-sm text-muted">
        Scroll the card out of view and back — with{" "}
        <code>once={"{false}"}</code> it re-animates every time it re-enters,
        unlike the default.
      </p>
      <div className="h-[120vh]" aria-hidden />
      <AnimateOnView once={false} from="up" blur scale distance={40}>
        <DemoCard
          label="I re-animate every time I scroll into view"
          color="var(--wave-teal-500)"
        />
      </AnimateOnView>
      <div className="h-[80vh]" aria-hidden />
    </div>
  ),
};

export const BlurEntrance: StoryObj = {
  name: "Blur",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn blur>
          <DemoCard label="Default blur (8px)" color="var(--wave-teal-500)" />
        </AnimateIn>
        <AnimateIn blur={20} delay={0.2}>
          <DemoCard label="Heavy blur (20px)" color="var(--wave-teal-500)" />
        </AnimateIn>
        <AnimateIn blur={4} delay={0.4}>
          <DemoCard label="Subtle blur (4px)" color="var(--wave-blue-500)" />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const ScaleEntrance: StoryObj = {
  name: "Scale",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn scale>
          <DemoCard label="Scale + slide" color="var(--wave-purple-500)" />
        </AnimateIn>
        <AnimateIn scale distance={0} delay={0.2}>
          <DemoCard
            label="Scale only (no slide)"
            color="var(--wave-purple-500)"
          />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const RotateEntrance: StoryObj = {
  name: "Rotate",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn rotate={-12}>
          <DemoCard label="Rotate -12°" color="var(--wave-orange-500)" />
        </AnimateIn>
        <AnimateIn rotate={8} delay={0.2}>
          <DemoCard label="Rotate 8°" color="var(--wave-orange-500)" />
        </AnimateIn>
        <AnimateIn rotate={-45} scale delay={0.4}>
          <DemoCard label="Rotate -45° + scale" color="var(--wave-red-500)" />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const FlipEntrance: StoryObj = {
  name: "Flip",
  render: () => (
    <Replay>
      <div className="p-8 grid grid-cols-2 gap-4">
        <AnimateIn flip from="up">
          <DemoCard label="Flip from up" />
        </AnimateIn>
        <AnimateIn flip from="down" delay={0.15}>
          <DemoCard label="Flip from down" />
        </AnimateIn>
        <AnimateIn flip from="left" delay={0.3}>
          <DemoCard label="Flip from left" />
        </AnimateIn>
        <AnimateIn flip from="right" delay={0.45}>
          <DemoCard label="Flip from right" />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const SpringEntrance: StoryObj = {
  name: "Spring",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn spring distance={40}>
          <DemoCard label="Spring (overshoot)" color="var(--wave-green-500)" />
        </AnimateIn>
        <AnimateIn spring scale delay={0.2}>
          <DemoCard label="Spring + scale" color="var(--wave-green-500)" />
        </AnimateIn>
        <AnimateIn spring from="left" distance={60} delay={0.4}>
          <DemoCard label="Spring from left" color="var(--wave-green-500)" />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const CustomTransition: StoryObj = {
  name: "Custom Transition",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn
          distance={40}
          transition={{ duration: 0.2, ease: "ease-out" }}
        >
          <DemoCard
            label="Fast (0.2s, ease-out)"
            color="var(--wave-teal-500)"
          />
        </AnimateIn>
        <AnimateIn
          distance={40}
          transition={{ duration: 1.2, ease: "ease-in-out" }}
          delay={0.2}
        >
          <DemoCard
            label="Slow (1.2s, ease-in-out)"
            color="var(--wave-teal-500)"
          />
        </AnimateIn>
        <AnimateIn
          distance={40}
          transition={{ duration: 0.8, ease: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          delay={0.4}
        >
          <DemoCard
            label="Custom cubic-bezier easing"
            color="var(--wave-blue-500)"
          />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const ComboEntrance: StoryObj = {
  name: "Combo (Blur + Scale + Spring)",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn blur scale spring>
          <DemoCard
            label="Blur + Scale + Spring"
            color="var(--wave-indigo-500)"
          />
        </AnimateIn>
        <AnimateIn blur rotate={-8} spring delay={0.2}>
          <DemoCard
            label="Blur + Rotate + Spring"
            color="var(--wave-indigo-500)"
          />
        </AnimateIn>
        <AnimateIn blur={6} scale flip from="left" delay={0.4}>
          <DemoCard
            label="Blur + Scale + Flip"
            color="var(--wave-indigo-500)"
          />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const Directions: StoryObj = {
  name: "All Directions",
  render: () => (
    <Replay>
      <div className="p-8 grid grid-cols-2 gap-4">
        <AnimateIn from="left">
          <DemoCard label="From left" />
        </AnimateIn>
        <AnimateIn from="right">
          <DemoCard label="From right" />
        </AnimateIn>
        <AnimateIn from="up" delay={0.15}>
          <DemoCard label="From up" />
        </AnimateIn>
        <AnimateIn from="down" delay={0.15}>
          <DemoCard label="From down" />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

export const FadeOnly: StoryObj = {
  name: "Fade Only",
  render: () => (
    <Replay>
      <div className="p-8">
        <AnimateIn distance={0}>
          <DemoCard label="Pure fade, no slide" color="var(--wave-teal-500)" />
        </AnimateIn>
      </div>
    </Replay>
  ),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STAGGER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const StaggeredCards: StoryObj = {
  name: "Stagger (manual delay)",
  render: () => (
    <Replay>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            "var(--wave-red-500)",
            "var(--wave-blue-500)",
            "var(--wave-green-500)",
            "var(--wave-yellow-500)",
            "var(--wave-purple-500)",
            "var(--wave-pink-500)",
          ].map((color, i) => (
            <AnimateIn key={color} delay={i * 0.1} from="up" distance={30}>
              <DemoCard label={`Card ${i + 1}`} color={color} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </Replay>
  ),
};

export const StaggerComponent: StoryObj = {
  name: "Stagger (auto)",
  render: () => (
    <Replay>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-4">
          <Stagger interval={0.12}>
            {[
              "var(--wave-red-500)",
              "var(--wave-blue-500)",
              "var(--wave-green-500)",
              "var(--wave-yellow-500)",
              "var(--wave-purple-500)",
              "var(--wave-pink-500)",
            ].map((color, i) => (
              <AnimateIn key={color} from="up" distance={30} scale>
                <DemoCard label={`Card ${i + 1}`} color={color} />
              </AnimateIn>
            ))}
          </Stagger>
        </div>
      </div>
    </Replay>
  ),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTINUOUS ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const PulseDefault: StoryObj = {
  name: "Pulse",
  render: () => (
    <Replay>
      <div className="p-8 flex items-center gap-8 justify-center">
        <div className="flex flex-col items-center gap-3">
          <Pulse>
            <div className="size-4 rounded-full bg-success" />
          </Pulse>
          <span className="text-xs text-muted">Default</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Pulse min={0.9} max={1.1} duration={1.5}>
            <div className="size-4 rounded-full bg-danger" />
          </Pulse>
          <span className="text-xs text-muted">Dramatic</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Pulse opacity={[0.5, 1]} duration={2}>
            <div className="size-4 rounded-full bg-primary" />
          </Pulse>
          <span className="text-xs text-muted">With opacity</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Pulse min={0.95} max={1.05} opacity={[0.7, 1]}>
            <div className="rounded-md bg-(--wave-purple-500) px-4 py-2 text-sm font-medium text-white">
              Live
            </div>
          </Pulse>
          <span className="text-xs text-muted">Badge</span>
        </div>
      </div>
    </Replay>
  ),
};

export const FloatDefault: StoryObj = {
  name: "Float",
  render: () => (
    <Replay>
      <div className="p-8 flex items-center gap-8 justify-center">
        <div className="flex flex-col items-center gap-3">
          <Float>
            <DemoCard label="Gentle float" />
          </Float>
          <span className="text-xs text-muted">Default (6px)</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Float distance={12} duration={4}>
            <DemoCard label="Big float" color="var(--wave-teal-500)" />
          </Float>
          <span className="text-xs text-muted">12px, 4s</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Float distance={8} rotate={3} duration={5}>
            <DemoCard label="Float + tilt" color="var(--wave-purple-500)" />
          </Float>
          <span className="text-xs text-muted">With rotation</span>
        </div>
      </div>
    </Replay>
  ),
};

export const Paused: StoryObj = {
  name: "Paused (Pulse + Float)",
  render: () => {
    const PausedDemo = () => {
      const [paused, setPaused] = useState(false);
      return (
        <div className="w-[800px] mx-auto py-[80px] px-8 flex flex-col items-center gap-8">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? "Resume" : "Pause"}
          </Button>

          <div className="flex items-center gap-8 justify-center">
            <div className="flex flex-col items-center gap-3">
              <Pulse paused={paused} min={0.9} max={1.1}>
                <div className="size-4 rounded-full bg-success" />
              </Pulse>
              <span className="text-xs text-muted">Pulse</span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <Float paused={paused} distance={12}>
                <DemoCard label="Float" />
              </Float>
              <span className="text-xs text-muted">Float</span>
            </div>
          </div>
        </div>
      );
    };
    return <PausedDemo />;
  },
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHOWCASE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const Showcase: StoryObj = {
  name: "✦ Showcase",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-5 max-w-md mx-auto">
        <AnimateIn blur>
          <h1 className="text-3xl font-bold text-contrast text-center">
            Animation Suite
          </h1>
        </AnimateIn>

        <AnimateIn blur delay={0.15}>
          <p className="text-muted text-center text-sm">
            Every effect composable. Zero wrappers.
          </p>
        </AnimateIn>

        <AnimateIn blur scale spring delay={0.3}>
          <DemoCard
            label="Blur + Scale + Spring"
            color="var(--wave-indigo-500)"
          />
        </AnimateIn>

        <AnimateIn flip from="left" delay={0.5}>
          <DemoCard label="3D Flip from left" color="var(--wave-teal-500)" />
        </AnimateIn>

        <AnimateIn rotate={-8} spring delay={0.7}>
          <DemoCard label="Rotate + Spring" color="var(--wave-orange-500)" />
        </AnimateIn>

        <div className="grid grid-cols-3 gap-3">
          <Stagger interval={0.1} baseDelay={0.9}>
            {[
              "var(--wave-red-500)",
              "var(--wave-green-500)",
              "var(--wave-purple-500)",
            ].map((color, i) => (
              <AnimateIn key={color} from="up" scale blur>
                <DemoCard label={`${i + 1}`} color={color} />
              </AnimateIn>
            ))}
          </Stagger>
        </div>
      </div>
    </Replay>
  ),
};
