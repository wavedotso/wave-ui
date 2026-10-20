import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

const meta = {
  title: "Layout/Resizable",
  component: ResizablePanelGroup,
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

// The group fills its parent, so the frame carries the size.
const frame = "h-64 w-[480px] overflow-hidden rounded-lg border border-line";
const panel = "flex items-center justify-center p-6 text-sm font-medium";

/** Drag the line, or focus it with Tab and use the arrow keys. */
export const Default: Story = {
  render: () => (
    <div className={frame}>
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="30%" className={panel}>
          Sidebar
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className={panel}>Content</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className={frame}>
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="30%" className={panel}>
          Header
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className={panel}>Content</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** `grip` adds a visible hint that the line can be dragged. */
export const WithGrip: Story = {
  render: () => (
    <div className={frame}>
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="30%" className={panel}>
          Sidebar
        </ResizablePanel>
        <ResizableHandle grip />
        <ResizablePanel className={panel}>Content</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** Groups nest: a vertical group inside a horizontal one. */
export const Nested: Story = {
  render: () => (
    <div className={frame}>
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="50%" className={panel}>
          One
        </ResizablePanel>
        <ResizableHandle grip />
        <ResizablePanel>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="25%" className={panel}>
              Two
            </ResizablePanel>
            <ResizableHandle grip />
            <ResizablePanel className={panel}>Three</ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/**
 * Drag the sidebar past its minimum and it collapses. With the handle
 * focused, Enter collapses and expands it; double-clicking the handle
 * restores the default size.
 */
export const Collapsible: Story = {
  render: () => (
    <div className={frame}>
      <ResizablePanelGroup>
        <ResizablePanel
          defaultSize="30%"
          minSize="20%"
          collapsible
          className={panel}
        >
          Sidebar
        </ResizablePanel>
        <ResizableHandle grip />
        <ResizablePanel className={panel}>Content</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

/** A disabled handle keeps the line but can't be dragged or focused. */
export const Disabled: Story = {
  render: () => (
    <div className={frame}>
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="30%" className={panel}>
          Sidebar
        </ResizablePanel>
        <ResizableHandle grip disabled />
        <ResizablePanel className={panel}>Content</ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
