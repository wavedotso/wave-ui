'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActionBarProvider, useActionBar } from './action-bar';
import { Input } from './input';

/**
 * Global action bar for unsaved changes.
 *
 * ## Setup
 *
 * Add `<ActionBarProvider>` once in your root layout:
 *
 * ```tsx
 * // app/providers.tsx
 * import { ActionBarProvider } from '@waveso/ui/action-bar';
 *
 * export function Providers({ children }) {
 *   return (
 *     <ActionBarProvider>
 *       {children}
 *     </ActionBarProvider>
 *   );
 * }
 * ```
 *
 * ## Usage
 *
 * Call `useActionBar()` in any form component:
 *
 * ```tsx
 * import { useActionBar } from '@waveso/ui/action-bar';
 *
 * function ProfileForm() {
 *   const [name, setName] = useState(saved.name);
 *   const hasChanges = name !== saved.name;
 *
 *   useActionBar('profile', {
 *     hasChanges,
 *     saving,
 *     onSave: handleSave,
 *     onReset: handleReset,
 *   });
 *
 *   return <Input value={name} onChange={...} />;
 * }
 * ```
 *
 * ## Features
 *
 * - Multi-form aggregation (Save All / Reset All)
 * - ⌘S / Ctrl+S keyboard shortcut
 * - Navigation guard with page jiggle (`useActionBarGuard`)
 * - `beforeunload` guard for browser close/refresh
 */
const meta = {
  title: 'Feedback/ActionBar',
  component: ActionBarProvider,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ActionBarProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function DemoForm() {
  const [value, setValue] = React.useState('');
  const [saved, setSaved] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  useActionBar('demo', {
    hasChanges: value !== saved,
    saving,
    onSave: async () => {
      setSaving(true);
      await new Promise((r) => setTimeout(r, 1000));
      setSaved(value);
      setSaving(false);
    },
    onReset: () => setValue(saved),
  });

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Type to see the ActionBar…"
    />
  );
}

/** Type in the input to trigger the ActionBar. Press ⌘S to save. */
export const Default: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-md space-y-4 p-12">
        <h2 className="text-lg font-semibold">Settings</h2>
        <DemoForm />
      </div>
    ),
  },
};
