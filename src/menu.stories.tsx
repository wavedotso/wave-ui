import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Menu,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
} from './menu';
import { Button } from './button';

const meta = {
  title: 'Overlay/Menu',
  component: Menu,
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Open menu</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuLabel>My Account</MenuLabel>
          <MenuItem>Profile<MenuShortcut>⌘P</MenuShortcut></MenuItem>
          <MenuItem>Settings<MenuShortcut>⌘S</MenuShortcut></MenuItem>
          <MenuItem>Keyboard shortcuts<MenuShortcut>⌘K</MenuShortcut></MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuItem>Team</MenuItem>
          <MenuItem>Invite users</MenuItem>
          <MenuItem>New team<MenuShortcut>⌘T</MenuShortcut></MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem variant="destructive">Log out<MenuShortcut>⇧⌘Q</MenuShortcut></MenuItem>
      </MenuContent>
    </Menu>
  ),
};

export const WithSubmenu: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Options</MenuTrigger>
      <MenuContent>
        <MenuItem>New file</MenuItem>
        <MenuItem>Open file</MenuItem>
        <MenuSeparator />
        <MenuSub>
          <MenuSubTrigger>Share</MenuSubTrigger>
          <MenuSubContent>
            <MenuItem>Email</MenuItem>
            <MenuItem>Message</MenuItem>
            <MenuItem>Copy link</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem>Print</MenuItem>
      </MenuContent>
    </Menu>
  ),
};

function CheckboxDemo() {
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>View</MenuTrigger>
      <MenuContent>
        <MenuCheckboxItem checked={showStatusBar} onCheckedChange={setShowStatusBar}>
          Status bar
        </MenuCheckboxItem>
        <MenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
          Panel
        </MenuCheckboxItem>
        <MenuSeparator />
        <MenuItem>Customize...</MenuItem>
      </MenuContent>
    </Menu>
  );
}

export const WithCheckbox: Story = {
  render: () => <CheckboxDemo />,
};

function RadioDemo() {
  const [theme, setTheme] = useState('system');

  return (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Theme</MenuTrigger>
      <MenuContent>
        <MenuGroup>
          <MenuLabel>Appearance</MenuLabel>
          <MenuRadioGroup value={theme} onValueChange={setTheme}>
            <MenuRadioItem value="light">Light</MenuRadioItem>
            <MenuRadioItem value="dark">Dark</MenuRadioItem>
            <MenuRadioItem value="system">System</MenuRadioItem>
          </MenuRadioGroup>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}

export const WithRadio: Story = {
  render: () => <RadioDemo />,
};

export const WithDisabled: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Actions</MenuTrigger>
      <MenuContent>
        <MenuItem>Edit</MenuItem>
        <MenuItem>Duplicate</MenuItem>
        <MenuItem disabled>Archive</MenuItem>
        <MenuSeparator />
        <MenuItem variant="destructive" disabled>Delete</MenuItem>
      </MenuContent>
    </Menu>
  ),
};
