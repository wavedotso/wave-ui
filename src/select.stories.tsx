import type { Meta, StoryObj } from '@storybook/react-vite';

import { Label } from './label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

const meta = {
  title: 'Forms/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger>
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
          <SelectItem value="grape">Grape</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="timezone">Timezone</Label>
      <Select defaultValue="utc">
        <SelectTrigger id="timezone">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="est">Eastern (EST)</SelectItem>
            <SelectItem value="pst">Pacific (PST)</SelectItem>
            <SelectItem value="cet">Central European (CET)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select defaultValue="next">
      <SelectTrigger>
        <SelectValue placeholder="Select framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Frontend</SelectLabel>
          <SelectItem value="next">Next.js</SelectItem>
          <SelectItem value="remix">Remix</SelectItem>
          <SelectItem value="astro">Astro</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Backend</SelectLabel>
          <SelectItem value="express">Express</SelectItem>
          <SelectItem value="fastify">Fastify</SelectItem>
          <SelectItem value="hono">Hono</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select defaultValue="active">
      <SelectTrigger size="sm">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select defaultValue="locked" disabled>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="locked">Locked</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

/**
 * `alignItemWithTrigger` opens the popup so the *selected* item sits directly
 * over the trigger (native macOS-style select), with the rest of the list
 * extending above and below. Open with "Green" preselected to see it centre on
 * the trigger. Enter/exit motion is intentionally skipped in this mode — Base
 * UI scroll-positions the list, so a scale/fade would fight it.
 */
export const AlignItemWithTrigger: Story = {
  render: () => (
    <Select defaultValue="green">
      <SelectTrigger>
        <SelectValue placeholder="Pick a color" />
      </SelectTrigger>
      <SelectContent alignItemWithTrigger>
        <SelectGroup>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="yellow">Yellow</SelectItem>
          <SelectItem value="green">Green</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
          <SelectItem value="indigo">Indigo</SelectItem>
          <SelectItem value="violet">Violet</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

const toppingLabels: Record<string, string> = {
  pepperoni: 'Pepperoni',
  mushroom: 'Mushroom',
  onion: 'Onion',
  olive: 'Olive',
  pepper: 'Pepper',
};

/**
 * Passing `multiple` flips `defaultValue`/`value` to an array — the `Multiple`
 * generic on `Select` is preserved through the wrapper, so `SelectValue`'s
 * render function receives the selected values as a typed `string[]`. Items
 * toggle on click and show a check for every active value.
 */
export const MultiSelect: Story = {
  render: () => (
    <Select multiple defaultValue={['pepperoni', 'mushroom']}>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Add toppings">
          {(values: string[]) =>
            values.length > 0
              ? values.map((value) => toppingLabels[value]).join(', ')
              : 'Add toppings'
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="pepperoni">Pepperoni</SelectItem>
          <SelectItem value="mushroom">Mushroom</SelectItem>
          <SelectItem value="onion">Onion</SelectItem>
          <SelectItem value="olive">Olive</SelectItem>
          <SelectItem value="pepper">Pepper</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

const timezones = [
  'UTC−12:00 — Baker Island',
  'UTC−11:00 — American Samoa',
  'UTC−10:00 — Hawaii',
  'UTC−09:00 — Alaska',
  'UTC−08:00 — Pacific (PST)',
  'UTC−07:00 — Mountain (MST)',
  'UTC−06:00 — Central (CST)',
  'UTC−05:00 — Eastern (EST)',
  'UTC−04:00 — Atlantic',
  'UTC−03:00 — Buenos Aires',
  'UTC−01:00 — Azores',
  'UTC±00:00 — London (GMT)',
  'UTC+01:00 — Paris (CET)',
  'UTC+02:00 — Cairo',
  'UTC+03:00 — Moscow',
  'UTC+04:00 — Dubai',
  'UTC+05:30 — Mumbai',
  'UTC+07:00 — Bangkok',
  'UTC+08:00 — Singapore',
  'UTC+09:00 — Tokyo',
  'UTC+10:00 — Sydney',
  'UTC+12:00 — Auckland',
];

/**
 * When the item list is taller than the available viewport space, `SelectContent`
 * renders the scroll-up and scroll-down buttons at the edges of the popup. Open
 * this one and hover the top/bottom arrows to scroll the long list.
 */
export const Scrollable: Story = {
  render: () => (
    <Select defaultValue="UTC±00:00 — London (GMT)">
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {timezones.map((zone) => (
            <SelectItem key={zone} value={zone}>
              {zone}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
