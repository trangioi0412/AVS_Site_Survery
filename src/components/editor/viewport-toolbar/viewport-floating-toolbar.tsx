"use client";

import React from "react";
import {
  MousePointer,
  Move,
  RotateCw,
  Scaling,
  Ruler,
  StickyNote,
  Eye,
  Box,
  Layers,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { EditorMode, ViewMode } from "@/types/editor";
import { cn } from "@/lib/utils";

export const ViewportFloatingToolbar: React.FC = () => {
  const { editorMode, setEditorMode, viewMode, setViewMode } = useEditorStore();

  return (
    <>
      {/* Floating Left/Center Toolbar */}
      <div className="absolute top-3 left-4 z-20 flex items-center gap-1 bg-surface-1/90 backdrop-blur-md p-1 rounded-lg border border-border/80 shadow-lg select-none">
        <button
          onClick={() => setEditorMode("select")}
          title="Chọn (Select)"
          className={cn(
            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs",
            editorMode === "select"
              ? "bg-primary text-white font-medium shadow"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Chọn</span>
        </button>

        <button
          onClick={() => setEditorMode("translate")}
          title="Di chuyển (Move)"
          className={cn(
            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs",
            editorMode === "translate"
              ? "bg-primary text-white font-medium shadow"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <Move className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Di chuyển</span>
        </button>

        <button
          onClick={() => setEditorMode("rotate")}
          title="Xoay (Rotate)"
          className={cn(
            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs",
            editorMode === "rotate"
              ? "bg-primary text-white font-medium shadow"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Xoay</span>
        </button>

        <button
          onClick={() => setEditorMode("scale")}
          title="Tỷ lệ (Scale)"
          className={cn(
            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs",
            editorMode === "scale"
              ? "bg-primary text-white font-medium shadow"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <Scaling className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Tỷ lệ</span>
        </button>

        <div className="w-px h-4 bg-border/60 mx-0.5" />

        <button
          onClick={() => setEditorMode("measure")}
          title="Đo đạc"
          className={cn(
            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs",
            editorMode === "measure"
              ? "bg-primary text-white font-medium shadow"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <Ruler className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Đo</span>
        </button>

        <button
          onClick={() => setEditorMode("note")}
          title="Ghi chú"
          className={cn(
            "p-1.5 rounded-md transition-all flex items-center gap-1 text-xs",
            editorMode === "note"
              ? "bg-primary text-white font-medium shadow"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <StickyNote className="w-3.5 h-3.5 text-warning" />
          <span className="hidden sm:inline">Ghi chú</span>
        </button>
      </div>

      {/* 2D / 3D Mode Switcher (Top Right Corner) */}
      <div className="absolute top-3 right-4 z-20 flex items-center bg-surface-1/90 backdrop-blur-md p-1 rounded-lg border border-border/80 shadow-lg select-none text-xs font-semibold">
        <button
          onClick={() => setViewMode("2d")}
          className={cn(
            "px-3 py-1 rounded-md transition-all flex items-center gap-1",
            viewMode === "2d"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D</span>
        </button>

        <button
          onClick={() => setViewMode("3d")}
          className={cn(
            "px-3 py-1 rounded-md transition-all flex items-center gap-1",
            viewMode === "3d"
              ? "bg-primary text-white shadow-sm"
              : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
          )}
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D</span>
        </button>
      </div>
    </>
  );
};
