import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';

import { ThemedDocsContainer } from './themed-docs-container';
import './storybook.css';

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: prefersDark ? 'dark' : 'light',
    }),
  ],
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
          'Foundation',
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
