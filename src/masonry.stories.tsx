import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Masonry, MasonryItem } from './masonry'
import { InfiniteScroll } from './infinite-scroll'

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
  "bg-blue-100 dark:bg-blue-900/30",
  "bg-amber-100 dark:bg-amber-900/30",
  "bg-emerald-100 dark:bg-emerald-900/30",
  "bg-violet-100 dark:bg-violet-900/30",
  "bg-rose-100 dark:bg-rose-900/30",
  "bg-cyan-100 dark:bg-cyan-900/30",
]

function DemoCard({ index, height }: { index: number; height: number }) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border shadow-sm ${COLORS[index % COLORS.length]}`}
      style={{ height }}
    >
      <span className="text-xs font-medium text-muted-foreground">
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

export const DenseGap: Story = {
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

export const WideGap: Story = {
  render: () => (
    <Masonry columnWidth={320} gap={8} className="w-full">
      {Array.from({ length: 12 }, (_, i) => (
        <MasonryItem key={i}>
          <DemoCard index={i} height={HEIGHTS[i % HEIGHTS.length]!} />
        </MasonryItem>
      ))}
    </Masonry>
  ),
}

function SpanDemoCard({
  index,
  height,
  span,
}: {
  index: number
  height: number
  span: number
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border shadow-sm ${COLORS[index % COLORS.length]}`}
      style={{ height }}
    >
      <span className="text-sm font-semibold text-muted-foreground">
        {span > 1 ? `span ${span}` : index + 1}
      </span>
    </div>
  )
}

export const WithSpanning: Story = {
  render: () => (
    <Masonry columns={4} gap={4} className="w-full">
      <MasonryItem>
        <SpanDemoCard index={0} height={160} span={1} />
      </MasonryItem>
      <MasonryItem span={2}>
        <SpanDemoCard index={1} height={140} span={2} />
      </MasonryItem>
      <MasonryItem>
        <SpanDemoCard index={2} height={200} span={1} />
      </MasonryItem>
      <MasonryItem>
        <SpanDemoCard index={3} height={120} span={1} />
      </MasonryItem>
      <MasonryItem>
        <SpanDemoCard index={4} height={180} span={1} />
      </MasonryItem>
      <MasonryItem span={3}>
        <SpanDemoCard index={5} height={160} span={3} />
      </MasonryItem>
      <MasonryItem>
        <SpanDemoCard index={6} height={150} span={1} />
      </MasonryItem>
      <MasonryItem>
        <SpanDemoCard index={7} height={190} span={1} />
      </MasonryItem>
      <MasonryItem span={2}>
        <SpanDemoCard index={8} height={130} span={2} />
      </MasonryItem>
      <MasonryItem>
        <SpanDemoCard index={9} height={170} span={1} />
      </MasonryItem>
      <MasonryItem>
        <SpanDemoCard index={10} height={110} span={1} />
      </MasonryItem>
      <MasonryItem span={4}>
        <SpanDemoCard index={11} height={120} span={4} />
      </MasonryItem>
    </Masonry>
  ),
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
