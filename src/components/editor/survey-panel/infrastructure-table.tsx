"use client";

import React, { useState } from "react";
import { MOCK_INFRASTRUCTURE } from "@/data/mock-infrastructure";
import { useEditorStore } from "@/stores/editor-store";
import { Network, Zap, Plug, Volume2, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

export const InfrastructureTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ALL" | "LAN" | "PWR" | "AV">("ALL");
  const { selectedObjectId, selectObject } = useEditorStore();

  const filteredItems = MOCK_INFRASTRUCTURE.filter((item) => {
    if (activeTab === "LAN") return item.type === "LAN";
    if (activeTab === "PWR") return item.type === "PWR";
    if (activeTab === "AV") return item.type === "HDMI" || item.type === "AUDIO";
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-surface-1 overflow-hidden select-none text-xs">
      {/* Header & Filter Tabs */}
      <div className="p-2 border-b border-border/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 font-bold text-text-primary uppercase tracking-wider text-[11px]">
          <HardDrive className="w-3.5 h-3.5 text-primary" />
          <span>Hạ Tầng Khảo Sát (Existing Infrastructure)</span>
        </div>

        {/* Sub-tabs */}
        <div className="flex items-center gap-1 bg-surface-2 p-0.5 rounded border border-border/60 text-[10px]">
          <button
            onClick={() => setActiveTab("ALL")}
            className={cn(
              "px-2 py-0.5 rounded font-medium transition-colors",
              activeTab === "ALL" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Tất cả ({MOCK_INFRASTRUCTURE.length})
          </button>
          <button
            onClick={() => setActiveTab("LAN")}
            className={cn(
              "px-2 py-0.5 rounded font-medium transition-colors",
              activeTab === "LAN" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Mạng (LAN)
          </button>
          <button
            onClick={() => setActiveTab("PWR")}
            className={cn(
              "px-2 py-0.5 rounded font-medium transition-colors",
              activeTab === "PWR" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            )}
          >
            Điện (PWR)
          </button>
          <button
            onClick={() => setActiveTab("AV")}
            className={cn(
              "px-2 py-0.5 rounded font-medium transition-colors",
              activeTab === "AV" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            )}
          >
            AV Signal
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <table className="w-full text-left border-collapse">
          <thead className="text-[10px] text-text-secondary uppercase">
            <tr>
              <th className="py-1.5 px-3 font-semibold sticky top-0 z-10 bg-surface-2 border-b border-border/60">Loại</th>
              <th className="py-1.5 px-3 font-semibold sticky top-0 z-10 bg-surface-2 border-b border-border/60">Tên / Mã</th>
              <th className="py-1.5 px-3 font-semibold sticky top-0 z-10 bg-surface-2 border-b border-border/60">Vị trí</th>
              <th className="py-1.5 px-3 font-semibold sticky top-0 z-10 bg-surface-2 border-b border-border/60">Mô tả chi tiết</th>
              <th className="py-1.5 px-3 font-semibold text-right sticky top-0 z-10 bg-surface-2 border-b border-border/60">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 text-[11px]">
            {filteredItems.map((item) => {
              const isSelected = selectedObjectId === item.objectId;
              return (
                <tr
                  key={item.id}
                  onClick={() => item.objectId && selectObject(item.objectId)}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-surface-2/70",
                    isSelected ? "bg-primary/20 text-text-primary font-medium" : "text-text-secondary"
                  )}
                >
                  <td className="py-1.5 px-3">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] bg-surface-3 px-1.5 py-0.5 rounded border border-border/60 text-text-primary">
                      {item.type === "LAN" && <Network className="w-3 h-3 text-status-existing" />}
                      {item.type === "PWR" && <Zap className="w-3 h-3 text-status-warning" />}
                      {(item.type === "HDMI" || item.type === "AUDIO") && <Plug className="w-3 h-3 text-primary" />}
                      {item.type}
                    </span>
                  </td>
                  <td className="py-1.5 px-3 font-mono font-semibold text-text-primary">{item.code}</td>
                  <td className="py-1.5 px-3">{item.location}</td>
                  <td className="py-1.5 px-3 truncate max-w-[200px] text-text-secondary">{item.description}</td>
                  <td className="py-1.5 px-3 text-right">
                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-status-existing/15 text-status-existing border border-status-existing/30">
                      Hiện có
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
