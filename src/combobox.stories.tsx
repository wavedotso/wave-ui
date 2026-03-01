import { useState, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxLabel,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
} from './combobox';
import { Label } from './label';

const meta = {
  title: 'Forms/Combobox',
  component: Combobox,
} satisfies Meta<typeof Combobox>;

export default meta;
type Story = StoryObj<typeof meta>;

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'grape', label: 'Grape' },
  { value: 'mango', label: 'Mango' },
  { value: 'orange', label: 'Orange' },
  { value: 'peach', label: 'Peach' },
  { value: 'strawberry', label: 'Strawberry' },
];

const frameworks = [
  {
    label: 'Frontend',
    items: [
      { value: 'next', label: 'Next.js' },
      { value: 'remix', label: 'Remix' },
      { value: 'astro', label: 'Astro' },
    ],
  },
  {
    label: 'Backend',
    items: [
      { value: 'express', label: 'Express' },
      { value: 'fastify', label: 'Fastify' },
      { value: 'hono', label: 'Hono' },
    ],
  },
];

export const Default: Story = {
  render: () => (
    <Combobox items={fruits}>
      <ComboboxInput placeholder="Search fruits..." />
      <ComboboxContent>
        <ComboboxEmpty>No fruits found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item} label={item.label}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label>Favorite fruit</Label>
      <Combobox items={fruits}>
        <ComboboxInput placeholder="Pick a fruit..." />
        <ComboboxContent>
          <ComboboxEmpty>No fruits found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item} label={item.label}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Combobox items={frameworks}>
      <ComboboxInput placeholder="Search frameworks..." />
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList>
          {(group) => (
            <ComboboxGroup key={group.label}>
              <ComboboxLabel>{group.label}</ComboboxLabel>
              {group.items.map((item) => (
                <ComboboxItem key={item.value} value={item} label={item.label}>
                  {item.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

export const WithClear: Story = {
  render: () => (
    <Combobox items={fruits} defaultValue={fruits[1]}>
      <ComboboxInput placeholder="Search fruits..." showClear />
      <ComboboxContent>
        <ComboboxEmpty>No fruits found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item} label={item.label}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

function MultiSelectDemo() {
  const [selectedFruits, setSelectedFruits] = useState([fruits[0], fruits[2]]);
  const chipsRef = useRef<HTMLDivElement | null>(null);

  return (
    <Combobox multiple items={fruits} value={selectedFruits} onValueChange={setSelectedFruits}>
      <ComboboxChips ref={chipsRef}>
        {(item) => (
          <ComboboxChip key={item.value} value={item}>
            {item.label}
          </ComboboxChip>
        )}
        <ComboboxChipsInput placeholder="Add fruits..." />
      </ComboboxChips>
      <ComboboxContent anchor={chipsRef}>
        <ComboboxEmpty>No fruits found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item} label={item.label}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

export const MultiSelect: Story = {
  render: () => <MultiSelectDemo />,
};

export const Disabled: Story = {
  render: () => (
    <Combobox items={fruits} defaultValue={fruits[1]} disabled>
      <ComboboxInput placeholder="Search fruits..." />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item} label={item.label}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};
