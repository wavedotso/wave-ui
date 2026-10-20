import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./resizable";

function renderGroup({
  orientation,
  disabled,
  grip,
}: {
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  grip?: boolean;
} = {}) {
  return render(
    <ResizablePanelGroup orientation={orientation}>
      <ResizablePanel>One</ResizablePanel>
      <ResizableHandle disabled={disabled} grip={grip} />
      <ResizablePanel>Two</ResizablePanel>
    </ResizablePanelGroup>,
  );
}

describe("Resizable", () => {
  it("renders a focusable separator across a horizontal group", () => {
    renderGroup();
    const handle = screen.getByRole("separator");
    expect(handle).toHaveAttribute("aria-orientation", "vertical");
    expect(handle).toHaveAttribute("tabindex", "0");
  });

  it("turns the separator horizontal in a vertical group", () => {
    renderGroup({ orientation: "vertical" });
    expect(screen.getByRole("separator")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("takes a disabled handle out of the tab order", () => {
    renderGroup({ disabled: true });
    const handle = screen.getByRole("separator");
    expect(handle).not.toHaveAttribute("tabindex");
    expect(handle).toHaveAttribute("data-separator", "disabled");
  });

  it("renders the grip only when asked", () => {
    const { container, rerender } = renderGroup();
    expect(
      container.querySelector('[data-slot="resizable-handle-grip"]'),
    ).toBeNull();
    rerender(
      <ResizablePanelGroup>
        <ResizablePanel>One</ResizablePanel>
        <ResizableHandle grip />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(
      container.querySelector('[data-slot="resizable-handle-grip"]'),
    ).not.toBeNull();
  });

  it("hands a plain ref to each part's element", () => {
    const group = createRef<HTMLDivElement>();
    const panel = createRef<HTMLDivElement>();
    const handle = createRef<HTMLDivElement>();
    render(
      <ResizablePanelGroup ref={group}>
        <ResizablePanel ref={panel}>One</ResizablePanel>
        <ResizableHandle ref={handle} />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(group.current).toHaveAttribute("data-slot", "resizable-panel-group");
    expect(panel.current).toHaveAttribute("data-slot", "resizable-panel");
    expect(handle.current).toBe(screen.getByRole("separator"));
  });

  it("carries data-slot on every part", () => {
    const { container } = renderGroup();
    expect(
      container.querySelector('[data-slot="resizable-panel-group"]'),
    ).not.toBeNull();
    expect(
      container.querySelectorAll('[data-slot="resizable-panel"]'),
    ).toHaveLength(2);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "data-slot",
      "resizable-handle",
    );
  });
});
