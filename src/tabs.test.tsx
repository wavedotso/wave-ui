import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function renderTabs() {
  return render(
    <Tabs defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">First</TabsTrigger>
        <TabsTrigger value="two">Second</TabsTrigger>
      </TabsList>
      <TabsContent value="one">Panel one content</TabsContent>
      <TabsContent value="two">Panel two content</TabsContent>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("shows the active panel and hides the inactive one", () => {
    renderTabs();
    // Hidden panels are unmounted (keepMounted defaults to false).
    expect(screen.getByText("Panel one content")).toBeInTheDocument();
    expect(screen.queryByText("Panel two content")).not.toBeInTheDocument();
  });

  it("switches the visible panel when another tab is clicked", async () => {
    const user = userEvent.setup();
    renderTabs();

    await user.click(screen.getByRole("tab", { name: "Second" }));

    expect(screen.getByText("Panel two content")).toBeInTheDocument();
    expect(screen.queryByText("Panel one content")).not.toBeInTheDocument();
  });

  it("marks the active tab with aria-selected", async () => {
    const user = userEvent.setup();
    renderTabs();

    expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.click(screen.getByRole("tab", { name: "Second" }));

    expect(screen.getByRole("tab", { name: "Second" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
