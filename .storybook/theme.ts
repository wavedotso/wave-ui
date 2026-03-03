import { create } from 'storybook/theming';

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

export const waveTheme = create({
  base: prefersDark ? 'dark' : 'light',
  brandTitle: 'Wave UI',
  brandUrl: 'https://wave.so',
  brandImage: '/logo.svg',
  brandTarget: '_self',
});
