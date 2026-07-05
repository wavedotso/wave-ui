import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup, RadioGroupItem } from './radio-group'
import { Field, FieldItem, FieldLabel, FieldDescription } from './field'
import { Label } from './label'

const meta = {
  title: 'Forms/RadioGroup',
  component: RadioGroup,
} satisfies Meta<typeof RadioGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable" className="w-64">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="density-default" value="default" />
        <Label htmlFor="density-default">Default</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="density-comfortable" value="comfortable" />
        <Label htmlFor="density-comfortable">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="density-compact" value="compact" />
        <Label htmlFor="density-compact">Compact</Label>
      </div>
    </RadioGroup>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <RadioGroup defaultValue="light" className="flex flex-wrap gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="theme-light" value="light" />
        <Label htmlFor="theme-light">Light</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="theme-dark" value="dark" />
        <Label htmlFor="theme-dark">Dark</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="theme-system" value="system" />
        <Label htmlFor="theme-system">System</Label>
      </div>
    </RadioGroup>
  ),
}

export const WithField: Story = {
  render: () => (
    <Field className="w-64">
      <FieldLabel>Notification preference</FieldLabel>
      <FieldDescription>Choose how you want to be notified.</FieldDescription>
      <RadioGroup defaultValue="email">
        <FieldItem>
          <RadioGroupItem id="notify-email" value="email" />
          <Label htmlFor="notify-email">Email</Label>
        </FieldItem>
        <FieldItem>
          <RadioGroupItem id="notify-sms" value="sms" />
          <Label htmlFor="notify-sms">SMS</Label>
        </FieldItem>
        <FieldItem>
          <RadioGroupItem id="notify-push" value="push" />
          <Label htmlFor="notify-push">Push notification</Label>
        </FieldItem>
      </RadioGroup>
    </Field>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="w-64">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="opt-available" value="option-1" />
        <Label htmlFor="opt-available">Available</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="opt-disabled" value="option-2" disabled />
        <Label htmlFor="opt-disabled" className="text-muted">
          Disabled
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="opt-also-available" value="option-3" />
        <Label htmlFor="opt-also-available">Also available</Label>
      </div>
    </RadioGroup>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div className="w-64 grid gap-2">
      <Label>Plan</Label>
      <RadioGroup aria-invalid="true">
        <div className="flex items-center gap-2">
          <RadioGroupItem id="plan-free" value="free" />
          <Label htmlFor="plan-free">Free</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem id="plan-pro" value="pro" />
          <Label htmlFor="plan-pro">Pro</Label>
        </div>
      </RadioGroup>
      <p className="text-destructive text-sm">Please select a plan.</p>
    </div>
  ),
}
