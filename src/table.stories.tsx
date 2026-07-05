'use client'

import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table'
import { Badge } from './badge'
import { Checkbox } from './checkbox'
import { Label } from './label'

const meta = {
  title: 'Data Display/Table',
  component: Table,
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

type Invoice = {
  id: string
  status: 'Paid' | 'Pending' | 'Overdue'
  method: string
  amount: number
}

const invoices: Invoice[] = [
  { id: 'INV-001', status: 'Paid', method: 'Credit Card', amount: 250.0 },
  { id: 'INV-002', status: 'Pending', method: 'PayPal', amount: 150.0 },
  { id: 'INV-003', status: 'Overdue', method: 'Bank Transfer', amount: 350.0 },
  { id: 'INV-004', status: 'Paid', method: 'Credit Card', amount: 450.0 },
  { id: 'INV-005', status: 'Pending', method: 'PayPal', amount: 550.0 },
]

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const statusVariant = {
  Paid: 'success',
  Pending: 'warning',
  Overdue: 'destructive',
} as const

/**
 * The full anatomy: `Table` (which renders the scrollable
 * `data-slot="table-container"` region), `TableHeader`, `TableBody`,
 * `TableFooter`, `TableRow`, `TableHead`, `TableCell`, and `TableCaption`.
 */
export const Default: Story = {
  render: () => (
    <div className="w-[560px]">
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell className="text-right">
                {currency.format(invoice.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {currency.format(
                invoices.reduce((sum, invoice) => sum + invoice.amount, 0)
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}

/**
 * The simplest useful table: header + body, no footer or caption.
 */
export const Basic: Story = {
  render: () => (
    <div className="w-[420px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Ada Lovelace</TableCell>
            <TableCell>Engineer</TableCell>
            <TableCell>London</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Grace Hopper</TableCell>
            <TableCell>Admiral</TableCell>
            <TableCell>New York</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Alan Turing</TableCell>
            <TableCell>Cryptanalyst</TableCell>
            <TableCell>Manchester</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}

/**
 * A `TableCaption` renders below the table (`caption-bottom`) and is
 * announced to screen readers as the table's accessible description.
 */
export const WithCaption: Story = {
  render: () => (
    <div className="w-[420px]">
      <Table>
        <TableCaption>Quarterly revenue by region, in thousands.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Region</TableHead>
            <TableHead className="text-right">Q1</TableHead>
            <TableHead className="text-right">Q2</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Americas</TableCell>
            <TableCell className="text-right">1,240</TableCell>
            <TableCell className="text-right">1,380</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">EMEA</TableCell>
            <TableCell className="text-right">980</TableCell>
            <TableCell className="text-right">1,120</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">APAC</TableCell>
            <TableCell className="text-right">760</TableCell>
            <TableCell className="text-right">840</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}

/**
 * A `TableFooter` (`<tfoot>`) is styled as a summary row — muted fill,
 * medium weight, top border. `colSpan` spans label cells to align a total.
 */
export const WithFooter: Story = {
  render: () => (
    <div className="w-[420px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Qty</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Keyboard</TableCell>
            <TableCell className="text-right">1</TableCell>
            <TableCell className="text-right">{currency.format(120)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Mouse</TableCell>
            <TableCell className="text-right">2</TableCell>
            <TableCell className="text-right">{currency.format(90)}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">{currency.format(210)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
}

/**
 * `Table` wraps its `<table>` in a focusable, horizontally scrollable
 * `data-slot="table-container"` region. Constrain the width and add wide
 * columns to see the overflow scroll — the region is keyboard-focusable
 * (`tabIndex={0}`) with a visible focus ring so scroll content is reachable.
 */
export const ScrollableOverflow: Story = {
  render: () => (
    <div className="w-[360px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice, index) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.id}</TableCell>
              <TableCell>Customer {index + 1}</TableCell>
              <TableCell>customer{index + 1}@example.com</TableCell>
              <TableCell>{invoice.method}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[invoice.status]}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {currency.format(invoice.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
}

function SelectableTable() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const allSelected = selected.size === invoices.length
  const someSelected = selected.size > 0 && !allSelected

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(invoices.map((invoice) => invoice.id)) : new Set())
  }

  const toggleRow = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  return (
    <div className="w-[520px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                id="select-all"
                aria-label="Select all rows"
                checked={allSelected}
                indeterminate={someSelected}
                onCheckedChange={toggleAll}
              />
              <Label htmlFor="select-all" className="sr-only">
                Select all rows
              </Label>
            </TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const isSelected = selected.has(invoice.id)
            return (
              <TableRow key={invoice.id} aria-selected={isSelected}>
                <TableCell>
                  <Checkbox
                    id={`select-${invoice.id}`}
                    aria-label={`Select ${invoice.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => toggleRow(invoice.id, checked)}
                  />
                  <Label htmlFor={`select-${invoice.id}`} className="sr-only">
                    Select {invoice.id}
                  </Label>
                </TableCell>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[invoice.status]}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {currency.format(invoice.amount)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

/**
 * Selectable rows: a `[role=checkbox]` cell (Base UI `Checkbox`) tightens
 * its own padding via `[&:has([role=checkbox])]:pr-0`, and a selected
 * `TableRow` gets `aria-selected` styling. The header checkbox drives a
 * select-all with an indeterminate state.
 */
export const Selectable: Story = {
  render: () => <SelectableTable />,
}
