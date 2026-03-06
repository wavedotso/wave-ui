'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import { toast, Toaster, type ToasterProps } from './toast';

const meta = {
  title: 'Feedback/Toast',
  component: Toaster,
  parameters: {
    layout: 'centered',
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
          <Button
            variant="outline"
            onClick={() => toast('Event created')}
          >
            Default
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success('Success!', {
                description: 'Your changes have been saved.',
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error('Error', {
                description: 'Something went wrong.',
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning('Warning', {
                description: 'Approaching storage limit.',
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info('Info', {
                description: 'A new version is available.',
              })
            }
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.loading('Loading…')}
          >
            Loading
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success('File deleted', {
                description: 'archive.zip was moved to trash.',
                actionProps: {
                  children: 'Undo',
                  onClick: () => toast.info('Restored!'),
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
                  loading: 'Saving changes…',
                  success: 'Changes saved!',
                  error: 'Failed to save.',
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
                  setTimeout(() => reject(new Error('Network error')), 2000),
                ),
                {
                  loading: 'Uploading file…',
                  success: 'Upload complete!',
                  error: 'Upload failed.',
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
    type Position = NonNullable<ToasterProps['position']>;
    const positions: Position[] = [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right',
    ];
    const [active, setActive] = React.useState<Position>('bottom-right');

    return (
      <>
        <div className="flex flex-wrap gap-2">
          {positions.map((pos) => (
            <Button
              key={pos}
              variant={pos === active ? 'default' : 'outline'}
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
