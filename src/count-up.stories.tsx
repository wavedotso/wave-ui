import { useState, useCallback } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { CountUp } from "./count-up"

const meta = {
  title: "Animation/CountUp",
  component: CountUp,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof CountUp>

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
      <div className="p-8 grid grid-cols-3 gap-8 text-center">
        <div>
          <CountUp to={1234}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </CountUp>
          <span className="text-sm text-neutral-400 mt-2 block">Users</span>
        </div>

        <div>
          <CountUp to={99.9} prefix="$" suffix="M" format={(n) => n.toFixed(1)}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </CountUp>
          <span className="text-sm text-neutral-400 mt-2 block">Revenue</span>
        </div>

        <div>
          <CountUp to={42069} suffix="+">
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </CountUp>
          <span className="text-sm text-neutral-400 mt-2 block">Commits</span>
        </div>
      </div>
    </Replay>
  ),
}

export const WithPrefix: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8 text-center">
        <CountUp to={249.99} prefix="$" format={(n) => n.toFixed(2)}>
          <span className="block text-5xl font-extrabold tabular-nums text-white" />
        </CountUp>
        <span className="text-sm text-neutral-400 mt-2 block">Price</span>
      </div>
    </Replay>
  ),
}

export const Percentage: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8 text-center">
        <CountUp to={99.8} suffix="%" format={(n) => n.toFixed(1)}>
          <span className="block text-5xl font-extrabold tabular-nums text-white" />
        </CountUp>
        <span className="text-sm text-neutral-400 mt-2 block">Uptime</span>
      </div>
    </Replay>
  ),
}

export const SlowCount: StoryObj = {
  name: "Slow (2s)",
  render: () => (
    <Replay>
      <div className="p-8 text-center">
        <CountUp to={100} duration={2000}>
          <span className="block text-5xl font-extrabold tabular-nums text-white" />
        </CountUp>
        <span className="text-sm text-neutral-400 mt-2 block">Slow count</span>
      </div>
    </Replay>
  ),
}
