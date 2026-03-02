import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteContent,
  AutocompleteList,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteEmpty,
  AutocompleteSeparator,
} from './autocomplete';
import { Label } from './label';

const meta = {
  title: 'Forms/Autocomplete',
  component: Autocomplete,
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const countries = [
  { value: 'br', label: 'Brazil' },
  { value: 'ca', label: 'Canada' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'us', label: 'United States' },
];

const groupedCountries = [
  {
    label: 'Americas',
    items: [
      { value: 'br', label: 'Brazil' },
      { value: 'ca', label: 'Canada' },
      { value: 'mx', label: 'Mexico' },
      { value: 'us', label: 'United States' },
    ],
  },
  {
    label: 'Europe',
    items: [
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'uk', label: 'United Kingdom' },
    ],
  },
  {
    label: 'Asia',
    items: [
      { value: 'jp', label: 'Japan' },
    ],
  },
];

export const Default: Story = {
  render: () => (
    <Autocomplete items={countries}>
      <AutocompleteInput placeholder="Search countries..." />
      <AutocompleteContent>
        <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item} label={item.label}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label>Country</Label>
      <Autocomplete items={countries}>
        <AutocompleteInput placeholder="Select a country..." />
        <AutocompleteContent>
          <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.value} value={item} label={item.label}>
                {item.label}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    </div>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Autocomplete items={groupedCountries}>
      <AutocompleteInput placeholder="Search countries..." />
      <AutocompleteContent>
        <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
        <AutocompleteList>
          {(group) => (
            <AutocompleteGroup key={group.label}>
              <AutocompleteGroupLabel>{group.label}</AutocompleteGroupLabel>
              {group.items.map((item) => (
                <AutocompleteItem key={item.value} value={item} label={item.label}>
                  {item.label}
                </AutocompleteItem>
              ))}
            </AutocompleteGroup>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Autocomplete items={countries} disabled>
      <AutocompleteInput placeholder="Search countries..." />
      <AutocompleteContent>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item} label={item.label}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};
