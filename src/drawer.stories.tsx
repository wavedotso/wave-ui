import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';
import { Input } from './input';
import { Label } from './label';

const meta = {
  title: 'Overlay/Drawer',
  component: Drawer,
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Bottom drawer (default). Swipe down or tap the overlay to dismiss. */
export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <p className="text-muted-foreground text-sm">
            Drag the handle or tap the overlay to close this drawer.
          </p>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

/** Right-side drawer with a close button and navigation links. */
export const Right: Story = {
  render: () => (
    <Drawer swipeDirection="right">
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Right
      </DrawerTrigger>
      <DrawerContent showCloseButton>
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
          <DrawerDescription>
            Browse the application sections.
          </DrawerDescription>
        </DrawerHeader>
        <nav className="flex flex-col gap-1 p-4">
          {['Dashboard', 'Projects', 'Tasks', 'Settings'].map((item) => (
            <button
              key={item}
              className="text-foreground hover:bg-muted rounded-md px-3 py-2 text-left text-sm transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  ),
};

/** Left-side drawer for sidebar navigation. */
export const Left: Story = {
  render: () => (
    <Drawer swipeDirection="left">
      <DrawerTrigger render={<Button variant="outline" />}>
        Open Left
      </DrawerTrigger>
      <DrawerContent showCloseButton>
        <DrawerHeader>
          <DrawerTitle>Sidebar</DrawerTitle>
          <DrawerDescription>Application navigation links.</DrawerDescription>
        </DrawerHeader>
        <nav className="flex flex-col gap-1 p-4">
          {['Home', 'Inbox', 'Calendar', 'Archive'].map((item) => (
            <button
              key={item}
              className="text-foreground hover:bg-muted rounded-md px-3 py-2 text-left text-sm transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </DrawerContent>
    </Drawer>
  ),
};

/** Bottom drawer with form inputs. */
export const WithForm: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button />}>Edit Profile</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Edit Profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here.
          </DrawerDescription>
        </DrawerHeader>
        <div className="grid gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="drawer-name">Name</Label>
            <Input id="drawer-name" defaultValue="Saulo" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="drawer-username">Username</Label>
            <Input id="drawer-username" defaultValue="@saulo" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose render={<Button variant="outline" />}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
