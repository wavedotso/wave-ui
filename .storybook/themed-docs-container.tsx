import * as React from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { create } from 'storybook/theming';

// The autodocs page renders INSIDE the preview iframe, where the library's
// `styles.css` is loaded — so we theme its chrome straight from the CSS vars
// (no hardcoded hex). The surfaces resolve against whatever palette class is on
// <html>, so Graphite / Ink / Paper are each painted correctly, live.
//
// The one value that can't be a var is Storybook's `base` discriminator — it
// drives the docs' text / code / border colors — so we still flip it between
// light and dark by observing the `.dark` class on <html>.
const docsTheme = (dark: boolean) =>
  create({
    base: dark ? 'dark' : 'light',
    appBg: 'var(--foundation)',
    appContentBg: 'var(--foundation)',
    appPreviewBg: 'var(--foundation)',
    barBg: 'var(--surface)',
  });

/**
 * Wraps the default DocsContainer and flips its light/dark `base` from the
 * `.dark` class on <html> (managed by the `withTheme` decorator in
 * `preview.ts`), so docs pages stay in sync with the theme toolbar. The
 * background colors themselves come from CSS vars, so they need no observer.
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
