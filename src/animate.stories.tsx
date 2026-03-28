import type { Meta, StoryObj } from "@storybook/react"
import { AnimateOnView, AnimateIn } from "./animate"

const meta: Meta = {
  title: "Animation/Animate",
  tags: ["autodocs"],
  argTypes: {
    from: {
      control: "select",
      options: ["up", "down", "left", "right"],
    },
    delay: { control: { type: "number", min: 0, max: 2, step: 0.1 } },
    distance: { control: { type: "number", min: 0, max: 100, step: 5 } },
    scale: { control: "boolean" },
  },
}
export default meta

// ── Helpers ──────────────────────────────────────────────────────────

function DemoCard({ label, color }: { label: string; color: string }) {
  return (
    <div
      className="rounded-xl border border-white/10 p-6 text-center text-sm font-medium text-white"
      style={{ background: color }}
    >
      {label}
    </div>
  )
}

// ── AnimateIn ────────────────────────────────────────────────────────

export const MountAnimation: StoryObj = {
  name: "AnimateIn",
  args: { from: "up", delay: 0, distance: 20, scale: false },
  render: (args) => (
    <div key={JSON.stringify(args)} className="flex flex-col gap-4 p-8">
      <AnimateIn {...args}>
        <DemoCard label="I animate on mount" color="#1e293b" />
      </AnimateIn>
    </div>
  ),
}

// ── AnimateOnView ────────────────────────────────────────────────────

export const ScrollAnimation: StoryObj = {
  name: "AnimateOnView",
  args: { from: "up", delay: 0, distance: 20, scale: false },
  render: (args) => (
    <div key={JSON.stringify(args)} className="p-8">
      <p className="mb-4 text-sm text-neutral-400">
        Scroll down to see the animation trigger
      </p>
      <div className="h-[300px]" />
      <AnimateOnView {...args}>
        <DemoCard label="I animate when scrolled into view" color="#1e293b" />
      </AnimateOnView>
      <div className="h-[200px]" />
    </div>
  ),
}

// ── Staggered ────────────────────────────────────────────────────────

export const StaggeredCards: StoryObj = {
  name: "Staggered",
  render: () => (
    <div className="p-8">
      <p className="mb-4 text-sm text-neutral-400">
        Scroll down — cards stagger in
      </p>
      <div className="h-[300px]" />
      <div className="grid grid-cols-3 gap-4">
        {["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map(
          (color, i) => (
            <AnimateOnView key={color} delay={i * 0.1} from="up" distance={30}>
              <DemoCard label={`Card ${i + 1}`} color={color} />
            </AnimateOnView>
          ),
        )}
      </div>
      <div className="h-[200px]" />
    </div>
  ),
}

// ── Directions ───────────────────────────────────────────────────────

export const Directions: StoryObj = {
  name: "All Directions",
  render: () => (
    <div className="p-8">
      <p className="mb-4 text-sm text-neutral-400">
        Scroll down — each card comes from a different direction
      </p>
      <div className="h-[300px]" />
      <div className="grid grid-cols-2 gap-4">
        <AnimateOnView from="left">
          <DemoCard label="From left" color="#1e293b" />
        </AnimateOnView>
        <AnimateOnView from="right">
          <DemoCard label="From right" color="#1e293b" />
        </AnimateOnView>
        <AnimateOnView from="up">
          <DemoCard label="From up" color="#1e293b" />
        </AnimateOnView>
        <AnimateOnView from="down">
          <DemoCard label="From down" color="#1e293b" />
        </AnimateOnView>
      </div>
      <div className="h-[200px]" />
    </div>
  ),
}

// ── With Scale ───────────────────────────────────────────────────────

export const WithScale: StoryObj = {
  name: "With Scale",
  render: () => (
    <div key="scale" className="p-8">
      <AnimateIn from="up" scale>
        <DemoCard label="Scale + slide on mount" color="#7c3aed" />
      </AnimateIn>
    </div>
  ),
}

// ── Fade Only ────────────────────────────────────────────────────────

export const FadeOnly: StoryObj = {
  name: "Fade Only",
  render: () => (
    <div key="fade" className="p-8">
      <AnimateIn distance={0}>
        <DemoCard label="Pure fade, no slide" color="#0f766e" />
      </AnimateIn>
    </div>
  ),
}
