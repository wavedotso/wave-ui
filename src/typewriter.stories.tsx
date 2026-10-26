import { useState, useCallback } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Typewriter } from "./typewriter";

const meta = {
  title: "Effects/Typewriter",
  component: Typewriter,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof Typewriter>;

export default meta;

// ── Helpers ──────────────────────────────────────────────────────────

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

// ── Stories ──────────────────────────────────────────────────────────

export const Default: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-6">
        <Typewriter text="Welcome to the future." speed={0.05}>
          <h1 className="text-3xl font-bold text-contrast" />
        </Typewriter>

        <Typewriter
          text="Built for builders, by builders."
          speed={0.04}
          delay={1.2}
        >
          <p className="text-lg text-muted" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

export const StyledSegments: StoryObj = {
  name: "Per-word Styling",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-6">
        <Typewriter
          text={[
            { text: "Build on " },
            { text: "Intuition", className: "text-primary font-extrabold" },
          ]}
          speed={0.06}
        >
          <h1 className="text-4xl font-bold text-contrast" />
        </Typewriter>

        <Typewriter
          text={[
            { text: "Ship " },
            { text: "fast", className: "text-success italic" },
            { text: ", break " },
            { text: "nothing", className: "text-danger line-through" },
            { text: "." },
          ]}
          speed={0.05}
          delay={1.5}
        >
          <p className="text-xl text-muted" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

export const SmoothReveal: StoryObj = {
  name: "Smooth Reveal",
  render: () => (
    <Replay>
      <div className="p-8 flex flex-col gap-6">
        <Typewriter
          text="Cinematic sliding reveal."
          variant="smooth"
          smoothDuration={1.5}
        >
          <h1 className="text-4xl font-bold text-contrast" />
        </Typewriter>

        <Typewriter
          text="Like a curtain opening."
          variant="smooth"
          smoothDuration={2}
          delay={2}
        >
          <p className="text-lg text-muted" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

export const SmoothWithSegments: StoryObj = {
  name: "Smooth + Styled",
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter
          text={[
            { text: "Welcome to " },
            { text: "wave-ui", className: "text-primary font-extrabold" },
          ]}
          variant="smooth"
          smoothDuration={1.8}
        >
          <h1 className="text-4xl font-bold text-contrast" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

export const FastTyping: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter text="This types really fast!" speed={0.02}>
          <h2 className="text-2xl font-semibold text-contrast" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

export const SlowTyping: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter text="Slow and dramatic..." speed={0.12}>
          <h2 className="text-2xl font-semibold text-contrast" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

export const CustomCursor: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter text="Custom cursor character" cursorChar="▋" speed={0.05}>
          <p className="text-lg font-mono text-success" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

export const NoCursor: StoryObj = {
  render: () => (
    <Replay>
      <div className="p-8">
        <Typewriter
          text="No cursor, just text appearing."
          cursor={false}
          speed={0.04}
        >
          <p className="text-lg text-contrast" />
        </Typewriter>
      </div>
    </Replay>
  ),
};

// A tall scroll region: the Typewriter sits below the fold so `onView`
// holds the reveal until it scrolls into view.
function ScrollStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100vh] overflow-y-auto">
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-medium text-contrast">Scroll down ↓</p>
        <p className="text-sm text-muted">
          The heading below stays hidden until it enters the viewport.
        </p>
      </div>
      <div className="flex min-h-[80vh] items-center justify-center p-8">
        {children}
      </div>
    </div>
  );
}

export const OnView: StoryObj = {
  name: "On View (scroll trigger)",
  render: () => (
    <ScrollStage>
      <Typewriter text="Typed when you scrolled here." onView speed={0.05}>
        <h1 className="text-4xl font-bold text-contrast" />
      </Typewriter>
    </ScrollStage>
  ),
};

export const OnViewReplay: StoryObj = {
  name: "On View — Replay (once={false})",
  render: () => (
    <div className="h-[100vh] overflow-y-auto">
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3 text-center">
        <p className="text-lg font-medium text-contrast">Scroll down ↓</p>
        <p className="text-sm text-muted">
          Scroll the heading out of view and back — it replays each time.
        </p>
      </div>
      <div className="flex min-h-[80vh] items-center justify-center p-8">
        <Typewriter
          text="I replay every re-entry."
          onView
          once={false}
          speed={0.05}
        >
          <h1 className="text-4xl font-bold text-contrast" />
        </Typewriter>
      </div>
      <div className="flex h-[80vh] items-center justify-center text-sm text-muted">
        Keep scrolling, then scroll back up.
      </div>
    </div>
  ),
};
