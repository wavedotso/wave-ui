import { useState, useCallback, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { InfiniteScroll } from './infinite-scroll';

const meta = {
  title: 'Utilities/InfiniteScroll',
  component: InfiniteScroll,
} satisfies Meta<typeof InfiniteScroll>;

export default meta;
type Story = StoryObj<typeof meta>;

function generateItems(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: start + i,
    title: `Item ${start + i + 1}`,
  }));
}

function generateMessages(start: number, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: start - i,
    text: `Message ${start - i}`,
    time: `${9 + Math.floor((start - i) / 4)}:${String((start - i) % 4 * 15).padStart(2, '0')}`,
  }));
}

function InfiniteScrollDemo() {
  const [items, setItems] = useState(() => generateItems(0, 20));
  const [isLoading, setIsLoading] = useState(false);
  const hasMore = items.length < 100;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...generateItems(prev.length, 20)]);
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="border-border h-96 w-80 overflow-y-auto rounded-lg border">
      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        endMessage="You've reached the end!"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="border-border border-b px-4 py-3 text-sm"
          >
            {item.title}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export const Default: Story = {
  render: () => <InfiniteScrollDemo />,
};

function WithRootDemo() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(() => generateItems(0, 15));
  const [isLoading, setIsLoading] = useState(false);
  const hasMore = items.length < 60;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...generateItems(prev.length, 15)]);
      setIsLoading(false);
    }, 800);
  }, []);

  return (
    <div
      ref={scrollRef}
      className="border-border h-96 w-80 overflow-y-auto rounded-lg border"
    >
      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        root={scrollRef}
        endMessage="All items loaded."
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="border-border border-b px-4 py-3 text-sm"
          >
            {item.title}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export const WithRoot: Story = {
  render: () => <WithRootDemo />,
};

function ReverseDemo() {
  const [messages, setMessages] = useState(() => generateMessages(50, 20));
  const [isLoading, setIsLoading] = useState(false);
  const oldest = messages[0]?.id ?? 0;
  const hasMore = oldest > 1;

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMessages((prev) => {
        const oldestId = prev[0]?.id ?? 0;
        const count = Math.min(20, oldestId - 1);
        return [...generateMessages(oldestId - 1, count), ...prev];
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="border-border flex h-96 w-80 flex-col-reverse overflow-y-auto rounded-lg border">
      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={hasMore}
        isLoading={isLoading}
        direction="up"
        endMessage="Beginning of conversation"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="border-border border-b px-4 py-3 text-sm"
          >
            <span className="text-muted-foreground mr-2 text-xs">{msg.time}</span>
            {msg.text}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export const Reverse: Story = {
  render: () => <ReverseDemo />,
};

function CustomLoaderDemo() {
  const [items, setItems] = useState(() => generateItems(0, 10));
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, ...generateItems(prev.length, 10)]);
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="border-border h-96 w-80 overflow-y-auto rounded-lg border">
      <InfiniteScroll
        onLoadMore={handleLoadMore}
        hasMore={items.length < 50}
        isLoading={isLoading}
        loader={
          <span className="text-muted-foreground text-sm">Loading more...</span>
        }
        endMessage="No more items to load."
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="border-border border-b px-4 py-3 text-sm"
          >
            {item.title}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export const CustomLoader: Story = {
  render: () => <CustomLoaderDemo />,
};
