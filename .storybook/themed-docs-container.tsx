import * as React from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import { themes } from 'storybook/theming';

/**
 * Wraps the default DocsContainer and dynamically switches between
 * Storybook's light/dark docs theme based on the `dark` class on <html>.
 *
 * This class is managed by `withThemeByClassName` from @storybook/addon-themes,
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

  return (
    <DocsContainer
      {...props}
      theme={isDark ? themes.dark : themes.light}
    />
  );
}
