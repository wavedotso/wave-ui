import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Form,
  FormField,
  FormError,
  FormActions,
  FormMessage,
  fieldControlProps,
  useForm,
} from './form';
import { Input } from './input';
import { Textarea } from './textarea';
import { Button } from './button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Switch } from './switch';

const meta = {
  title: 'Forms/Form',
  component: Form,
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj;

type ContactValues = {
  name: string;
  email: string;
  message: string;
};

function ContactFormDemo() {
  const form = useForm<ContactValues>({
    defaultValues: { name: '', email: '', message: '' },
  });

  function onSubmit(data: ContactValues) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="max-w-sm">
      <FormField
        name="name"
        label="Name"
        rules={{ required: 'Name is required' }}
        render={({ id, field, fieldState }) => (
          <Input
            {...fieldControlProps(field, { id, invalid: fieldState.invalid, native: true })}
            placeholder="Your name"
          />
        )}
      />
      <FormField
        name="email"
        label="Email"
        rules={{
          required: 'Email is required',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
        }}
        render={({ id, field, fieldState }) => (
          <Input
            {...fieldControlProps(field, { id, invalid: fieldState.invalid, native: true })}
            type="email"
            placeholder="you@example.com"
          />
        )}
      />
      <FormField
        name="message"
        label="Message"
        description="Tell us how we can help."
        rules={{ required: 'Message is required' }}
        render={({ id, field, fieldState }) => (
          <Textarea
            {...fieldControlProps(field, { id, invalid: fieldState.invalid, native: true })}
            placeholder="Your message..."
          />
        )}
      />
      <FormActions>
        <Button type="submit" variant="solid">Send</Button>
      </FormActions>
    </Form>
  );
}

export const Default: Story = {
  render: () => <ContactFormDemo />,
};

type LoginValues = {
  email: string;
  password: string;
};

function WithErrorDemo() {
  const form = useForm<LoginValues>({
    defaultValues: { email: '', password: '' },
  });

  function onSubmit() {
    form.setError('root', { message: 'Invalid email or password. Please try again.' });
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="max-w-sm">
      <FormError />
      <FormField
        name="email"
        label="Email"
        rules={{ required: 'Email is required' }}
        render={({ id, field, fieldState }) => (
          <Input
            {...fieldControlProps(field, { id, invalid: fieldState.invalid, native: true })}
            type="email"
            placeholder="you@example.com"
          />
        )}
      />
      <FormField
        name="password"
        label="Password"
        rules={{ required: 'Password is required' }}
        render={({ id, field, fieldState }) => (
          <Input
            {...fieldControlProps(field, { id, invalid: fieldState.invalid, native: true })}
            type="password"
            placeholder="••••••••"
          />
        )}
      />
      <FormActions>
        <Button type="submit" variant="solid">Sign in</Button>
      </FormActions>
      <FormMessage>
        Don&apos;t have an account? Sign up.
      </FormMessage>
    </Form>
  );
}

export const WithError: Story = {
  render: () => <WithErrorDemo />,
};

type SettingsValues = {
  username: string;
  role: string;
  notifications: boolean;
};

function WithSelectDemo() {
  const form = useForm<SettingsValues>({
    defaultValues: { username: '', role: 'viewer', notifications: true },
  });

  function onSubmit(data: SettingsValues) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <Form form={form} onSubmit={onSubmit} className="max-w-sm">
      <FormField
        name="username"
        label="Username"
        rules={{ required: 'Username is required' }}
        render={({ id, field, fieldState }) => (
          <Input
            {...fieldControlProps(field, { id, invalid: fieldState.invalid, native: true })}
            placeholder="johndoe"
          />
        )}
      />
      <FormField
        name="role"
        label="Role"
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
      <FormField
        name="notifications"
        label="Email notifications"
        description="Receive updates about your account."
        render={({ field }) => (
          <Switch
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <FormActions>
        <Button type="submit" variant="solid">Save</Button>
        <Button type="reset" variant="ghost" onClick={() => form.reset()}>
          Reset
        </Button>
      </FormActions>
    </Form>
  );
}

export const WithSelect: Story = {
  render: () => <WithSelectDemo />,
};
