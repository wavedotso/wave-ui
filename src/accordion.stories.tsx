import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';

const meta = {
  title: 'Layout/Accordion',
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Accordion className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          <p>Yes. It adheres to the WAI-ARIA design pattern.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          <p>
            Yes. It comes with default styles that match the other components.
          </p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          <p>
            Yes. It uses CSS animations for smooth open and close transitions.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion className="w-96" defaultValue={[0, 2]}>
      <AccordionItem value={0}>
        <AccordionTrigger>First section</AccordionTrigger>
        <AccordionContent>
          <p>Content for the first section.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value={1}>
        <AccordionTrigger>Second section</AccordionTrigger>
        <AccordionContent>
          <p>Content for the second section.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value={2}>
        <AccordionTrigger>Third section</AccordionTrigger>
        <AccordionContent>
          <p>Content for the third section.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Accordion className="w-96">
      <AccordionItem value="item-1">
        <AccordionTrigger>Available</AccordionTrigger>
        <AccordionContent>
          <p>This item can be expanded.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Disabled</AccordionTrigger>
        <AccordionContent>
          <p>This content is not reachable.</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Also available</AccordionTrigger>
        <AccordionContent>
          <p>This item can also be expanded.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
