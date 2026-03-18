# @waveso/ui

A component library built on [Base UI](https://base-ui.com) primitives and [Tailwind CSS v4](https://tailwindcss.com).

## Install

```bash
npm install @waveso/ui @base-ui/react class-variance-authority clsx tailwind-merge
```

## Setup

Add the theme preset and source directive to your CSS entry point:

```css
@import "@waveso/ui/styles.css";
@import "tailwindcss";
@source "../../node_modules/@waveso/ui/dist";
```

The preset provides all CSS variables (colors, radii, sidebar tokens) with light and dark mode support. Override any variable in your own `:root` / `.dark` blocks to customize the theme.

## Usage

Import components by name — each is a separate entry point for optimal tree-shaking:

```tsx
import { Button } from '@waveso/ui/button';
import { Masonry, MasonryItem, MasonrySpannedItem } from '@waveso/ui/masonry';
import { Card, CardHeader, CardTitle, CardContent } from '@waveso/ui/card';
```

### Button

8 variants, 8 sizes, built on Base UI's `Button` primitive with full keyboard and ARIA support.

```tsx
import { Button } from '@waveso/ui/button';

<Button>Default</Button>
<Button variant="solid">Solid</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="success">Confirm</Button>
<Button size="xs">Tiny</Button>
<Button size="icon"><SearchIcon /></Button>
```

### Masonry

Responsive masonry grid with staggered animations, spanning items, and automatic reflow.

```tsx
import { Masonry, MasonryItem, MasonrySpannedItem } from '@waveso/ui/masonry';

<Masonry columns={3} gap={16}>
  <MasonryItem>
    <Card>
      <CardContent>Standard item</CardContent>
    </Card>
  </MasonryItem>
  <MasonrySpannedItem>
    <Card>
      <CardContent>This spans two columns</CardContent>
    </Card>
  </MasonrySpannedItem>
  <MasonryItem>
    <Card>
      <CardContent>Another item</CardContent>
    </Card>
  </MasonryItem>
</Masonry>
```

## Components

60+ components covering forms, layout, navigation, feedback, and data display:

| Category | Components |
|---|---|
| **Actions** | Button, Button Group, Toggle, Toggle Group |
| **Forms** | Input, Textarea, Checkbox, Switch, Radio, Radio Group, Select, Combobox, Autocomplete, Slider, Calendar, Input OTP, Field, Form, Label, Input Group |
| **Layout** | Card, Masonry, Separator, Aspect Ratio, Scroll Area, Collapsible, Accordion, Tabs, Sidebar |
| **Navigation** | Breadcrumb, Navigation Menu, Pagination, Menubar |
| **Overlays** | Dialog, Alert Dialog, Sheet, Popover, Tooltip, Preview Card, Context Menu, Menu |
| **Feedback** | Alert, Badge, Progress, Skeleton, Spinner, Toaster, Empty |
| **Data** | Table, Avatar, Kbd, Item, Infinite Scroll |
| **Effects** | Burst, Explode, Encrypted Text, Shimmering Text, Expandable Tab, Dotted Glow Background |

## Requirements

| Dependency | Version |
|---|---|
| React | ^19.0.0 |
| React DOM | ^19.0.0 |
| Base UI | ^1.0.0 |
| Tailwind CSS | v4 |
| CVA | ^0.7.0 |
| clsx | ^2.0.0 |
| tailwind-merge | ^3.0.0 |

Some components have optional peer dependencies:

- **Calendar** — `react-day-picker`
- **Carousel** — `embla-carousel-react`
- **Form** — `react-hook-form`
- **Input OTP** — `input-otp`
- **Animations** — `motion`
- **Sidebar** — `usehooks-ts`

Install only what you use.

## Development

```bash
npm install
npm run storybook    # Start Storybook
npm run build        # Build the library
npm run typecheck    # Type-check
npm run dev          # Watch mode
```

### Project structure

```
.changeset/          # Changesets config
.storybook/          # Storybook config + theme CSS
src/
  *.tsx              # Component source files
  *.stories.tsx      # Storybook stories
  styles.css         # Theme preset (CSS variables + Tailwind mapping)
  hooks/             # Custom hooks
  lib/               # Utilities (cn, internal icons)
```

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) with GitHub Actions.

1. Run `npx changeset` to describe your changes (patch, minor, or major)
2. Commit the generated changeset file with your PR
3. When merged to `main`, CI automatically versions and publishes to npm

<details>
<summary>Manual release (without CI)</summary>

If you're not using the GitHub Actions workflow, you can publish manually.
Changesets will skip versions already published to npm, so this won't
conflict if CI has already run.

```bash
npx changeset              # Create a changeset
npx changeset version      # Apply version bump
npm run release             # Build and publish to npm
```

</details>

## License

MIT
