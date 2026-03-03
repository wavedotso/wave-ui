import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  PreviewCard,
  PreviewCardContent,
  PreviewCardTrigger,
} from './preview-card'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'

const meta = {
  title: 'Overlay/PreviewCard',
  component: PreviewCard,
} satisfies Meta<typeof PreviewCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger>
        <a
          href="https://wave.so"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          @wave
        </a>
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage src="/logomark.svg" alt="Wave" />
            <AvatarFallback>W</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">Wave</p>
            <p className="text-muted-foreground text-xs">
              Make a wave in the internet.
            </p>
          </div>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  ),
}

export const SideTop: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger>
        <a
          href="https://github.com/anthropics"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          @anthropic
        </a>
      </PreviewCardTrigger>
      <PreviewCardContent side="top">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage src="/anthropic-avatar.jpg" alt="Anthropic" />
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">Anthropic</p>
            <p className="text-muted-foreground text-xs">AI safety company.</p>
          </div>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  ),
}

export const SideRight: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger>
        <a
          href="https://github.com/vercel"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          @vercel
        </a>
      </PreviewCardTrigger>
      <PreviewCardContent side="right">
        <div className="flex gap-3">
          <Avatar className="size-10">
            <AvatarImage src="/vercel-avatar.png" alt="Vercel" />
            <AvatarFallback>V</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">Vercel</p>
            <p className="text-muted-foreground text-xs">
              Develop. Preview. Ship.
            </p>
          </div>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  ),
}

export const RichContent: Story = {
  render: () => (
    <PreviewCard>
      <PreviewCardTrigger>
        <a
          href="https://x.com/claudeai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-4"
        >
          @claudeai
        </a>
      </PreviewCardTrigger>
      <PreviewCardContent className="w-80">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-12">
              <AvatarImage src="/claude-avatar.jpg" alt="Claude" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold">Claude</p>
              <p className="text-muted-foreground text-xs">@claudeai</p>
            </div>
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed">
            AI assistant by Anthropic. Helpful, harmless, and honest. Your favorite coding partner.
          </p>
          <div className="flex gap-4 text-xs">
            <span>
              <span className="font-semibold">1</span>{' '}
              <span className="text-muted-foreground">Following</span>
            </span>
            <span>
              <span className="font-semibold">617.8K</span>{' '}
              <span className="text-muted-foreground">Followers</span>
            </span>
          </div>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  ),
}
