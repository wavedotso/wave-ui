/**
 * Internal-only SVG icons used by wave-ui components.
 *
 * NOT a public entry point — bundled into shared chunks via tsup splitting.
 */

import { forwardRef } from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

const SVG_BASE = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
} as const;

// ---------------------------------------------------------------------------
// Navigation chevrons
// ---------------------------------------------------------------------------

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ChevronUpIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}


export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

export function CheckIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function EllipsisIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

export function EllipsisVerticalIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

export function ChevronsUpDownIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="m7 15 5 5 5-5" />
      <path d="m7 9 5-5 5 5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// UI chrome
// ---------------------------------------------------------------------------

export function SidebarPanelIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

/** `forwardRef` because `Spinner` exposes this as `React.ComponentProps<"svg">`. */
export const LoaderIcon = forwardRef<SVGSVGElement, IconProps>(
  function LoaderIcon(props, ref) {
    return (
      <svg {...SVG_BASE} ref={ref} {...props}>
        <path d="M12 2v4" />
        <path d="m16.2 7.8 2.9-2.9" />
        <path d="M18 12h4" />
        <path d="m16.2 16.2 2.9 2.9" />
        <path d="M12 18v4" />
        <path d="m4.9 19.1 2.9-2.9" />
        <path d="M2 12h4" />
        <path d="m4.9 4.9 2.9 2.9" />
      </svg>
    );
  },
);

// ---------------------------------------------------------------------------
// Toast status icons
// ---------------------------------------------------------------------------

export function AlertTriangleIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

export function SuccessCircleIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <path d="M21.801 10A10 10 0 1 1 17 3.335" />
      <path d="m9 11 3 3L22 4" />
    </svg>
  );
}

export function InfoCircleIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}

export function ErrorCircleIcon(props: IconProps) {
  return (
    <svg {...SVG_BASE} {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
