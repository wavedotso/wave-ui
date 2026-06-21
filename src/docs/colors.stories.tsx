'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Foundation/Colors',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Token = { name: string; label?: string; fg?: string; bg?: string }

const TOKEN_GROUPS: { label: string; note?: string; tokens: Token[] }[] = [
  {
    label: 'Ion palette',
    note: 'Neutral ramp — every surface, content, and structure token resolves to one of these.',
    tokens: [
      { name: '--ion-50' },
      { name: '--ion-100' },
      { name: '--ion-200' },
      { name: '--ion-300' },
      { name: '--ion-400' },
      { name: '--ion-500' },
      { name: '--ion-600' },
      { name: '--ion-700' },
      { name: '--ion-800' },
      { name: '--ion-900' },
      { name: '--ion-950' },
    ],
  },
  {
    label: 'Wave palette',
    note: 'Brand ramp — `primary` (and the focus ring) resolve to wave-500.',
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
    label: 'Brand',
    note: 'primary · secondary · accent. Text on the saturated fills is white; on the neutral secondary it is contrast.',
    tokens: [
      { name: '--primary', fg: 'white' },
      { name: '--secondary', fg: '--contrast' },
      { name: '--accent', fg: 'white' },
    ],
  },
  {
    label: 'Status',
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
    label: 'Charts',
    tokens: [
      { name: '--chart-1' },
      { name: '--chart-2' },
      { name: '--chart-3' },
      { name: '--chart-4' },
      { name: '--chart-5' },
    ],
  },
  {
    label: 'Presence',
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
    // (e.g. `var(--ion-200)`) display their real hex/rgba.
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

function ColorGrid() {
  return (
    <div className="bg-foundation text-contrast p-10">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 760 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>Color tokens</h2>
          <p style={{ fontSize: 14, color: 'var(--muted)', margin: 0 }}>
            Two raw palettes (Ion · Wave) feed every semantic token. Override the semantic
            tokens in your own <code
              style={{
                fontSize: 12,
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: 'var(--surface)',
              }}
            >
              :root
            </code>{' '}
            / <code
              style={{
                fontSize: 12,
                padding: '2px 6px',
                borderRadius: 4,
                backgroundColor: 'var(--surface)',
              }}
            >
              .dark
            </code> to match your brand. Toggle light / dark in the toolbar above.
          </p>
        </div>

        {TOKEN_GROUPS.map((group) => (
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

export const Palette: Story = {
  render: () => <ColorGrid />,
}
