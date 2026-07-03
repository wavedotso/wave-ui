import type { Preview, Decorator } from '@storybook/react';
import { useEffect } from 'storybook/preview-api';

import { ThemedDocsContainer } from './themed-docs-container';
import './storybook.css';

// One control, three themes — each carries its own palette AND mode, so there's
// no separate light/dark toggle to drift out of sync. The class on the preview
// <html> repoints the `--ui-*` alias and `.dark` flips the semantic mode; the
// whole UI re-skins from it. (The library still supports every palette × mode
// for consumers — this is just the curated set Storybook previews.)
const THEMES = {
  graphite: { class: 'theme-graphite', dark: true },
  ink: { class: 'theme-ink', dark: true },
  paper: { class: 'theme-paper', dark: false },
} as const;

type ThemeName = keyof typeof THEMES;

const withTheme: Decorator = (Story, context) => {
  const themeName = (context.globals.theme as ThemeName) ?? 'graphite';
  // Apply the palette class in an EFFECT (not the render phase) keyed on the
  // theme global. Docs pages don't re-run decorators on a globals change, so a
  // render-phase mutation would only land after a manual refresh — the effect
  // re-fires reactively on every surface (canvas + docs). This mirrors how
  // @storybook/addon-themes' `withThemeByClassName` applies its class.
  useEffect(() => {
    const root = document.documentElement;
    const theme = THEMES[themeName] ?? THEMES.graphite;
    Object.values(THEMES).forEach((t) => root.classList.remove(t.class));
    root.classList.add(theme.class);
    root.classList.toggle('dark', theme.dark);
  }, [themeName]);
  return Story();
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Wave theme',
    defaultValue: 'graphite',
    toolbar: {
      title: 'Theme',
      icon: 'paintbrush',
      items: [
        { value: 'graphite', title: 'Graphite', right: 'dark' },
        { value: 'ink', title: 'Ink', right: 'midnight' },
        { value: 'paper', title: 'Paper', right: 'light' },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    docs: {
      container: ThemedDocsContainer,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Welcome',
          'Colors', ['Overview', 'Palettes'],
          'Actions',
          'Data Display',
          'Feedback',
          'Forms',
          'Layout',
          'Navigation',
          'Overlay',
          'Utilities',
        ],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
