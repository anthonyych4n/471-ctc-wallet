"use client";

import {
  CameraIcon,
  FileCodeIcon,
  FileTextIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "user",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },

    // {
    //   title: "Budgets",
    //   url: "#",
    //   icon: ListIcon,
    // },
    // {
    //   title: "Saving Goals",
    //   url: "#",
    //   icon: BarChartIcon,
    // },
    // {
    //   title: "Investments",
    //   url: "#",
    //   icon: FolderIcon,
    // },
    // {
    //   title: "Expenses",
    //   url: "#",
    //   icon: UsersIcon,
    // },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ],
  // documents: [
  // {
  //   name: "Data Library",
  //   url: "#",
  //   icon: DatabaseIcon,
  // },
  // {
  //   name: "Reports",
  //   url: "#",
  //   icon: ClipboardListIcon,
  // },
  // {
  //   name: "Word Assistant",
  //   url: "#",
  //   icon: FileIcon,
  // },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  // checks which dashboard to redirect to based on current path by seeing if the pathname includes '/admin' or not
  // if not, then it defaults to '/dashboard' for users
  const dashboardUrl = pathname.includes("/admin") ? "/admin" : "/dashboard";

  // creating a dynamic data object with the correct dashboard URL
  const sidebarData = {
    ...data,
    navMain: [
      {
        title: "Dashboard",
        url: dashboardUrl, // dynamic URL based on current path
        icon: LayoutDashboardIcon,
      },
      //
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <img src="/logo.svg" alt="CTC logo" className="w-6 h-6" />
                <span className="text-base font-semibold">CTC Wallet</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={sidebarData.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
