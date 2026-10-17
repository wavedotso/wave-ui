import type { Meta, StoryObj } from "@storybook/react-vite";

import { EncryptedText } from "./encrypted-text";

const meta = {
  title: "Effects/EncryptedText",
  component: EncryptedText,
} satisfies Meta<typeof EncryptedText>;

export default meta;
type Story = StoryObj;

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
      <EncryptedText
        text="This text reveals quickly!"
        revealDelayMs={20}
        flipDelayMs={30}
      />
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
      <EncryptedText
        text="Subtle scramble"
        scrambleOnly
        scrambleOneChar
        flipDelayMs={80}
      />
    </p>
  ),
};

export const WithStyling: Story = {
  render: () => (
    <p className="text-2xl font-mono">
      <EncryptedText
        text="Styled reveal effect"
        encryptedClassName="text-muted"
        revealedClassName="text-contrast"
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

export const FromCenter: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText
        text="Reveals from the middle out"
        revealDirection="center"
      />
    </p>
  ),
};

export const RandomOrder: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText
        text="Reveals in a random order"
        revealDirection="random"
        revealDelayMs={70}
      />
    </p>
  ),
};

export const ScrambleOnHover: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText text="Hover me to scramble again" scrambleOnHover />
    </p>
  ),
};

export const Loop: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText
        text="Decrypting, again and again"
        loop
        loopDelayMs={1500}
      />
    </p>
  ),
};

export const InSentence: Story = {
  render: () => (
    <p className="max-w-md text-lg">
      The words around it stay put:{" "}
      <EncryptedText
        text="no shifting while it scrambles"
        encryptedClassName="text-muted"
        loop
      />{" "}
      — each character keeps its real width.
    </p>
  ),
};

export const EmojiAndAccents: Story = {
  render: () => (
    <p className="text-lg font-medium">
      <EncryptedText text="Ship it 🚀 — café, naïve, 日本" />
    </p>
  ),
};
