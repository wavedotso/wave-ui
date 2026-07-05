import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldItem,
  FieldLabel,
  FieldValidity,
} from './field';
import { Checkbox } from './checkbox';
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

/**
 * `FieldItem` lays out a control and its label on a single row (checkbox,
 * radio, switch). The Base UI `Field` wires the label to the control
 * automatically, so no `htmlFor`/`id` is needed.
 */
export const InlineItem: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldItem>
        <FieldControl render={<Checkbox />} />
        <FieldLabel>Subscribe to the newsletter</FieldLabel>
      </FieldItem>
      <FieldDescription>
        We&apos;ll send you product updates once a month. No spam.
      </FieldDescription>
    </Field>
  ),
};

/**
 * `FieldValidity` reads the field's live validity state via a render-prop
 * child, letting you drive custom UI from the control's constraints. Here a
 * `required` input surfaces a hint until it has a value.
 */
export const Validity: Story = {
  args: {},
  render: () => (
    <Field>
      <FieldLabel>Full name</FieldLabel>
      <FieldControl render={<Input required placeholder="Ada Lovelace" />} />
      <FieldValidity>
        {(state) => (
          <FieldDescription>
            {state.validity.valueMissing
              ? 'This field is required.'
              : 'Looks good.'}
          </FieldDescription>
        )}
      </FieldValidity>
    </Field>
  ),
};
