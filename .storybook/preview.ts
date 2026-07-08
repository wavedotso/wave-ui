import type { Preview, Decorator } from "@storybook/react";
import { useEffect } from "storybook/preview-api";

import { ThemedDocsContainer } from "./themed-docs-container";
import "./storybook.css";

// One control, three themes — each maps to its identity class on the preview
// <html>: `.paper` (light), `.graphite` (dark), `.ink` (dark night). Each class
// is a complete, self-contained theme, so there's no separate light/dark toggle.
const THEMES = {
  graphite: { class: "graphite" },
  paper: { class: "paper" },
  ink: { class: "ink" },
} as const;

type ThemeName = keyof typeof THEMES;

const THEME_CLASSES = ["paper", "graphite", "ink"];

const withTheme: Decorator = (Story, context) => {
  const themeName = (context.globals.theme as ThemeName) ?? "graphite";
  // Apply the palette class in an EFFECT (not the render phase) keyed on the
  // theme global. Docs pages don't re-run decorators on a globals change, so a
  // render-phase mutation would only land after a manual refresh — the effect
  // re-fires reactively on every surface (canvas + docs). This mirrors how
  // @storybook/addon-themes' `withThemeByClassName` applies its class.
  useEffect(() => {
    const root = document.documentElement;
    const theme = THEMES[themeName] ?? THEMES.graphite;
    root.classList.remove(...THEME_CLASSES);
    root.classList.add(theme.class);
  }, [themeName]);
  return Story();
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Wave theme",
    defaultValue: "graphite",
    toolbar: {
      title: "Theme",
      icon: "paintbrush",
      items: [
        { value: "graphite", title: "Graphite", right: "dark" },
        { value: "paper", title: "Paper", right: "light" },
        { value: "ink", title: "Ink", right: "night" },
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
    layout: "centered",
    options: {
      storySort: {
        order: [
          "Welcome",
          "Colors",
          ["Overview", "Palettes"],
          "Actions",
          "Data Display",
          "Feedback",
          "Forms",
          "Layout",
          "Navigation",
          "Overlay",
          "Utilities",
          "Effects",
        ],
      },
    },
  },
  tags: ["autodocs"],
};

export default preview;
