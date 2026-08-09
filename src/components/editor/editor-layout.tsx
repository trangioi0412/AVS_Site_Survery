"use client";

import React, { useState } from "react";
import { TopBar } from "../app-shell/top-bar";
import { MainSidebar } from "../app-shell/main-sidebar";
import { BottomToolbar } from "../app-shell/bottom-toolbar";
import { EquipmentLibraryPanel } from "./equipment-library/equipment-library-panel";
import { LayersPanel } from "./layers-panel/layers-panel";
import { PropertiesPanel } from "./properties-panel/properties-panel";
import { InfrastructureTable } from "./survey-panel/infrastructure-table";
import { PreviewPanel } from "./survey-panel/preview-panel";
import { OutputPanel } from "./survey-panel/output-panel";
import { ThreeViewport } from "./viewport/three-viewport";
import { HardDrive, Camera, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export const EditorLayout: React.FC = () => {
  const [leftTab, setLeftTab] = useState<"library" | "layers">("library");
  const [bottomTab, setBottomTab] = useState<"infra" | "preview" | "output">("infra");

  return (
    <div className="flex flex-col w-screen h-screen bg-background overflow-hidden text-text-primary">
      {/* 1. TOP BAR */}
      <TopBar />

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* 2. MAIN SIDEBAR */}
        <MainSidebar />

        {/* 3. LEFT PANEL: EQUIPMENT LIBRARY & LAYERS TREE */}
        <div className="w-[260px] xl:w-[280px] h-full flex flex-col border-r border-border bg-surface-1 shrink-0 z-10 hidden md:flex">
          {/* Tab Switcher between Library & Layers */}
          <div className="flex items-center border-b border-border/80 p-1 bg-surface-2/60 text-xs">
            <button
              onClick={() => setLeftTab("library")}
              className={cn(
                "flex-1 py-1.5 rounded font-medium text-center transition-colors",
                leftTab === "library"
                  ? "bg-surface-1 text-primary font-semibold shadow-sm border border-border/50"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Thư viện thiết bị
            </button>
            <button
              onClick={() => setLeftTab("layers")}
              className={cn(
                "flex-1 py-1.5 rounded font-medium text-center transition-colors",
                leftTab === "layers"
                  ? "bg-surface-1 text-primary font-semibold shadow-sm border border-border/50"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              Scene Layers
            </button>
          </div>

          {/* Panel View */}
          <div className="flex-1 overflow-hidden">
            {leftTab === "library" ? <EquipmentLibraryPanel /> : <LayersPanel />}
          </div>
        </div>

        {/* 4. CENTER WORKSPACE (3D VIEWPORT + BOTTOM SURVEY DATA) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-background">
          {/* 3D VIEWPORT */}
          <div className="flex-1 relative min-h-[300px]">
            <ThreeViewport />
          </div>

          {/* BOTTOM SURVEY DATA / PREVIEW / OUTPUT PANEL */}
          <div className="h-[220px] bg-surface-1 border-t border-border flex flex-col shrink-0 z-10">
            {/* Panel Tabs */}
            <div className="flex items-center justify-between px-3 bg-surface-2/80 border-b border-border/80 h-9 shrink-0 text-xs">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setBottomTab("infra")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-t-md font-medium transition-colors text-xs border-t border-x",
                    bottomTab === "infra"
                      ? "bg-surface-1 text-primary border-border border-b-surface-1 -mb-px font-semibold"
                      : "text-text-secondary hover:text-text-primary border-transparent"
                  )}
                >
                  <HardDrive className="w-3.5 h-3.5" />
                  <span>Hạ Tầng Khảo Sát</span>
                </button>

                <button
                  onClick={() => setBottomTab("preview")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-t-md font-medium transition-colors text-xs border-t border-x",
                    bottomTab === "preview"
                      ? "bg-surface-1 text-primary border-border border-b-surface-1 -mb-px font-semibold"
                      : "text-text-secondary hover:text-text-primary border-transparent"
                  )}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Preview Room</span>
                </button>

                <button
                  onClick={() => setBottomTab("output")}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-t-md font-medium transition-colors text-xs border-t border-x",
                    bottomTab === "output"
                      ? "bg-surface-1 text-primary border-border border-b-surface-1 -mb-px font-semibold"
                      : "text-text-secondary hover:text-text-primary border-transparent"
                  )}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Kết Quả</span>
                </button>
              </div>

              <div className="text-[11px] text-text-secondary hidden sm:inline">
                Khảo sát phòng họp Meeting Room 501 • AVS Site Planner
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="flex-1 overflow-hidden">
              {bottomTab === "infra" && <InfrastructureTable />}
              {bottomTab === "preview" && <PreviewPanel />}
              {bottomTab === "output" && <OutputPanel />}
            </div>
          </div>
        </div>

        {/* 5. RIGHT PANEL: OBJECT PROPERTIES PANEL */}
        <PropertiesPanel />
      </div>

      {/* 6. BOTTOM TOOLBAR */}
      <BottomToolbar />
    </div>
  );
};
