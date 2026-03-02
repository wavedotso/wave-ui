import { useState, useCallback } from 'react';
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
