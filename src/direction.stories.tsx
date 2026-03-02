import type { Meta, StoryObj } from '@storybook/react-vite';

import { DirectionProvider, useDirection } from './direction';
import { Input } from './input';
import { Button } from './button';
import { Label } from './label';

const meta = {
  title: 'Utilities/DirectionProvider',
  component: DirectionProvider,
} satisfies Meta<typeof DirectionProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function DirectionIndicator() {
  const direction = useDirection();
  return (
    <span className="text-muted-foreground text-xs font-mono">
      direction: {direction}
    </span>
  );
}

export const LTR: Story = {
  render: () => (
    <DirectionProvider direction="ltr">
      <div className="flex flex-col gap-4" dir="ltr">
        <DirectionIndicator />
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input placeholder="you@example.com" />
        </div>
        <div className="flex gap-2">
          <Button variant="solid">Submit</Button>
          <Button variant="ghost">Cancel</Button>
        </div>
      </div>
    </DirectionProvider>
  ),
};

export const RTL: Story = {
  render: () => (
    <DirectionProvider direction="rtl">
      <div className="flex flex-col gap-4" dir="rtl">
        <DirectionIndicator />
        <div className="grid gap-2">
          <Label>البريد الإلكتروني</Label>
          <Input placeholder="example@email.com" />
        </div>
        <div className="flex gap-2">
          <Button variant="solid">إرسال</Button>
          <Button variant="ghost">إلغاء</Button>
        </div>
      </div>
    </DirectionProvider>
  ),
};
