"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  ClipboardCheck,
  DoorClosed,
  Box,
  Cpu,
  Library,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

export const MainSidebar: React.FC = () => {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, currentProject, currentRoom } = useEditorStore();

  const projId = currentProject?.id || "project-abc-building";
  const roomId = currentRoom?.id || "room-101";

  const NAV_ITEMS = [
    { id: "projects", label: "Dự án", href: "/projects", icon: FolderKanban },
    { id: "survey", label: "Khảo sát", href: `/projects/${projId}/survey`, icon: ClipboardCheck },
    { id: "rooms", label: "Phòng", href: `/projects/${projId}/rooms/${roomId}`, icon: DoorClosed },
    { id: "editor", label: "3D Editor", href: `/projects/${projId}/rooms/${roomId}/editor`, icon: Box },
    { id: "equipment", label: "Thiết bị", href: "/equipment", icon: Cpu },
    { id: "library", label: "Thư viện", href: "/library", icon: Library },
    { id: "reports", label: "Báo cáo", href: "/reports", icon: FileText },
    { id: "settings", label: "Cài đặt", href: "/settings", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "bg-surface-1 border-r border-border flex flex-col justify-between transition-all duration-200 z-20 shrink-0 select-none",
        sidebarCollapsed ? "w-[64px]" : "w-[140px]"
      )}
    >
      {/* Navigation List */}
      <nav className="p-2 space-y-1.5 mt-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.id === "editor"
              ? pathname.endsWith("/editor")
              : item.id === "rooms"
              ? pathname.includes("/rooms/") && !pathname.endsWith("/editor")
              : item.id === "survey"
              ? pathname.endsWith("/survey")
              : item.id === "projects"
              ? pathname === "/projects" || pathname === `/projects/${projId}`
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group relative",
                isActive
                  ? "bg-primary/15 text-primary border border-primary/30 shadow-sm font-semibold"
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

      {/* Collapse Toggle Footer */}
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
