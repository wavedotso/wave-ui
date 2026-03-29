import { type CSSProperties, forwardRef, useState, useCallback } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { AnimateOnView, AnimateIn, Stagger, Pulse, Float } from "./animate"

const meta: Meta = {
  title: "Animation/Animate",
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
}
export default meta

// ── Helpers ──────────────────────────────────────────────────────────

const DemoCard = forwardRef<
  HTMLDivElement,
  { label: string; color: string; style?: CSSProperties }
>(({ label, color, style, ...rest }, ref) => (
  <div
    ref={ref}
    className="rounded-xl border border-white/10 p-6 text-center text-sm font-medium text-white"
    style={{ background: color, ...style }}
    {...rest}
  >
    {label}
  </div>
))
DemoCard.displayName = "DemoCard"

function Replay({ children }: { children: React.ReactNode }) {
  const [key, setKey] = useState(0)
  const replay = useCallback(() => setKey((k) => k + 1), [])

  return (
    <div className="relative w-[800px] py-[120px] flex items-center justify-center mx-auto">
      <button
        type="button"
        onClick={replay}
        className="absolute top-3 right-3 z-50 flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm border border-white/10 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
        aria-label="Replay animation"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M2 8a6 6 0 0 1 10.3-4.2L11 5h4V1l-1.7 1.7A8 8 0 1 0 16 8h-2a6 6 0 0 1-12 0Z" fill="currentColor" />
        </svg>
        Replay
      </button>
      <div key={key} className="w-full max-w-2xl">{children}</div>
    </div>
  )
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ENTRANCE ANIMATIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const MountAnimation: StoryObj = {
  name: "AnimateIn",
  args: { from: "down", delay: 0, distance: 20, scale: false, blur: false, rotate: 0, flip: false, spring: false },
  render: (args) => (
    <Replay key={JSON.stringify(args)}>
      <div className="p-8">
        <AnimateIn {...args}>
          <DemoCard label="I animate on mount" color="#1e293b" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const OnViewAnimation: StoryObj = {
  name: "AnimateOnView",
  args: { from: "down", delay: 0, distance: 20, scale: false, blur: false, rotate: 0, flip: false, spring: false },
  render: (args) => (
    <Replay key={JSON.stringify(args)}>
      <div className="p-8">
        <AnimateOnView {...args}>
          <DemoCard label="I animate when scrolled into view" color="#1e293b" />
        </AnimateOnView>
      </div>
    </Replay>
  ),
}

export const BlurEntrance: StoryObj = {
  name: "Blur",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn blur>
          <DemoCard label="Default blur (10px)" color="#0f766e" />
        </AnimateIn>
        <AnimateIn blur={20} delay={0.2}>
          <DemoCard label="Heavy blur (20px)" color="#0e7490" />
        </AnimateIn>
        <AnimateIn blur={4} delay={0.4}>
          <DemoCard label="Subtle blur (4px)" color="#0369a1" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const ScaleEntrance: StoryObj = {
  name: "Scale",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn scale>
          <DemoCard label="Scale + slide" color="#7c3aed" />
        </AnimateIn>
        <AnimateIn scale distance={0} delay={0.2}>
          <DemoCard label="Scale only (no slide)" color="#6d28d9" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const RotateEntrance: StoryObj = {
  name: "Rotate",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn rotate={-12}>
          <DemoCard label="Rotate -12°" color="#b45309" />
        </AnimateIn>
        <AnimateIn rotate={8} delay={0.2}>
          <DemoCard label="Rotate 8°" color="#c2410c" />
        </AnimateIn>
        <AnimateIn rotate={-45} scale delay={0.4}>
          <DemoCard label="Rotate -45° + scale" color="#9f1239" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const FlipEntrance: StoryObj = {
  name: "Flip",
  render: () => (
    <Replay>
      <div className="p-8 grid grid-cols-2 gap-4">
        <AnimateIn flip from="up">
          <DemoCard label="Flip from up" color="#1e293b" />
        </AnimateIn>
        <AnimateIn flip from="down" delay={0.15}>
          <DemoCard label="Flip from down" color="#1e293b" />
        </AnimateIn>
        <AnimateIn flip from="left" delay={0.3}>
          <DemoCard label="Flip from left" color="#1e293b" />
        </AnimateIn>
        <AnimateIn flip from="right" delay={0.45}>
          <DemoCard label="Flip from right" color="#1e293b" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const SpringEntrance: StoryObj = {
  name: "Spring",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn spring distance={40}>
          <DemoCard label="Spring (overshoot)" color="#059669" />
        </AnimateIn>
        <AnimateIn spring scale delay={0.2}>
          <DemoCard label="Spring + scale" color="#047857" />
        </AnimateIn>
        <AnimateIn spring from="left" distance={60} delay={0.4}>
          <DemoCard label="Spring from left" color="#065f46" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const ComboEntrance: StoryObj = {
  name: "Combo (Blur + Scale + Spring)",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-4">
        <AnimateIn blur scale spring>
          <DemoCard label="Blur + Scale + Spring" color="#4f46e5" />
        </AnimateIn>
        <AnimateIn blur rotate={-8} spring delay={0.2}>
          <DemoCard label="Blur + Rotate + Spring" color="#4338ca" />
        </AnimateIn>
        <AnimateIn blur={6} scale flip from="left" delay={0.4}>
          <DemoCard label="Blur + Scale + Flip" color="#3730a3" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const Directions: StoryObj = {
  name: "All Directions",
  render: () => (
    <Replay>
      <div className="p-8 grid grid-cols-2 gap-4">
        <AnimateIn from="left">
          <DemoCard label="From left" color="#1e293b" />
        </AnimateIn>
        <AnimateIn from="right">
          <DemoCard label="From right" color="#1e293b" />
        </AnimateIn>
        <AnimateIn from="up" delay={0.15}>
          <DemoCard label="From up" color="#1e293b" />
        </AnimateIn>
        <AnimateIn from="down" delay={0.15}>
          <DemoCard label="From down" color="#1e293b" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

export const FadeOnly: StoryObj = {
  name: "Fade Only",
  render: () => (
    <Replay>
      <div className="p-8">
        <AnimateIn distance={0}>
          <DemoCard label="Pure fade, no slide" color="#0f766e" />
        </AnimateIn>
      </div>
    </Replay>
  ),
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STAGGER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const StaggeredCards: StoryObj = {
  name: "Stagger (manual delay)",
  render: () => (
    <Replay>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-4">
          {["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map(
            (color, i) => (
              <AnimateIn key={color} delay={i * 0.1} from="up" distance={30}>
                <DemoCard label={`Card ${i + 1}`} color={color} />
              </AnimateIn>
            ),
          )}
        </div>
      </div>
    </Replay>
  ),
}

export const StaggerComponent: StoryObj = {
  name: "Stagger (auto)",
  render: () => (
    <Replay>
      <div className="p-8">
        <div className="grid grid-cols-3 gap-4">
          <Stagger interval={0.12}>
            {["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map(
              (color, i) => (
                <AnimateIn key={color} from="up" distance={30} scale>
                  <DemoCard label={`Card ${i + 1}`} color={color} />
                </AnimateIn>
              ),
            )}
          </Stagger>
        </div>
      </div>
    </Replay>
  ),
}

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
            <div className="size-4 rounded-full bg-green-500" />
          </Pulse>
          <span className="text-xs text-neutral-400">Default</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Pulse min={0.9} max={1.1} duration={1.5}>
            <div className="size-4 rounded-full bg-red-500" />
          </Pulse>
          <span className="text-xs text-neutral-400">Dramatic</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Pulse opacity={[0.5, 1]} duration={2}>
            <div className="size-4 rounded-full bg-blue-500" />
          </Pulse>
          <span className="text-xs text-neutral-400">With opacity</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Pulse min={0.95} max={1.05} opacity={[0.7, 1]}>
            <div className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white">
              Live
            </div>
          </Pulse>
          <span className="text-xs text-neutral-400">Badge</span>
        </div>
      </div>
    </Replay>
  ),
}

export const FloatDefault: StoryObj = {
  name: "Float",
  render: () => (
    <Replay>
      <div className="p-8 flex items-center gap-8 justify-center">
        <div className="flex flex-col items-center gap-3">
          <Float>
            <DemoCard label="Gentle float" color="#1e293b" />
          </Float>
          <span className="text-xs text-neutral-400">Default (6px)</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Float distance={12} duration={4}>
            <DemoCard label="Big float" color="#0f766e" />
          </Float>
          <span className="text-xs text-neutral-400">12px, 4s</span>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Float distance={8} rotate={3} duration={5}>
            <DemoCard label="Float + tilt" color="#7c3aed" />
          </Float>
          <span className="text-xs text-neutral-400">With rotation</span>
        </div>
      </div>
    </Replay>
  ),
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHOWCASE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const Showcase: StoryObj = {
  name: "✦ Showcase",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-5 max-w-md mx-auto">
        <AnimateIn blur>
          <h1 className="text-3xl font-bold text-white text-center">
            Animation Suite
          </h1>
        </AnimateIn>

        <AnimateIn blur delay={0.15}>
          <p className="text-neutral-400 text-center text-sm">
            Every effect composable. Zero wrappers.
          </p>
        </AnimateIn>

        <AnimateIn blur scale spring delay={0.3}>
          <DemoCard label="Blur + Scale + Spring" color="#4f46e5" />
        </AnimateIn>

        <AnimateIn flip from="left" delay={0.5}>
          <DemoCard label="3D Flip from left" color="#0891b2" />
        </AnimateIn>

        <AnimateIn rotate={-8} spring delay={0.7}>
          <DemoCard label="Rotate + Spring" color="#b45309" />
        </AnimateIn>

        <div className="grid grid-cols-3 gap-3">
          <Stagger interval={0.1} baseDelay={0.9}>
            {["#ef4444", "#10b981", "#8b5cf6"].map((color, i) => (
              <AnimateIn key={color} from="up" scale blur>
                <DemoCard label={`${i + 1}`} color={color} />
              </AnimateIn>
            ))}
          </Stagger>
        </div>
      </div>
    </Replay>
  ),
}
