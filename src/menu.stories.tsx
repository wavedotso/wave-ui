import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

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
} from "./menu";
import { Button } from "./button";
import { StarIcon, TrashIcon } from "./lib/internal-icons";

const meta = {
  title: "Overlay/Menu",
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
          <MenuItem>
            Profile<MenuShortcut>⌘P</MenuShortcut>
          </MenuItem>
          <MenuItem>
            Settings<MenuShortcut>⌘S</MenuShortcut>
          </MenuItem>
          <MenuItem>
            Keyboard shortcuts<MenuShortcut>⌘K</MenuShortcut>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuGroup>
          <MenuItem>Team</MenuItem>
          <MenuItem>Invite users</MenuItem>
          <MenuItem>
            New team<MenuShortcut>⌘T</MenuShortcut>
          </MenuItem>
        </MenuGroup>
        <MenuSeparator />
        <MenuItem variant="destructive">
          Log out<MenuShortcut>⇧⌘Q</MenuShortcut>
        </MenuItem>
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
        <MenuCheckboxItem
          checked={showStatusBar}
          onCheckedChange={setShowStatusBar}
        >
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
  const [theme, setTheme] = useState("system");

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

/**
 * `inset` shifts an item's text into the icon column so rows without a
 * leading icon still line up with rows that have one. Use it whenever a
 * menu mixes icon and icon-less items.
 */
export const Inset: Story = {
  render: () => (
    <Menu>
      <MenuTrigger render={<Button variant="outline" />}>Actions</MenuTrigger>
      <MenuContent>
        <MenuLabel inset>Manage</MenuLabel>
        <MenuItem>
          <StarIcon />
          Add to favorites
        </MenuItem>
        <MenuItem inset>Rename</MenuItem>
        <MenuItem inset>Duplicate</MenuItem>
        <MenuSeparator />
        <MenuItem variant="destructive">
          <TrashIcon />
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
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
        <MenuItem variant="destructive" disabled>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};

/**
 * `restoreFocusOnClose="keyboard"` — the trigger only appears while the
 * row is hovered or focus is within it (a common "hover actions"
 * pattern). With the default focus restoration, closing the menu with
 * the mouse would snap focus back to the trigger, keeping the whole row
 * pinned visible. `"keyboard"` restores focus to the trigger only on a
 * keyboard close; pointer closes leave focus alone so the row can
 * dismiss. Tab to the row, press Enter to open, Escape to close → focus
 * returns. Hover to open, click away → the row fades out.
 */
export const RestoreFocusOnClose: Story = {
  render: () => (
    <div
      tabIndex={0}
      className="group flex w-72 items-center justify-between rounded-md border border-edge p-3 text-sm"
    >
      <span>Hover or focus this row</span>
      <Menu>
        <MenuTrigger
          render={<Button variant="ghost" size="sm" />}
          className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          Actions
        </MenuTrigger>
        <MenuContent restoreFocusOnClose="keyboard">
          <MenuItem>Edit</MenuItem>
          <MenuItem>Duplicate</MenuItem>
          <MenuSeparator />
          <MenuItem variant="destructive">Delete</MenuItem>
        </MenuContent>
      </Menu>
    </div>
  ),
};
