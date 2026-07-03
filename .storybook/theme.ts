import { create } from 'storybook/theming';

// Storybook's manager (sidebar / toolbar / canvas frame) renders OUTSIDE the
// preview iframe, so it never loads the library's `styles.css` — `var(--…)`
// would resolve to nothing here. It also can't follow the per-story theme (the
// manager is themed once, at boot). So we pin it to the Graphite-dark default
// and mirror just those two token values. This is the ONLY place a token has to
// be hardcoded; keep it in sync with src/styles.css (`.dark` graphite ramp).
const FOUNDATION = '#2C2D32'; // graphite-950 → .dark `--foundation`
const SURFACE = '#323339'; // graphite-900 → .dark `--surface`

export const waveTheme = create({
  base: 'dark',
  appBg: FOUNDATION,
  appContentBg: FOUNDATION,
  appPreviewBg: FOUNDATION,
  barBg: SURFACE,
  brandTitle: 'Wave UI',
  brandUrl: 'https://wave.so',
  brandImage: '/logo.svg',
  brandTarget: '_self',
});
