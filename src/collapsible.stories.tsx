import type { Meta, StoryObj } from '@storybook/react-vite';

import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
import { Button } from './button';

const meta = {
  title: 'Layout/Collapsible',
  component: Collapsible,
} satisfies Meta<typeof Collapsible>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-80">
      <CollapsibleTrigger render={<Button variant="outline" className="w-full justify-between" />}>
        Toggle content
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-lg border px-4 py-3 text-sm">
        This is the collapsible content. It can contain anything you want.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-80">
      <CollapsibleTrigger render={<Button variant="outline" className="w-full justify-between" />}>
        Toggle content
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 rounded-lg border px-4 py-3 text-sm">
        This content is visible by default.
      </CollapsibleContent>
    </Collapsible>
  ),
};
