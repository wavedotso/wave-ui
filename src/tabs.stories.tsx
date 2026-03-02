import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p>Manage your account settings and preferences.</p>
      </TabsContent>
      <TabsContent value="password">
        <p>Change your password and security settings.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p>Configure your application settings.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Line: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p>View your project overview and key metrics.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p>Dive into detailed analytics and trends.</p>
      </TabsContent>
      <TabsContent value="reports">
        <p>Generate and view reports.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="general" orientation="vertical">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <p>General settings for your application.</p>
      </TabsContent>
      <TabsContent value="appearance">
        <p>Customize the look and feel.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p>Manage your notification preferences.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const VerticalLine: Story = {
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical">
      <TabsList variant="line">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <p>Edit your profile information.</p>
      </TabsContent>
      <TabsContent value="billing">
        <p>Manage your billing and subscription.</p>
      </TabsContent>
      <TabsContent value="integrations">
        <p>Connect third-party services.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const WithDisabled: Story = {
  render: () => (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        <TabsTrigger value="other">Other</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <p>This tab is active.</p>
      </TabsContent>
      <TabsContent value="other">
        <p>This is the other tab.</p>
      </TabsContent>
    </Tabs>
  ),
};
