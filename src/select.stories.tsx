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
      <Label>Timezone</Label>
      <Select defaultValue="utc">
        <SelectTrigger>
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
