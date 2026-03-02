import type { Preview } from 'storybook/preview-api';
import { withThemeByClassName } from '@storybook/addon-themes';

import './storybook.css';

const preview: Preview = {
  decorators: [
    withThemeByClassName({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
    }),
  ],
  parameters: {
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
