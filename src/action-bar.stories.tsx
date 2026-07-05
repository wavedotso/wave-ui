'use client';

import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ActionBarProvider, useActionBar, useActionBarGuard } from './action-bar';
import { Input } from './input';
import { Label } from './label';
import { Button } from './button';

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

/**
 * A self-contained form that registers under its own `id`. Rendering two of
 * these lets one ActionBar aggregate their state.
 */
function FieldForm({ id, label }: { id: string; label: string }) {
  const [value, setValue] = React.useState('');
  const [saved, setSaved] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  useActionBar(id, {
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
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={`Edit ${label.toLowerCase()}…`}
      />
    </div>
  );
}

/**
 * Two independent forms feed one ActionBar. Editing either raises the bar;
 * **Save** / **Reset** fan out to every dirty form at once (Save All / Reset
 * All). Only the forms with changes are saved or reset.
 */
export const MultiForm: Story = {
  args: {
    children: (
      <div className="mx-auto max-w-md space-y-6 p-12">
        <h2 className="text-lg font-semibold">Account</h2>
        <FieldForm id="profile" label="Display name" />
        <FieldForm id="contact" label="Email" />
      </div>
    ),
  },
};

/**
 * When more than one form is dirty, the bar switches from `message` to
 * `pluralMessage(count)`. Edit both fields to see the message become
 * "2 fields have unsaved changes"; save or reset one to fall back to the
 * singular message.
 */
export const PluralMessage: Story = {
  args: {
    message: 'One field has unsaved changes',
    pluralMessage: (count) => `${count} fields have unsaved changes`,
    children: (
      <div className="mx-auto max-w-md space-y-6 p-12">
        <h2 className="text-lg font-semibold">Profile</h2>
        <FieldForm id="first" label="First name" />
        <FieldForm id="last" label="Last name" />
      </div>
    ),
  },
};

/**
 * Navigation guarded by `useActionBarGuard`. While a form is dirty, clicking a
 * guarded link is blocked and the whole page does a Discord-style jiggle
 * (reduced-motion users get an assertive announcement instead). Save or reset,
 * then the link navigates. The `blockedMessage` is what assistive tech
 * announces on a blocked attempt.
 */
function GuardDemo() {
  const [route, setRoute] = React.useState('/settings');
  const guardedPush = useActionBarGuard(setRoute);

  return (
    <div className="mx-auto max-w-md space-y-6 p-12">
      <h2 className="text-lg font-semibold">Guarded navigation</h2>

      <nav className="flex gap-2">
        <Button
          type="button"
          variant={route === '/settings' ? 'secondary' : 'ghost'}
          onClick={() => guardedPush('/settings')}
        >
          Settings
        </Button>
        <Button
          type="button"
          variant={route === '/billing' ? 'secondary' : 'ghost'}
          onClick={() => guardedPush('/billing')}
        >
          Billing
        </Button>
      </nav>

      <p className="text-soft text-sm">
        Current route: <span className="text-contrast font-medium">{route}</span>
      </p>

      <FieldForm id="guarded" label="Display name" />

      <p className="text-soft text-sm">
        Edit the field, then try switching tabs — navigation is blocked and the
        page jiggles until you save or reset.
      </p>
    </div>
  );
}

export const NavigationGuard: Story = {
  args: {
    blockedMessage: 'Save or reset your changes before leaving this page',
    children: <GuardDemo />,
  },
};
