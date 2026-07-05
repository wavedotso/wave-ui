import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteTrigger,
  AutocompleteIcon,
  AutocompleteClear,
  AutocompleteValue,
  AutocompleteContent,
  AutocompletePortal,
  AutocompletePositioner,
  AutocompletePopup,
  AutocompleteBackdrop,
  AutocompleteArrow,
  AutocompleteList,
  AutocompleteRow,
  AutocompleteItem,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteStatus,
  AutocompleteEmpty,
} from "./autocomplete";
import { Label } from "./label";
import { ChevronDownIcon, CloseIcon } from "./lib/internal-icons";

const meta = {
  title: "Forms/Autocomplete",
  component: Autocomplete,
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj;

const countries = [
  { value: "br", label: "Brazil" },
  { value: "ca", label: "Canada" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "mx", label: "Mexico" },
  { value: "uk", label: "United Kingdom" },
  { value: "us", label: "United States" },
];

const groupedCountries = [
  {
    label: "Americas",
    items: [
      { value: "br", label: "Brazil" },
      { value: "ca", label: "Canada" },
      { value: "mx", label: "Mexico" },
      { value: "us", label: "United States" },
    ],
  },
  {
    label: "Europe",
    items: [
      { value: "de", label: "Germany" },
      { value: "fr", label: "France" },
      { value: "uk", label: "United Kingdom" },
    ],
  },
  {
    label: "Asia",
    items: [{ value: "jp", label: "Japan" }],
  },
];

// Emoji flags avoid remote image URLs, keeping the grid story deterministic.
const flags = [
  { value: "br", label: "Brazil", flag: "🇧🇷" },
  { value: "ca", label: "Canada", flag: "🇨🇦" },
  { value: "de", label: "Germany", flag: "🇩🇪" },
  { value: "fr", label: "France", flag: "🇫🇷" },
  { value: "jp", label: "Japan", flag: "🇯🇵" },
  { value: "mx", label: "Mexico", flag: "🇲🇽" },
  { value: "uk", label: "United Kingdom", flag: "🇬🇧" },
  { value: "us", label: "United States", flag: "🇺🇸" },
];

export const Default: Story = {
  render: () => (
    <Autocomplete items={countries}>
      <AutocompleteInput placeholder="Search countries..." />
      <AutocompleteContent>
        <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};

/**
 * Wire the `Label` to the input with matching `htmlFor` / `id` so clicking the
 * label focuses the field and screen readers announce it.
 */
export const WithLabel: Story = {
  render: () => (
    <div className="grid gap-2">
      <Label htmlFor="country">Country</Label>
      <Autocomplete items={countries}>
        <AutocompleteInput id="country" placeholder="Select a country..." />
        <AutocompleteContent>
          <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.value} value={item}>
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
              {group.items.map((item: { value: string; label: string }) => (
                <AutocompleteItem key={item.value} value={item}>
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

/**
 * `AutocompleteTrigger` is a button that opens the popup; nest an
 * `AutocompleteIcon` inside it for the chevron affordance. `AutocompleteClear`
 * resets the query and mounts only once there is text to clear. Both sit in a
 * relative wrapper alongside the input as inline-end adornments.
 */
export const WithTriggerAndClear: Story = {
  render: () => (
    <Autocomplete items={countries}>
      <div className="relative">
        <AutocompleteInput
          placeholder="Search countries..."
          className="pr-14"
        />
        <div className="absolute inset-y-0 right-1.5 flex items-center gap-0.5">
          <AutocompleteClear
            aria-label="Clear"
            className="text-muted hover:text-contrast flex size-5 items-center justify-center rounded-sm"
          >
            <CloseIcon className="size-4" />
          </AutocompleteClear>
          <AutocompleteTrigger
            aria-label="Open"
            className="text-muted hover:text-contrast flex size-5 items-center justify-center rounded-sm"
          >
            <AutocompleteIcon>
              <ChevronDownIcon className="size-4" />
            </AutocompleteIcon>
          </AutocompleteTrigger>
        </div>
      </div>
      <AutocompleteContent>
        <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};

/**
 * `AutocompleteValue` reads the live query string. A render callback receives it
 * so you can echo the current text — handy for a "Searching for …" affordance.
 */
export const WithValue: Story = {
  render: () => (
    <div className="grid gap-2">
      <Autocomplete items={countries}>
        <AutocompleteInput placeholder="Type to search..." />
        <AutocompleteContent>
          <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
          <AutocompleteList>
            {(item) => (
              <AutocompleteItem key={item.value} value={item}>
                {item.label}
              </AutocompleteItem>
            )}
          </AutocompleteList>
        </AutocompleteContent>
        <p className="text-muted text-sm">
          Query:{" "}
          <AutocompleteValue>
            {(value) => (
              <span className="text-contrast font-medium">
                {value || "(empty)"}
              </span>
            )}
          </AutocompleteValue>
        </p>
      </Autocomplete>
    </div>
  ),
};

/**
 * `AutocompleteStatus` is an ARIA live region announced to assistive tech as the
 * list updates — a natural home for a result count. It renders inside the popup
 * above the list.
 */
export const WithStatus: Story = {
  render: () => (
    <Autocomplete items={countries}>
      <AutocompleteInput placeholder="Search countries..." />
      <AutocompleteContent>
        <AutocompleteStatus>
          Showing {countries.length} countries
        </AutocompleteStatus>
        <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};

/**
 * Set `grid` on the root to lay items out in a two-column grid. Wrap each pair
 * of `AutocompleteItem`s in an `AutocompleteRow` so arrow-key navigation moves
 * across rows and columns.
 */
export const GridLayout: Story = {
  render: () => {
    const rows: { key: string; items: typeof flags }[] = [];
    for (let i = 0; i < flags.length; i += 2) {
      const items = flags.slice(i, i + 2);
      rows.push({ key: items.map((item) => item.value).join("-"), items });
    }

    return (
      <Autocomplete grid items={flags}>
        <AutocompleteInput placeholder="Search countries..." />
        <AutocompleteContent className="w-64">
          <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
          <AutocompleteList>
            {rows.map((row) => (
              <AutocompleteRow key={row.key} className="grid grid-cols-2">
                {row.items.map((item) => (
                  <AutocompleteItem key={item.value} value={item}>
                    <span aria-hidden>{item.flag}</span>
                    {item.label}
                  </AutocompleteItem>
                ))}
              </AutocompleteRow>
            ))}
          </AutocompleteList>
        </AutocompleteContent>
      </Autocomplete>
    );
  },
};

/**
 * `AutocompleteBackdrop` dims the page while the popup is open. Render it through
 * `AutocompletePortal` as a sibling of the content so it shares the popup's
 * portal layer.
 */
export const WithBackdrop: Story = {
  render: () => (
    <Autocomplete items={countries}>
      <AutocompleteInput placeholder="Search countries..." />
      <AutocompletePortal>
        <AutocompleteBackdrop className="bg-scrim supports-backdrop-filter:backdrop-blur-xs" />
      </AutocompletePortal>
      <AutocompleteContent>
        <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
        <AutocompleteList>
          {(item) => (
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};

/**
 * For a pointer between the input and the popup, compose the low-level parts
 * (`AutocompletePortal` → `AutocompletePositioner` → `AutocompletePopup`) instead
 * of the `AutocompleteContent` shorthand, and drop an `AutocompleteArrow` into
 * the positioner.
 */
export const WithArrow: Story = {
  render: () => (
    <Autocomplete items={countries}>
      <AutocompleteInput placeholder="Search countries..." />
      <AutocompletePortal>
        <AutocompletePositioner sideOffset={8} className="isolate z-50">
          <AutocompletePopup>
            <AutocompleteArrow />
            <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
            <AutocompleteList>
              {(item) => (
                <AutocompleteItem key={item.value} value={item}>
                  {item.label}
                </AutocompleteItem>
              )}
            </AutocompleteList>
          </AutocompletePopup>
        </AutocompletePositioner>
      </AutocompletePortal>
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
            <AutocompleteItem key={item.value} value={item}>
              {item.label}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  ),
};
