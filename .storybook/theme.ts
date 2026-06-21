import { create } from 'storybook/theming';

const prefersDark =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

// Storybook's manager (sidebar / toolbar / canvas frame) renders OUTSIDE the
// preview iframe, so it can't read our `--foundation` / `--surface` CSS vars.
// Mirror their hex values here so the whole Storybook shell matches the theme.
// Keep in sync with src/styles.css.
const FOUNDATION = { light: '#EEF0F3', dark: '#2C2D32' };
const SURFACE = { light: '#F6F7F9', dark: '#323339' };

const mode = prefersDark ? 'dark' : 'light';

export const waveTheme = create({
  base: mode,
  appBg: FOUNDATION[mode],
  appContentBg: FOUNDATION[mode],
  appPreviewBg: FOUNDATION[mode],
  barBg: SURFACE[mode],
  brandTitle: 'Wave UI',
  brandUrl: 'https://wave.so',
  brandImage: '/logo.svg',
  brandTarget: '_self',
});
