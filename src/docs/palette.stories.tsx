'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Colors/Palettes',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Every color token in Wave, grouped by role. **Brand** is the Wave Blue ramp, **Themes** are the three neutral ramps (Graphite · Ink · Paper), and **Interface** is the semantic layer components actually consume. Swatches read the live CSS variables, so they reflect the theme selected in the toolbar.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Token = { name: string; label?: string; fg?: string; bg?: string }
type Group = { label: string; note?: string; tokens: Token[] }

// Wave Blue — the single brand ramp, shared by every theme.
const BRAND_GROUPS: Group[] = [
  {
    label: 'Wave — brand',
    note: 'Brand ramp, shared by every theme. `primary` and the focus ring resolve to wave-500.',
    tokens: [
      { name: '--wave-50' },
      { name: '--wave-100' },
      { name: '--wave-200' },
      { name: '--wave-300' },
      { name: '--wave-400' },
      { name: '--wave-500' },
      { name: '--wave-600' },
      { name: '--wave-700' },
      { name: '--wave-800' },
      { name: '--wave-900' },
      { name: '--wave-950' },
    ],
  },
]

// The three neutral ramps — one per theme. Only the active theme's ramp feeds `--ui-*`.
const THEME_GROUPS: Group[] = [
  {
    label: 'Graphite — neutral (default)',
    note: 'Default neutral ramp — active with no theme class (or `.theme-graphite`). Feeds `--ui-*`.',
    tokens: [
      { name: '--graphite-50' },
      { name: '--graphite-100' },
      { name: '--graphite-200' },
      { name: '--graphite-300' },
      { name: '--graphite-400' },
      { name: '--graphite-500' },
      { name: '--graphite-600' },
      { name: '--graphite-700' },
      { name: '--graphite-800' },
      { name: '--graphite-900' },
      { name: '--graphite-950' },
    ],
  },
  {
    label: 'Ink — navy',
    note: 'Deep-navy neutral ramp — active under `.theme-ink`.',
    tokens: [
      { name: '--ink-50' },
      { name: '--ink-100' },
      { name: '--ink-200' },
      { name: '--ink-300' },
      { name: '--ink-400' },
      { name: '--ink-500' },
      { name: '--ink-600' },
      { name: '--ink-700' },
      { name: '--ink-800' },
      { name: '--ink-900' },
      { name: '--ink-950' },
    ],
  },
  {
    label: 'Paper — warm',
    note: 'Warm cream → sepia neutral ramp — active under `.theme-paper`.',
    tokens: [
      { name: '--paper-50' },
      { name: '--paper-100' },
      { name: '--paper-200' },
      { name: '--paper-300' },
      { name: '--paper-400' },
      { name: '--paper-500' },
      { name: '--paper-600' },
      { name: '--paper-700' },
      { name: '--paper-800' },
      { name: '--paper-900' },
      { name: '--paper-950' },
    ],
  },
]

// The semantic layer — what components actually consume. Resolves through the
// active theme, so these are the tokens to override when re-skinning.
const INTERFACE_GROUPS: Group[] = [
  {
    label: 'Surfaces',
    note: 'Backgrounds = elevation.',
    tokens: [
      { name: '--foundation', fg: '--contrast' },
      { name: '--surface', fg: '--contrast' },
      { name: '--elevated', fg: '--contrast' },
    ],
  },
  {
    label: 'Contrast',
    note: 'Text / icons = emphasis (contrast → muted → soft).',
    tokens: [
      { name: '--contrast' },
      { name: '--muted' },
      { name: '--soft' },
    ],
  },
  {
    label: 'Inverse',
    note: 'Inverted neutral pair for surfaces like the dark tooltip.',
    tokens: [
      { name: '--surface-inverse', fg: '--contrast-inverse' },
      { name: '--contrast-inverse', fg: '--surface-inverse' },
    ],
  },
  {
    label: 'Brand roles',
    note: 'primary · secondary · accent. Text on the saturated fills is white; on the neutral secondary it is contrast.',
    tokens: [
      { name: '--primary', fg: 'white' },
      { name: '--secondary', fg: '--contrast' },
      { name: '--accent', fg: 'white' },
    ],
  },
  {
    label: 'Status',
    note: 'Semantic status colors. `info` resolves to Wave Blue (= `--primary` / `--focus`); `success` is a cool emerald (H155), kept distinct from the warning yellow.',
    tokens: [
      { name: '--destructive' },
      { name: '--success' },
      { name: '--warning' },
      { name: '--info' },
    ],
  },
  {
    label: 'Structure',
    note: 'Borders = structure (line · edge · solid); the ring is brand-themed (focus = primary).',
    tokens: [
      { name: '--line' },
      { name: '--edge' },
      { name: '--solid' },
      { name: '--focus' },
    ],
  },
  {
    label: 'Presence',
    note: 'Status dots. `invisible` resolves to `--foundation` — the page colour itself — so paired with a border it reads as a hollow/ghost ring: present, but blended away.',
    tokens: [
      { name: '--presence-online' },
      { name: '--presence-away' },
      { name: '--presence-busy' },
      { name: '--presence-invisible' },
    ],
  },
  {
    label: 'Shadow',
    tokens: [
      {
        name: '--shadow-color',
        label: 'shadow',
        bg: 'hsl(var(--shadow-color) / var(--shadow-strength))',
      },
    ],
  },
]

