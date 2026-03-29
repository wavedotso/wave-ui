import { useState, useCallback } from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { Count } from "./count"

const meta = {
  title: "Animation/Count",
  component: Count,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Count>

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

// ── Count Up ─────────────────────────────────────────────────────────

export const CountUpDefault: StoryObj = {
  name: "Count Up",
  render: () => (
    <Replay>
      <div className="p-8 grid grid-cols-3 gap-8 text-center">
        <div>
          <Count to={1234}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Users</span>
        </div>

        <div>
          <Count to={99.9} prefix="$" suffix="M" format={(n) => n.toFixed(1)}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Revenue</span>
        </div>

        <div>
          <Count to={42069} suffix="+">
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Commits</span>
        </div>
      </div>
    </Replay>
  ),
}

// ── Count Down ───────────────────────────────────────────────────────

export const CountDown: StoryObj = {
  name: "Count Down",
  render: () => (
    <Replay>
      <div className="p-8 grid grid-cols-3 gap-8 text-center">
        <div>
          <Count from={100} to={0}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Countdown</span>
        </div>

        <div>
          <Count from={50} to={0} suffix="%" duration={2000}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Remaining</span>
        </div>

        <div>
          <Count from={999} to={0} prefix="-" duration={1500}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Draining</span>
        </div>
      </div>
    </Replay>
  ),
}

// ── Date Countdown ───────────────────────────────────────────────────

export const DateCountdown: StoryObj = {
  name: "Date Countdown (live)",
  render: () => {
    // 2 hours from now
    const twoHours = new Date(Date.now() + 2 * 60 * 60 * 1000)
    // 3 days from now
    const threeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    // 30 seconds from now
    const thirtySeconds = new Date(Date.now() + 30 * 1000)

    return (
      <Replay>
        <div className="p-8 flex flex-col gap-8 text-center">
          <div>
            <Count to={threeDays}>
              <span className="block text-4xl font-extrabold tabular-nums text-white font-mono" />
            </Count>
            <span className="text-sm text-neutral-400 mt-2 block">Proposal Deadline</span>
          </div>

          <div>
            <Count to={twoHours}>
              <span className="block text-4xl font-extrabold tabular-nums text-white font-mono" />
            </Count>
            <span className="text-sm text-neutral-400 mt-2 block">Auction Ends</span>
          </div>

          <div>
            <Count
              to={thirtySeconds}
              onComplete={() => console.log("Timer complete!")}
            >
              <span className="block text-4xl font-extrabold tabular-nums text-red-400 font-mono" />
            </Count>
            <span className="text-sm text-neutral-400 mt-2 block">Expiring Soon (30s)</span>
          </div>
        </div>
      </Replay>
    )
  },
}

// ── Custom Date Format ───────────────────────────────────────────────

export const CustomDateFormat: StoryObj = {
  name: "Custom Date Format",
  render: () => {
    const future = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)

    return (
      <Replay>
        <div className="p-8 flex flex-col gap-6 text-center">
          <div>
            <Count
              to={future}
              format={(ms) => `${Math.ceil(ms / 86400000)} days`}
            >
              <span className="block text-5xl font-extrabold text-white" />
            </Count>
            <span className="text-sm text-neutral-400 mt-2 block">Until Launch</span>
          </div>

          <div>
            <Count
              to={future}
              format={(ms) => {
                const hours = Math.floor(ms / 3600000)
                return `${hours.toLocaleString()} hours`
              }}
            >
              <span className="block text-3xl font-bold text-neutral-300" />
            </Count>
            <span className="text-sm text-neutral-400 mt-2 block">Same deadline, different format</span>
          </div>
        </div>
      </Replay>
    )
  },
}

// ── With Prefix/Suffix ───────────────────────────────────────────────

export const Formatting: StoryObj = {
  name: "Formatting",
  render: () => (
    <Replay>
      <div className="p-8 grid grid-cols-2 gap-8 text-center">
        <div>
          <Count to={249.99} prefix="$" format={(n) => n.toFixed(2)}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Price</span>
        </div>

        <div>
          <Count to={99.8} suffix="%" format={(n) => n.toFixed(1)}>
            <span className="block text-4xl font-extrabold tabular-nums text-white" />
          </Count>
          <span className="text-sm text-neutral-400 mt-2 block">Uptime</span>
        </div>
      </div>
    </Replay>
  ),
}
