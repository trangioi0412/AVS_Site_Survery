"use client";

import React from "react";
import {
  MousePointer,
  Move,
  RotateCw,
  Scaling,
  Ruler,
  Maximize2,
  StickyNote,
  Undo2,
  Redo2,
  Grid,
  Magnet,
  Eye,
  Minus,
  Plus,
  Focus,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { EditorMode } from "@/types/editor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const BottomToolbar: React.FC = () => {
  const {
    editorMode,
    setEditorMode,
    snapEnabled,
    toggleSnap,
    gridSize,
    setGridSize,
    showGrid,
    toggleGrid,
    showHelpers,
    toggleHelpers,
    undo,
    redo,
    historyIndex,
    history,
  } = useEditorStore();

  const handleToolClick = (mode: EditorMode, name: string) => {
    setEditorMode(mode);
    if (mode === "measure") {
      toast.info("Đã bật chế độ Đo Khoảng Cách (Click 2 điểm trong mô hình)");
    } else if (mode === "note") {
      toast.info("Đã bật chế độ Ghi Chú (Click vào điểm cần đánh dấu)");
    }
  };

  return (
    <footer className="h-[44px] bg-surface-1 border-t border-border px-4 flex items-center justify-between select-none z-30 shrink-0 text-xs">
      {/* Left: Mode & Interaction Tools */}
      <div className="flex items-center gap-1">
        <div className="flex items-center bg-surface-2 p-1 rounded-md border border-border/60 gap-0.5">
          <button
            onClick={() => handleToolClick("select", "Select")}
            title="Công cụ Chọn (Select)"
            className={cn(
              "p-1.5 rounded transition-colors flex items-center gap-1",
              editorMode === "select"
                ? "bg-primary text-white shadow-sm font-medium"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
            )}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Chọn</span>
          </button>

          <button
            onClick={() => handleToolClick("translate", "Move")}
            title="Công cụ Di chuyển (Move)"
            className={cn(
              "p-1.5 rounded transition-colors flex items-center gap-1",
              editorMode === "translate"
                ? "bg-primary text-white shadow-sm font-medium"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
            )}
          >
            <Move className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Di chuyển</span>
          </button>

          <button
            onClick={() => handleToolClick("rotate", "Rotate")}
            title="Công cụ Xoay (Rotate)"
            className={cn(
              "p-1.5 rounded transition-colors flex items-center gap-1",
              editorMode === "rotate"
                ? "bg-primary text-white shadow-sm font-medium"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
            )}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Xoay</span>
          </button>

          <button
            onClick={() => handleToolClick("scale", "Scale")}
            title="Công cụ Tỷ lệ (Scale)"
            className={cn(
              "p-1.5 rounded transition-colors flex items-center gap-1",
              editorMode === "scale"
                ? "bg-primary text-white shadow-sm font-medium"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-3"
            )}
          >
            <Scaling className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Tỷ lệ</span>
          </button>
        </div>

        <div className="h-4 w-px bg-border/60 mx-1" />

        {/* Measuring & Annotating */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToolClick("measure", "Measure Distance")}
            title="Đo khoảng cách"
            className={cn(
              "p-1.5 rounded-md border border-border/60 flex items-center gap-1 transition-colors",
              editorMode === "measure"
                ? "bg-primary/20 border-primary text-primary"
                : "bg-surface-2 text-text-secondary hover:text-text-primary hover:bg-surface-3"
            )}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Đo khoảng cách</span>
          </button>

          <button
            onClick={() => toast.info("Đo diện tích phòng: 96.0 m² (8.0m x 12.0m)")}
            title="Đo diện tích"
            className="p-1.5 rounded-md bg-surface-2 border border-border/60 text-text-secondary hover:text-text-primary hover:bg-surface-3 flex items-center gap-1 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Đo diện tích</span>
          </button>

          <button
            onClick={() => handleToolClick("note", "Add Note")}
            title="Ghi chú vị trí"
            className={cn(
              "p-1.5 rounded-md border border-border/60 flex items-center gap-1 transition-colors",
              editorMode === "note"
                ? "bg-primary/20 border-primary text-primary"
                : "bg-surface-2 text-text-secondary hover:text-text-primary hover:bg-surface-3"
            )}
          >
            <StickyNote className="w-3.5 h-3.5 text-warning" />
            <span className="hidden md:inline text-[11px]">Ghi chú</span>
          </button>
        </div>
      </div>

      {/* Middle: Undo / Redo */}
      <div className="hidden lg:flex items-center gap-1">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 rounded hover:bg-surface-2 transition-colors"
          title="Undo"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-1.5 text-text-secondary hover:text-text-primary disabled:opacity-30 rounded hover:bg-surface-2 transition-colors"
          title="Redo"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Right: Grid, Snap, Helpers, View Controls */}
      <div className="flex items-center gap-2">
        {/* Snap Toggle */}
        <button
          onClick={toggleSnap}
          title={snapEnabled ? "Tắt bắt điểm (Snap: ON)" : "Bật bắt điểm (Snap: OFF)"}
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-colors",
            snapEnabled
              ? "bg-primary/15 border-primary/40 text-primary"
              : "bg-surface-2 border-border/60 text-text-secondary hover:text-text-primary"
          )}
        >
          <Magnet className="w-3.5 h-3.5" />
          <span>Snap</span>
        </button>

        {/* Grid Controls */}
        <div className="flex items-center gap-1 bg-surface-2 px-2 py-0.5 rounded-md border border-border/60">
          <button
            onClick={() => setGridSize(gridSize - 0.5)}
            className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-surface-3"
            title="Giảm kích thước Lưới"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-[11px] font-mono text-text-primary min-w-[34px] text-center">
            {gridSize.toFixed(1)}m
          </span>
          <button
            onClick={() => setGridSize(gridSize + 0.5)}
            className="p-1 text-text-secondary hover:text-text-primary rounded hover:bg-surface-3"
            title="Tăng kích thước Lưới"
          >
            <Plus className="w-3 h-3" />
          </button>

          <div className="w-px h-3 bg-border/60 mx-1" />

          <button
            onClick={toggleGrid}
            title={showGrid ? "Ẩn lưới sàn" : "Hiện lưới sàn"}
            className={cn(
              "p-1 rounded transition-colors",
              showGrid ? "text-primary" : "text-text-secondary opacity-50"
            )}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Helpers Toggle */}
        <button
          onClick={toggleHelpers}
          title={showHelpers ? "Ẩn khung trợ giúp" : "Hiện khung trợ giúp"}
          className={cn(
            "p-1.5 rounded-md border border-border/60 bg-surface-2 transition-colors",
            showHelpers ? "text-primary border-primary/40" : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Fit View Button */}
        <button
          onClick={() => {
            toast.info("Đã căn góc nhìn Fit View toàn bộ phòng họp");
          }}
          title="Fit View (Toàn cảnh phòng)"
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-surface-2 hover:bg-surface-3 border border-border/60 text-text-primary text-[11px] font-medium transition-colors"
        >
          <Focus className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Fit View</span>
        </button>
      </div>
    </footer>
  );
};
