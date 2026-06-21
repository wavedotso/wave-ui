import * as React from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { create } from 'storybook/theming';

// Paint the autodocs page (and its preview blocks) on our `--foundation` /
// `--surface` tokens instead of Storybook's default `#222425` docs theme.
// The docs theme is a manager-side object that can't read the preview iframe's
// CSS vars, so mirror the hex values. Keep in sync with src/styles.css.
const FOUNDATION = { light: '#EEF0F3', dark: '#2C2D32' };
const SURFACE = { light: '#F6F7F9', dark: '#323339' };

const docsTheme = (dark: boolean) =>
  create({
    base: dark ? 'dark' : 'light',
    appBg: dark ? FOUNDATION.dark : FOUNDATION.light,
    appContentBg: dark ? FOUNDATION.dark : FOUNDATION.light,
    appPreviewBg: dark ? FOUNDATION.dark : FOUNDATION.light,
    barBg: dark ? SURFACE.dark : SURFACE.light,
  });

/**
 * Wraps the default DocsContainer and dynamically switches its theme between
 * our light/dark foundation based on the `dark` class on <html>.
 *
 * That class is managed by `withThemeByClassName` from @storybook/addon-themes,
 * so the docs pages stay in sync with the toolbar theme toggle.
 */
export function ThemedDocsContainer(
  props: React.PropsWithChildren<DocsContainerProps>,
) {
  const [isDark, setIsDark] = React.useState(
    document.documentElement.classList.contains('dark'),
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return <DocsContainer {...props} theme={docsTheme(isDark)} />;
}