/** Format a computed `rgb()/rgba()` string as hex (opaque) or rgba (with alpha). */
function formatColor(value: string): string {
  const match = value.match(/^rgba?\(([^)]+)\)$/)
  if (!match) return value
  const parts = (match[1] ?? '').split(/[,\s/]+/).filter(Boolean)
  const r = Number(parts[0])
  const g = Number(parts[1])
  const b = Number(parts[2])
  const a = parts[3] !== undefined ? Number(parts[3]) : 1
  if ([r, g, b].some(Number.isNaN)) return value
  if (a < 1) return `rgba(${r}, ${g}, ${b}, ${Number(a.toFixed(3))})`
  const hex = (n: number) => n.toString(16).padStart(2, '0')
  return `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase()
}

function Swatch({ token: name, fg, label: labelOverride, bg }: { token: string; fg?: string; label?: string; bg?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [resolved, setResolved] = React.useState('')

  React.useEffect(() => {
    if (!ref.current) return
    // Read the RESOLVED background-color so tokens that alias another var
    // (e.g. `var(--ui-200)` → the active theme's ramp) display real hex/rgba.
    setResolved(formatColor(getComputedStyle(ref.current).backgroundColor))
  }, [name, bg])

  const label = labelOverride ?? name.replace(/^--(color-)?/, '')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        ref={ref}
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          backgroundColor: bg ?? `var(${name})`,
          border: '1px solid rgba(128, 128, 128, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 11,
          color: fg ? (fg.startsWith('--') ? `var(${fg})` : fg) : undefined,
          fontWeight: 600,
        }}
      >
        {fg ? 'Aa' : null}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: 'var(--soft)',
            fontFamily: 'monospace',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 180,
          }}
        >
          {resolved || '...'}
        </div>
      </div>
    </div>
  )
}

/** Shared swatch layout — one focused set of token groups, centered. */
function PaletteView({ groups }: { groups: Group[] }) {
  return (
    <div className="bg-foundation text-contrast p-10">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 760, margin: '0 auto' }}>
        {groups.map((group) => (
          <div key={group.label}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--muted)',
                margin: '0 0 4px',
              }}
            >
              {group.label}
            </h3>
            {group.note ? (
              <p style={{ fontSize: 12, color: 'var(--soft)', margin: '0 0 12px' }}>{group.note}</p>
            ) : (
              <div style={{ height: 8 }} />
            )}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 12,
              }}
            >
              {group.tokens.map((t) => (
                <Swatch
                  key={t.name}
                  token={t.name}
                  fg={'fg' in t ? t.fg : undefined}
                  bg={'bg' in t ? t.bg : undefined}
                  label={'label' in t ? t.label : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const Brand: Story = {
  render: () => <PaletteView groups={BRAND_GROUPS} />,
}

export const Themes: Story = {
  render: () => <PaletteView groups={THEME_GROUPS} />,
}

export const Interface: Story = {
  render: () => <PaletteView groups={INTERFACE_GROUPS} />,
}
