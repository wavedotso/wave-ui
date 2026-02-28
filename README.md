# @waveso/ui

A React component library built on [Base UI](https://base-ui.com) primitives and [Tailwind CSS v4](https://tailwindcss.com). Ships unstyled, accessible components that you theme with CSS variables.

## Install

```bash
npm install @waveso/ui @base-ui/react class-variance-authority clsx tailwind-merge
```

## Usage

Import components by name — each is a separate entry point for optimal tree-shaking:

```tsx
import { Button } from '@waveso/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@waveso/ui/card';
import { Input } from '@waveso/ui/input';
```

### Theme setup

Components rely on CSS custom properties for colors, radii, and fonts. Define them in your app's `globals.css`:

```css
@import "tailwindcss";

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.61 0.11 222);
  --primary-foreground: oklch(0.98 0.02 201);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --destructive: oklch(0.58 0.22 27);
  --radius: 0.875rem;
  /* ... see full token list below */
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... map all tokens to Tailwind v4 */
}
```

See [`.storybook/storybook.css`](.storybook/storybook.css) for the complete token reference with light and dark mode values.

## Components

60+ components covering forms, layout, navigation, feedback, and data display:

| Category | Components |
|---|---|
| **Actions** | Button, Button Group, Toggle, Toggle Group |
| **Forms** | Input, Textarea, Checkbox, Switch, Radio, Radio Group, Select, Combobox, Autocomplete, Slider, Calendar, Input OTP, Field, Form, Label, Input Group |
| **Layout** | Card, Separator, Aspect Ratio, Scroll Area, Collapsible, Accordion, Tabs, Sidebar |
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
# Install dependencies
npm install

# Start Storybook
npm run storybook

# Build the library
npm run build

# Type-check
npm run typecheck

# Watch mode (rebuild on changes)
npm run dev
```

### Project structure

```
.changeset/          # Changesets config
.storybook/          # Storybook config + theme CSS
src/
  *.tsx              # Component source files
  *.stories.tsx      # Storybook stories
  hooks/             # Custom hooks
  lib/               # Utilities (cn, internal icons)
```

## Releasing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
# 1. Create a changeset describing your changes
npx changeset

# 2. Version bump (applied by CI or manually)
npx changeset version

# 3. Publish to npm (handled by CI)
npm run release
```

Merging to `main` with pending changesets triggers the publish workflow automatically.

## License

MIT
