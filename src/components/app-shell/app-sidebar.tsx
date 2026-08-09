"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardCheck,
  Cpu,
  Library,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Box,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

export const AppSidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, currentProject } = useEditorStore();

  const NAV_ITEMS = [
    { id: "dashboard", href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "projects", href: "/projects", label: "Dự án", icon: FolderKanban },
    {
      id: "survey",
      href: currentProject?.id ? `/projects/${currentProject.id}/survey` : "/projects",
      label: "Khảo sát",
      icon: ClipboardCheck,
    },
    { id: "equipment", href: "/equipment", label: "Thiết bị", icon: Cpu },
    { id: "library", href: "/library", label: "Thư viện", icon: Library },
    { id: "reports", href: "/reports", label: "Báo cáo", icon: FileText },
    { id: "settings", href: "/settings", label: "Cài đặt", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "bg-surface-1 border-r border-border flex flex-col justify-between transition-all duration-200 z-20 shrink-0 select-none h-screen sticky top-0",
        sidebarCollapsed ? "w-[64px]" : "w-[200px]"
      )}
    >
      <div>
        {/* Brand Header */}
        <div className="h-[56px] px-3 border-b border-border/80 flex items-center gap-2.5">
          <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-text-primary text-sm group">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform shrink-0">
              <Box className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent font-bold tracking-wide truncate">
                AV Survey <span className="text-[10px] font-normal px-1 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 ml-0.5">3D</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-1 mt-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href) ||
                  (item.id === "projects" && pathname.startsWith("/projects"));

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group relative",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                )}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                  )}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Toggle */}
      <div className="p-2 border-t border-border/60">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-md transition-colors"
          title={sidebarCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
          aria-label="Toggle Sidebar"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="truncate">Thu gọn</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
