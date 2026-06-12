import { Command, LayoutDashboard, Users, Sparkles, Mic } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";
import { NavUser } from "./nav-user.jsx";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "../ThemeToggle.jsx";

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Consultations", path: "/consultations", icon: Sparkles },
    { name: "Recordings", path: "/recordings", icon: Mic },
  ];

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2 py-2">
          {/* Branding Link */}
          <Link
            to="/dashboard"
            className="flex items-center gap-3 min-w-0 group"
          >
            {/* Logo Container: Using background tint for high-end minimal aesthetic */}
            {/* Logo Container */}
            <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 shadow-sm transition-colors group-hover:border-amber-500/40 overflow-hidden">
              {" "}
              {/* 👈 Added overflow-hidden */}
              <img
                src="/favicon.png"
                alt="AstroLedger Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>

            {/* Brand Text Area */}
            <div className="grid flex-1 text-left leading-tight min-w-0 gap-0.5">
              {/* FIXED: Increased text size to text-base and updated font weight */}
              <span className="truncate font-bold text-base text-foreground tracking-tight">
                AstroLedger
              </span>
              <span className="truncate text-[10px] text-muted-foreground/80 font-semibold uppercase tracking-wider">
                Enterprise
              </span>
            </div>
          </Link>

          {/* ThemeToggle */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>

      {/* Controlled Manual Divider */}
      <div className="mx-4 my-2 h-[1px] bg-sidebar-border/50" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                    >
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon className="size-4 shrink-0" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}