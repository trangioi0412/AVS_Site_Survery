"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Box } from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";
import { resolveNavigationContext, getNavigationItems } from "@/lib/navigation-utils";
import { toast } from "sonner";

export const AppSidebar: React.FC = () => {
  const pathname = usePathname() || "";
  const {
    sidebarCollapsed,
    toggleSidebar,
    isHydrated,
    projects,
    rooms,
    currentProject,
    currentRoom,
  } = useEditorStore();

  const navContext = resolveNavigationContext(pathname, {
    isHydrated,
    projects,
    rooms,
    currentProject,
    currentRoom,
  });

  const navItems = getNavigationItems(pathname, navContext);

  const handleDisabledClick = (e: React.MouseEvent, reason?: string) => {
    e.preventDefault();
    if (reason) {
      toast.info(reason);
    }
  };

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
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;
            const isDisabled = item.disabled;

            return (
              <Link
                key={item.id}
                href={isDisabled ? "#" : item.href}
                onClick={isDisabled ? (e) => handleDisabledClick(e, item.disabledReason) : undefined}
                aria-disabled={isDisabled}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group relative",
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-sm font-semibold"
                    : isDisabled
                    ? "text-text-secondary/40 cursor-not-allowed hover:bg-transparent"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                )}
                title={
                  sidebarCollapsed
                    ? isDisabled && item.disabledReason
                      ? `${item.label} (${item.disabledReason})`
                      : item.label
                    : item.disabledReason
                }
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-transform",
                    isActive
                      ? "text-primary group-hover:scale-110"
                      : isDisabled
                      ? "text-text-secondary/30"
                      : "text-text-secondary group-hover:text-text-primary group-hover:scale-110"
                  )}
                />
                {!sidebarCollapsed && (
                  <span className={cn("truncate", isDisabled && "text-text-secondary/40")}>
                    {item.label}
                  </span>
                )}
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
