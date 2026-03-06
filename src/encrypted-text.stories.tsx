import type { Meta, StoryObj } from '@storybook/react-vite';

import { EncryptedText } from './encrypted-text';

const meta = {
  title: 'Data Display/EncryptedText',
  component: EncryptedText,
} satisfies Meta<typeof EncryptedText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText text="Hello, World!" />
    </p>
  ),
};

export const SlowReveal: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText text="This text reveals slowly..." revealDelayMs={150} />
    </p>
  ),
};

export const FastReveal: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText text="This text reveals quickly!" revealDelayMs={20} flipDelayMs={30} />
    </p>
  ),
};

export const ScrambleOnly: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText text="Never revealed" scrambleOnly />
    </p>
  ),
};

export const ScrambleOneChar: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText text="Subtle scramble" scrambleOnly scrambleOneChar flipDelayMs={80} />
    </p>
  ),
};

export const WithStyling: Story = {
  render: () => (
    <p className="text-2xl font-mono">
      <EncryptedText
        text="Styled reveal effect"
        encryptedClassName="text-muted-foreground"
        revealedClassName="text-foreground"
        revealDelayMs={80}
      />
    </p>
  ),
};

export const CustomCharset: Story = {
  render: () => (
    <p className="text-lg font-mono">
      <EncryptedText
        text="Binary vibes"
        charset="01"
        revealDelayMs={100}
        flipDelayMs={40}
      />
    </p>
  ),
};
