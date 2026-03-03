'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Foundation/Colors',
  parameters: {
    layout: 'padded',
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const TOKEN_GROUPS = [
  {
    label: 'Core',
    tokens: [
      { name: '--background', fg: '--foreground' },
      { name: '--foreground' },
    ],
  },
  {
    label: 'Brand',
    tokens: [
      { name: '--primary', fg: '--primary-foreground' },
      { name: '--secondary', fg: '--secondary-foreground' },
      { name: '--accent', fg: '--accent-foreground' },
    ],
  },
  {
    label: 'Semantic',
    tokens: [
      { name: '--destructive' },
      { name: '--success' },
      { name: '--warning' },
    ],
  },
  {
    label: 'Surfaces',
    tokens: [
      { name: '--card', fg: '--card-foreground' },
      { name: '--popover', fg: '--popover-foreground' },
      { name: '--muted', fg: '--muted-foreground' },
    ],
  },
  {
    label: 'Borders & Inputs',
    tokens: [
      { name: '--border' },
      { name: '--input' },
      { name: '--ring' },
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
    label: 'Sidebar',
    tokens: [
      { name: '--sidebar', fg: '--sidebar-foreground' },
      { name: '--sidebar-primary', fg: '--sidebar-primary-foreground' },
      { name: '--sidebar-accent', fg: '--sidebar-accent-foreground' },
      { name: '--sidebar-border' },
      { name: '--sidebar-ring' },
    ],
  },
] as const

function Swatch({ token, fg }: { token: string; fg?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [resolved, setResolved] = React.useState('')

  React.useEffect(() => {
    if (!ref.current) return
    const raw = getComputedStyle(ref.current).getPropertyValue(token).trim()
    setResolved(raw)
  }, [token])

  const label = token.replace(/^--/, '')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        ref={ref}
        style={{
          width: 48,
          height: 48,
          borderRadius: 10,
          backgroundColor: `var(${token})`,
          border: '1px solid rgba(128, 128, 128, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: 11,
          color: fg ? `var(${fg})` : undefined,
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
            color: '#a3a3a3',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 720 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 4px' }}>
          Color tokens
        </h2>
        <p style={{ fontSize: 14, color: '#a3a3a3', margin: '0 0 24px' }}>
          All colors are CSS custom properties defined in your theme. Override them in{' '}
          <code
            style={{
              fontSize: 12,
              padding: '2px 6px',
              borderRadius: 4,
              backgroundColor: 'rgba(128, 128, 128, 0.15)',
            }}
          >
            globals.css
          </code>{' '}
          to match your brand. Toggle between light and dark using the toolbar above.
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
              color: '#a3a3a3',
              margin: '0 0 12px',
            }}
          >
            {group.label}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 12,
            }}
          >
            {group.tokens.map((t) => (
              <Swatch key={t.name} token={t.name} fg={'fg' in t ? t.fg : undefined} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export const Palette: Story = {
  render: () => <ColorGrid />,
}
