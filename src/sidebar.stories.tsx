import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './sidebar';

const meta = {
  title: 'Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// CSS variable overrides matching the Wave app
// ---------------------------------------------------------------------------

const SIDEBAR_STYLE = {
  '--sidebar-width': '15rem',
  '--sidebar-width-icon': '3.75rem',
} as React.CSSProperties;

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function InboxIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MoreHorizontalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const NAV_ITEMS = [
  { label: 'Home', icon: HomeIcon },
  { label: 'Inbox', icon: InboxIcon, badge: '12' },
  { label: 'Calendar', icon: CalendarIcon },
  { label: 'Search', icon: SearchIcon },
  { label: 'Settings', icon: SettingsIcon },
];

const PROJECTS = [
  { name: 'Design System', emoji: '🎨' },
  { name: 'Mobile App', emoji: '📱' },
  { name: 'Marketing Site', emoji: '🌐' },
  { name: 'API Platform', emoji: '🔗' },
];

// ---------------------------------------------------------------------------
// Shared components
// ---------------------------------------------------------------------------

function WaveLogomarkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 176 144" fill="none" stroke="currentColor" strokeWidth="12" aria-label="Wave" {...props}>
      <path d="M88 30c32.033 0 58-5.373 58-12S120.033 6 88 6c-32.032 0-58 5.373-58 12s25.968 12 58 12Z" />
      <path d="M88 84c45.287 0 82-5.373 82-12s-36.713-12-82-12S6 65.373 6 72s36.713 12 82 12Z" />
      <path d="M88 138c32.033 0 58-5.373 58-12s-25.967-12-58-12c-32.032 0-58 5.373-58 12s25.968 12 58 12Z" />
    </svg>
  );
}

/** Trigger that only renders when the sidebar is collapsed. */
function CollapsedTrigger() {
  const { state } = useSidebar();
  if (state !== 'collapsed') return null;
  return <SidebarTrigger />;
}

function DemoContent() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted/50 aspect-video rounded-xl" />
        ))}
      </div>
      <div className="bg-muted/50 min-h-[50vh] flex-1 rounded-xl" />
    </div>
  );
}

/** Default sidebar with navigation, projects, and content area. Press Cmd+B to toggle. */
export const Default: Story = {
  render: () => (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-3 p-1.5">
                <div className="flex size-8 shrink-0 items-center justify-center">
                  <WaveLogomarkIcon className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Wave</span>
                  <span className="text-muted-foreground truncate text-xs">
                    Foundation
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.label === 'Home'} tooltip={item.label}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    {item.badge && (
                      <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Projects</SidebarGroupLabel>
            <SidebarGroupAction title="Add Project">
              <PlusIcon />
              <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent>
              <SidebarMenu>
                {PROJECTS.map((project) => (
                  <SidebarMenuItem key={project.name}>
                    <SidebarMenuButton tooltip={project.name}>
                      <span>{project.emoji}</span>
                      <span>{project.name}</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontalIcon />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-3 p-1.5">
                <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs">
                  S
                </div>
                <span>Saulo</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <DemoContent />
      </SidebarInset>
    </SidebarProvider>
  ),
};

/** Icon-collapsible sidebar. Click the rail or press Cmd+B to collapse to icons. */
export const IconCollapsible: Story = {
  render: () => (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="pb-0">
            <div className="flex items-center gap-1">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="gap-3 p-1.5">
                    <div className="flex size-8 shrink-0 items-center justify-center">
                      <WaveLogomarkIcon className="size-6" />
                    </div>
                    <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">Wave</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              </SidebarMenu>
              <SidebarTrigger className="text-muted-foreground group-data-[collapsible=icon]:hidden" />
            </div>
          </SidebarHeader>

          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.label === 'Home'} tooltip={item.label}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-3 p-1.5">
                <div className="bg-muted flex size-8 items-center justify-center rounded-full text-xs">
                  S
                </div>
                <span className="group-data-[collapsible=icon]:hidden">Saulo</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <CollapsedTrigger />
          <span className="text-sm font-medium">Icon Mode</span>
        </header>
        <DemoContent />
      </SidebarInset>
    </SidebarProvider>
  ),
};

/** Floating variant with rounded corners and shadow. */
export const Floating: Story = {
  render: () => (
    <SidebarProvider className="bg-background" style={SIDEBAR_STYLE}>
      <Sidebar variant="floating" collapsible="icon">
        <SidebarContent>
          <SidebarHeader className="pb-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="gap-3 p-1.5">
                  <div className="flex size-8 shrink-0 items-center justify-center">
                    <WaveLogomarkIcon className="size-6" />
                  </div>
                  <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">Wave</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.label === 'Home'} tooltip={item.label}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Floating Variant</span>
        </header>
        <DemoContent />
      </SidebarInset>
    </SidebarProvider>
  ),
};

/** Inset variant where the sidebar is visually embedded in the layout. */
export const Inset: Story = {
  render: () => (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="gap-3 p-1.5">
                <div className="flex size-8 shrink-0 items-center justify-center">
                  <WaveLogomarkIcon className="size-6" />
                </div>
                <span className="truncate text-sm font-medium group-data-[collapsible=icon]:hidden">Wave</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton isActive={item.label === 'Home'}>
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Inset Variant</span>
        </header>
        <DemoContent />
      </SidebarInset>
    </SidebarProvider>
  ),
};

/** Right-side sidebar. */
export const RightSide: Story = {
  render: () => (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <span className="text-sm font-medium">Right Sidebar</span>
          <div className="ml-auto">
            <SidebarTrigger />
          </div>
        </header>
        <DemoContent />
      </SidebarInset>

      <Sidebar side="right" collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Details</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_ITEMS.slice(0, 3).map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton tooltip={item.label}>
                      <item.icon />
                      <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  ),
};

/** Sidebar with nested sub-menus. */
export const WithSubMenu: Story = {
  render: () => (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>
                    <HomeIcon />
                    <span>Getting Started</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton isActive>
                        <span>Installation</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Configuration</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton>
                        <span>Theming</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <SearchIcon />
                    <span>Components</span>
                    <ChevronRightIcon className="ml-auto" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">With Sub-menu</span>
        </header>
        <DemoContent />
      </SidebarInset>
    </SidebarProvider>
  ),
};

/** Skeleton loading state. */
export const Loading: Story = {
  render: () => (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSkeleton showIcon />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Loading...</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {Array.from({ length: 5 }).map((_, i) => (
                  <SidebarMenuItem key={i}>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 items-center gap-2 px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">Loading</span>
        </header>
        <DemoContent />
      </SidebarInset>
    </SidebarProvider>
  ),
};
