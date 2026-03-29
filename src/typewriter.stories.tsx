import { useState, useCallback } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Typewriter } from "./typewriter"

const meta = {
  title: "Animation/Typewriter",
  component: Typewriter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Typewriter>

export default meta

// ── Helpers ──────────────────────────────────────────────────────────

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

// ── Stories ──────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-6">
        <Typewriter text="Welcome to the future." speed={0.05}>
          <h1 className="text-3xl font-bold text-white" />
        </Typewriter>

        <Typewriter text="Built for builders, by builders." speed={0.04} delay={1.2}>
          <p className="text-lg text-neutral-400" />
        </Typewriter>

        <Typewriter text="No cursor here." cursor={false} delay={2.5} speed={0.03}>
          <p className="text-sm text-neutral-500" />
        </Typewriter>
      </div>
    </Replay>
  ),
}

export const FastTyping: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter text="This types really fast!" speed={0.02}>
          <h2 className="text-2xl font-semibold text-white" />
        </Typewriter>
      </div>
    </Replay>
  ),
}

export const SlowTyping: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter text="Slow and dramatic..." speed={0.12}>
          <h2 className="text-2xl font-semibold text-white" />
        </Typewriter>
      </div>
    </Replay>
  ),
}

export const CustomCursor: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter text="Custom cursor character" cursorChar="▋" speed={0.05}>
          <p className="text-lg font-mono text-green-400" />
        </Typewriter>
      </div>
    </Replay>
  ),
}

export const NoCursor: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter text="No cursor, just text appearing." cursor={false} speed={0.04}>
          <p className="text-lg text-white" />
        </Typewriter>
      </div>
    </Replay>
  ),
}
