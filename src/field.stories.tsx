import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from './field';
import { Input } from './input';

const meta = {
  title: 'Forms/Field',
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<Input placeholder="you@example.com" />} />
    </Field>
  ),
};

export const WithDescription: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldLabel>Username</FieldLabel>
      <FieldControl render={<Input placeholder="@saulo" />} />
      <FieldDescription>
        This is your public display name. It can be your real name or a
        pseudonym.
      </FieldDescription>
    </Field>
  ),
};

export const WithError: Story = {
  args: {},
  render: () => (
    <Field invalid>
      <FieldLabel>Email</FieldLabel>
      <FieldControl render={<Input placeholder="you@example.com" />} />
      <FieldError>Please enter a valid email address.</FieldError>
    </Field>
  ),
};

export const Disabled: Story = {
  args: {},
  render: () => (
    <Field disabled>
      <FieldLabel>Email</FieldLabel>
      <FieldControl
        render={<Input placeholder="you@example.com" value="locked@wave.so" />}
      />
      <FieldDescription>This field cannot be edited.</FieldDescription>
    </Field>
  ),
};
