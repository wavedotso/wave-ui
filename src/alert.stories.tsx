import type { Meta, StoryObj } from '@storybook/react-vite';

import { Alert, AlertTitle, AlertDescription, AlertAction } from './alert';
import { Button } from './button';
import { InfoCircleIcon } from './lib/internal-icons';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
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

export const Destructive: Story = {
  render: (args) => (
    <Alert {...args} variant="destructive" className="w-[420px]">
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
        <Button size="xs" variant="outline">Update</Button>
      </AlertAction>
    </Alert>
  ),
};
