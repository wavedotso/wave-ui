"use client";

import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "./button";
import { toast, Toaster, type ToasterProps } from "./toast";

const meta = {
  title: "Feedback/Toast",
  component: Toaster,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

/** All toast variants including action button. */
export const Default: Story = {
  render: function Render() {
    return (
      <>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast("Event created")}>
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Success!", {
                description: "Your changes have been saved.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Error", {
                description: "Something went wrong.",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Warning", {
                description: "Approaching storage limit.",
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Info", {
                description: "A new version is available.",
              })
            }
          >
            Info
          </Button>
          <Button variant="outline" onClick={() => toast.loading("Loading…")}>
            Loading
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("File deleted", {
                description: "archive.zip was moved to trash.",
                actionProps: {
                  children: "Undo",
                  onClick: () => toast.info("Restored!"),
                },
              })
            }
          >
            With Action
          </Button>
        </div>
        <Toaster />
      </>
    );
  },
};

/** Track an async operation with loading → success / error states. */
export const WithPromise: Story = {
  render: function Render() {
    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast.promise(
                new Promise<void>((resolve) => setTimeout(resolve, 2000)),
                {
                  loading: "Saving changes…",
                  success: "Changes saved!",
                  error: "Failed to save.",
                },
              );
            }}
          >
            Save (success)
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast.promise(
                new Promise<void>((_, reject) =>
                  setTimeout(() => reject(new Error("Network error")), 2000),
                ),
                {
                  loading: "Uploading file…",
                  success: "Upload complete!",
                  error: "Upload failed.",
                },
              );
            }}
          >
            Upload (error)
          </Button>
        </div>
        <Toaster />
      </>
    );
  },
};

/** Toaster positioned at different corners and edges. */
export const Positions: Story = {
  render: function Render() {
    type Position = NonNullable<ToasterProps["position"]>;
    const positions: Position[] = [
      "top-left",
      "top-center",
      "top-right",
      "bottom-left",
      "bottom-center",
      "bottom-right",
    ];
    const [active, setActive] = React.useState<Position>("bottom-right");

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {positions.map((pos) => (
            <Button
              key={pos}
              variant={pos === active ? "default" : "outline"}
              onClick={() => {
                setActive(pos);
                toast.info(pos, {
                  description: `Toasts now appear at ${pos}.`,
                });
              }}
            >
              {pos}
            </Button>
          ))}
        </div>
        <Toaster position={active} />
      </>
    );
  },
};

/**
 * `limit` caps how many toasts are visible at once. Extras are queued and
 * promoted as visible ones are dismissed. Fire the burst to watch the stack
 * hold at three.
 */
export const Limit: Story = {
  render: function Render() {
    const counter = React.useRef(0);

    return (
      <>
        <Button
          variant="outline"
          onClick={() => {
            for (let i = 0; i < 6; i++) {
              counter.current += 1;
              const n = counter.current;
              toast.info(`Notification ${n}`, {
                description: "Only three stay on screen; the rest queue.",
              });
            }
          }}
        >
          Fire 6 toasts
        </Button>
        <Toaster limit={3} />
      </>
    );
  },
};

/**
 * `timeout` sets the default auto-dismiss delay (in ms) for every toast.
 * Here it is shortened to 2s. Pass `timeout: 0` on an individual toast to make
 * it persist until dismissed.
 */
export const Timeout: Story = {
  render: function Render() {
    return (
      <>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Auto-dismiss", {
                description: "This toast disappears after 2 seconds.",
              })
            }
          >
            2s timeout
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Persistent", {
                description: "This toast stays until you close it.",
                timeout: 0,
              })
            }
          >
            Persistent (timeout: 0)
          </Button>
        </div>
        <Toaster timeout={2000} />
      </>
    );
  },
};

/**
 * Capture the id returned when a toast is created, then mutate it in place with
 * `toast.update` or remove it with `toast.dismiss` — the pattern behind
 * loading → resolved flows.
 */
export const UpdateAndDismiss: Story = {
  render: function Render() {
    const idRef = React.useRef<string | null>(null);

    return (
      <>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => {
              idRef.current = toast.loading("Processing…", {
                description: "Hang tight while we work.",
              });
            }}
          >
            Start
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (idRef.current) {
                toast.update(idRef.current, {
                  type: "success",
                  title: "Done!",
                  description: "The task completed successfully.",
                  timeout: 4000,
                });
              }
            }}
          >
            Update to success
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (idRef.current) {
                toast.dismiss(idRef.current);
                idRef.current = null;
              }
            }}
          >
            Dismiss
          </Button>
        </div>
        <Toaster />
      </>
    );
  },
};
