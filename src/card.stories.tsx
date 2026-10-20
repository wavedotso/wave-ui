import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "./card";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "Layout/Card",
  component: Card,
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description with supporting text.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here.</p>
      </CardContent>
      <CardFooter>
        <Button variant="default" className="w-full">
          Action
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">
            Mark all read
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Your notification settings have been updated.</p>
      </CardContent>
    </Card>
  ),
};

export const WithForm: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy a new project in one click.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="My project" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="What's it about?" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button variant="default">Create</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Card {...args} className="w-[320px]">
      <CardHeader>
        <CardTitle>Compact Card</CardTitle>
        <CardDescription>Uses smaller padding.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Compact content layout.</p>
      </CardContent>
    </Card>
  ),
};

// An inline gradient, so the story needs no network.
const COVER =
  "data:image/svg+xml," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='760' height='320'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#0074DE'/><stop offset='1' stop-color='#7DD3FC'/></linearGradient></defs><rect width='760' height='320' fill='url(#g)'/></svg>",
  );

/** An image as the first child runs edge to edge under the card's top corners. */
export const WithImage: Story = {
  render: (args) => (
    <Card {...args} className="w-[380px]">
      <img src={COVER} alt="" className="aspect-[19/8] w-full object-cover" />
      <CardHeader>
        <CardTitle>Wave Blue</CardTitle>
        <CardDescription>The brand colour, edge to edge.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>The cover image sits flush with the card's top corners.</p>
      </CardContent>
    </Card>
  ),
};

/**
 * `render={<a />}` makes the whole card a link, with a hover, a clickable
 * cursor and a focus ring; `CardTitle render={<h3 />}` makes its title a
 * real heading.
 */
export const AsLink: Story = {
  render: (args) => (
    <Card {...args} render={<a href="#card" />} className="w-[380px]">
      <CardHeader>
        <CardTitle render={<h3 />}>Read the release notes</CardTitle>
        <CardDescription>Everything that changed in 0.13.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>The whole card is one link: hover it, or tab to it.</p>
      </CardContent>
    </Card>
  ),
};
