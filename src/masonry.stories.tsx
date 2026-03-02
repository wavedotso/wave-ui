import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Masonry, MasonryItem } from './masonry'
import { InfiniteScroll } from './infinite-scroll'
import { TrashIcon } from './lib/internal-icons'

const meta = {
  title: 'Layout/Masonry',
  component: Masonry,
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Masonry>

export default meta
type Story = StoryObj<typeof meta>

const HEIGHTS = [120, 180, 100, 150, 200, 110, 160, 220, 130, 90, 190, 140]

const COLORS = [
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#0ea5e9",
  "#8b5cf6",
  "#d946ef",
  "#f97316",
  "#14b8a6",
  "#6366f1",
  "#ec4899",
  "#84cc16",
  "#06b6d4",
]

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function DemoCard({ index, height }: { index: number; height: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl shadow-sm"
      style={{ height, backgroundColor: hexToRgba(COLORS[index % COLORS.length]!, 0.4) }}
    >
      <span className="text-sm font-semibold text-foreground">
        {index + 1}
      </span>
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <Masonry columnWidth={320} gap={4} className="w-full">
      {Array.from({ length: 12 }, (_, i) => (
        <MasonryItem key={i}>
          <DemoCard index={i} height={HEIGHTS[i % HEIGHTS.length]!} />
        </MasonryItem>
      ))}
    </Masonry>
  ),
}

export const FixedColumns: Story = {
  render: () => (
    <Masonry columns={2} gap={4} className="w-full">
      {Array.from({ length: 8 }, (_, i) => (
        <MasonryItem key={i}>
          <DemoCard index={i} height={HEIGHTS[i % HEIGHTS.length]!} />
        </MasonryItem>
      ))}
    </Masonry>
  ),
}

export const Responsive: Story = {
  render: () => (
    <Masonry columnWidth={240} gap={4} className="w-full">
      {Array.from({ length: 16 }, (_, i) => (
        <MasonryItem key={i}>
          <DemoCard index={i} height={HEIGHTS[i % HEIGHTS.length]!} />
        </MasonryItem>
      ))}
    </Masonry>
  ),
}

export const WithPromoted: Story = {
  render: () => (
    <Masonry columns={4} gap={4} className="w-full">
      {/* Promoted items — pinned at the top, span multiple columns */}
      <MasonryItem span={2}>
        <div className="flex items-center justify-center rounded-xl border-2 border-primary/30 bg-primary/5 shadow-sm" style={{ height: 200 }}>
          <span className="text-sm font-semibold text-primary">Featured</span>
        </div>
      </MasonryItem>
      <MasonryItem span={2}>
        <div className="flex items-center justify-center rounded-xl border-2 border-amber-500/30 bg-amber-500/5 shadow-sm" style={{ height: 160 }}>
          <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Promoted</span>
        </div>
      </MasonryItem>

      {/* Regular items — flow below organically */}
      {Array.from({ length: 16 }, (_, i) => (
        <MasonryItem key={i}>
          <DemoCard index={i} height={HEIGHTS[i % HEIGHTS.length]!} />
        </MasonryItem>
      ))}
    </Masonry>
  ),
}

export const CustomGap: Story = {
  render: () => (
    <Masonry columnWidth={320} gap={2} className="w-full">
      {Array.from({ length: 12 }, (_, i) => (
        <MasonryItem key={i}>
          <DemoCard index={i} height={HEIGHTS[i % HEIGHTS.length]!} />
        </MasonryItem>
      ))}
    </Masonry>
  ),
}

function RemovableDemo() {
  const [items, setItems] = React.useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      height: HEIGHTS[i % HEIGHTS.length]!,
    }))
  )

  function handleRemove(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <Masonry columnWidth={320} gap={4} className="w-full">
      {items.map((item) => (
        <MasonryItem key={item.id}>
          <button
            type="button"
            onClick={() => handleRemove(item.id)}
            className="flex w-full flex-col items-center justify-center rounded-xl shadow-sm cursor-pointer"
            style={{
              height: item.height,
              backgroundColor: hexToRgba(COLORS[item.id % COLORS.length]!, 0.4),
            }}
          >
            <span className="text-sm font-semibold text-foreground">
              {item.id + 1}
            </span>
            <span className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrashIcon width={12} height={12} aria-hidden />
              Click to remove
            </span>
          </button>
        </MasonryItem>
      ))}
    </Masonry>
  )
}

export const WithRemovable: Story = {
  render: () => <RemovableDemo />,
}

function InfiniteScrollDemo() {
  const BATCH = 30
  const [items, setItems] = React.useState(() =>
    Array.from({ length: BATCH }, (_, i) => ({
      id: i,
      height: HEIGHTS[i % HEIGHTS.length]!,
    }))
  )
  const [hasMore, setHasMore] = React.useState(true)
  const [isLoading, setIsLoading] = React.useState(false)

  const loadMore = React.useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setItems((prev) => {
        const next = Array.from({ length: BATCH }, (_, i) => ({
          id: prev.length + i,
          height: HEIGHTS[(prev.length + i) % HEIGHTS.length]!,
        }))
        const all = [...prev, ...next]
        if (all.length >= 300) setHasMore(false)
        return all
      })
      setIsLoading(false)
    }, 600)
  }, [])

  return (
    <InfiniteScroll
      onLoadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
      loader={
        <p className="py-4 text-center text-sm text-muted-foreground">
          Loading more cards...
        </p>
      }
      endMessage={
        <p className="py-4 text-center text-sm text-muted-foreground">
          All 300 cards loaded.
        </p>
      }
    >
      <Masonry columnWidth={280} gap={4} className="w-full">
        {items.map((item) => (
          <MasonryItem key={item.id}>
            <DemoCard index={item.id} height={item.height} />
          </MasonryItem>
        ))}
      </Masonry>
    </InfiniteScroll>
  )
}

export const WithInfiniteScroll: Story = {
  render: () => <InfiniteScrollDemo />,
}
