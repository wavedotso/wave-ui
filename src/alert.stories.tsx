import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, AlertTitle, AlertDescription, AlertAction } from "./alert";
import { Button } from "./button";
import {
  AlertTriangleIcon,
  ErrorCircleIcon,
  InfoCircleIcon,
  SuccessCircleIcon,
} from "./lib/internal-icons";

const meta = {
  title: "Feedback/Alert",
  component: Alert,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "success", "warning", "destructive"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args} className="w-[420px]">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Mark the leading icon with `data-icon` (the library-wide convention,
 * same as `Badge`/`Button`) to switch the alert into its icon + content
 * two-column layout. Implementation-agnostic — survives an icon-library
 * swap and works for wrapped/non-svg icons.
 */
export const WithIcon: Story = {
  render: (args) => (
    <Alert {...args} className="w-[420px]">
      <InfoCircleIcon data-icon="inline-start" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * The `data-icon` grid contract targets the marked element directly, not a
 * raw `<svg>`, so wrapping the icon (e.g. in a badge, a colored chip, or any
 * layout element) keeps the two-column layout intact.
 */
export const WrappedIcon: Story = {
  render: (args) => (
    <Alert {...args} className="w-[420px]">
      <span
        data-icon="inline-start"
        className="grid size-6 place-items-center rounded-full bg-primary/10"
      >
        <InfoCircleIcon className="size-3.5" />
      </span>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components to your app using the CLI.
      </AlertDescription>
    </Alert>
  ),
};

/**
 * Status variants put the colour in the icon and the border; the text stays
 * neutral. Give each a distinct icon shape so the meaning doesn't rest on
 * colour alone.
 */
export const Info: Story = {
  render: (args) => (
    <Alert {...args} variant="info" className="w-[420px]">
      <InfoCircleIcon data-icon="inline-start" />
      <AlertTitle>A new version is out</AlertTitle>
      <AlertDescription>
        Restart the app to get the latest features.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: (args) => (
    <Alert {...args} variant="success" className="w-[420px]">
      <SuccessCircleIcon data-icon="inline-start" />
      <AlertTitle>Payment received</AlertTitle>
      <AlertDescription>
        Your receipt is on its way to your inbox.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: (args) => (
    <Alert {...args} variant="warning" className="w-[420px]">
      <AlertTriangleIcon data-icon="inline-start" />
      <AlertTitle>Storage almost full</AlertTitle>
      <AlertDescription>You've used 90% of your plan's space.</AlertDescription>
    </Alert>
  ),
};

/**
 * An error that appears after an action is urgent, so it takes
 * `role="alert"` and screen readers announce it at once. A static callout
 * needs no role.
 */
export const Destructive: Story = {
  render: (args) => (
    <Alert {...args} variant="destructive" role="alert" className="w-[420px]">
      <ErrorCircleIcon data-icon="inline-start" />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        Your session has expired. Please log in again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Alert {...args} className="w-[420px]">
      <AlertTitle>New update available</AlertTitle>
      <AlertDescription>
        A new version of the app is available.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Update
        </Button>
      </AlertAction>
    </Alert>
  ),
};
