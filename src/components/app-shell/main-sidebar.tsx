"use client";

import React from "react";
import {
  FolderKanban,
  ClipboardCheck,
  DoorClosed,
  Cpu,
  Library,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "projects", label: "Dự án", icon: FolderKanban, active: true },
  { id: "survey", label: "Khảo sát", icon: ClipboardCheck, active: false },
  { id: "rooms", label: "Phòng", icon: DoorClosed, active: false },
  { id: "equipment", label: "Thiết bị", icon: Cpu, active: false },
  { id: "library", label: "Thư viện", icon: Library, active: false },
  { id: "reports", label: "Báo cáo", icon: FileText, active: false },
  { id: "settings", label: "Cài đặt", icon: Settings, active: false },
];

export const MainSidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useEditorStore();

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
          return (
            <button
              key={item.id}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all group relative",
                item.active
                  ? "bg-primary/15 text-primary border border-primary/30 shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-transform group-hover:scale-110",
                  item.active ? "text-primary" : "text-text-secondary group-hover:text-text-primary"
                )}
              />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              {item.active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-border/60">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-md transition-colors"
          title={sidebarCollapsed ? "Mở rộng thanh menu" : "Thu gọn thanh menu"}
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
