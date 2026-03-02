import type { Meta, StoryObj } from '@storybook/react-vite'

import { RadioGroup, RadioGroupItem } from './radio-group'
import { Field, FieldLabel, FieldDescription } from './field'

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
        <RadioGroupItem value="default" />
        <label className="text-sm">Default</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="comfortable" />
        <label className="text-sm">Comfortable</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="compact" />
        <label className="text-sm">Compact</label>
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
        <div className="flex items-center gap-2">
          <RadioGroupItem value="email" />
          <label className="text-sm">Email</label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="sms" />
          <label className="text-sm">SMS</label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="push" />
          <label className="text-sm">Push notification</label>
        </div>
      </RadioGroup>
    </Field>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <RadioGroup defaultValue="option-1" className="w-64">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-1" />
        <label className="text-sm">Available</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-2" disabled />
        <label className="text-sm text-muted-foreground">Disabled</label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="option-3" />
        <label className="text-sm">Also available</label>
      </div>
    </RadioGroup>
  ),
}

export const Invalid: Story = {
  render: () => (
    <div className="w-64 grid gap-2">
      <label className="text-sm font-medium">Plan</label>
      <RadioGroup aria-invalid="true">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="free" />
          <label className="text-sm">Free</label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="pro" />
          <label className="text-sm">Pro</label>
        </div>
      </RadioGroup>
      <p className="text-destructive text-sm">Please select a plan.</p>
    </div>
  ),
}
