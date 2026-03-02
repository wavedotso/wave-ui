import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from './menubar';
import { Button } from './button';

const meta = {
  title: 'Navigation/Menubar',
  component: Menubar,
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

function MenubarDemo() {
  const [showBookmarks, setShowBookmarks] = useState(true);
  const [showUrls, setShowUrls] = useState(false);
  const [person, setPerson] = useState('pedro');

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger render={<Button variant="ghost" size="sm" />}>
          File
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab<MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window<MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Print...<MenubarShortcut>⌘P</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger render={<Button variant="ghost" size="sm" />}>
          Edit
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo<MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo<MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut<MenubarShortcut>⌘X</MenubarShortcut></MenubarItem>
          <MenubarItem>Copy<MenubarShortcut>⌘C</MenubarShortcut></MenubarItem>
          <MenubarItem>Paste<MenubarShortcut>⌘V</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Select All<MenubarShortcut>⌘A</MenubarShortcut></MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger render={<Button variant="ghost" size="sm" />}>
          View
        </MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showBookmarks} onCheckedChange={setShowBookmarks}>
            Always Show Bookmarks Bar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showUrls} onCheckedChange={setShowUrls}>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem>Reload<MenubarShortcut>⌘R</MenubarShortcut></MenubarItem>
          <MenubarItem>Force Reload<MenubarShortcut>⇧⌘R</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Toggle Fullscreen</MenubarItem>
          <MenubarItem>Hide Sidebar</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger render={<Button variant="ghost" size="sm" />}>
          Profiles
        </MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Switch Profile</MenubarLabel>
            <MenubarRadioGroup value={person} onValueChange={setPerson}>
              <MenubarRadioItem value="pedro">Pedro</MenubarRadioItem>
              <MenubarRadioItem value="maria">Maria</MenubarRadioItem>
              <MenubarRadioItem value="carlos">Carlos</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem>Edit...</MenubarItem>
          <MenubarItem>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

export const Default: Story = {
  render: () => <MenubarDemo />,
};
