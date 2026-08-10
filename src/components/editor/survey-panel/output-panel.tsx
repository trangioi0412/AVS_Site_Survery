"use client";

import React from "react";
import {
  FileText,
  FileSpreadsheet,
  Network,
  Layout,
  Box,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useEditorStore } from "@/stores/editor-store";
import { generateBOMReport, exportSceneToJson } from "@/lib/export-helpers";

export const OutputPanel: React.FC = () => {
  const { objects, currentProject, currentRoom } = useEditorStore();

  const handleExportBOM = () => {
    const bom = generateBOMReport(objects);
    toast.success(`Đã tổng hợp ${bom.length} thiết bị cho Báo cáo BOM!`);
  };

  const handleAction = (title: string) => {
    toast.info(`Tính năng "${title}" đang được phát triển`);
  };

  return (
    <div className="flex flex-col h-full bg-surface-1 p-2 select-none overflow-hidden text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 font-bold text-text-primary uppercase tracking-wider text-[11px]">
          <Download className="w-3.5 h-3.5 text-primary" />
          <span>Xuất Báo Cáo & Kết Xuất</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-1.5 p-1 overflow-y-auto">
        {/* Survey Report */}
        <button
          onClick={() => handleAction("Báo cáo khảo sát PDF")}
          className="flex flex-col items-start p-2 rounded bg-surface-2/70 hover:bg-surface-2 border border-border/60 hover:border-primary/50 text-left transition-all group"
        >
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-text-primary text-[11px]">Báo cáo khảo sát</span>
          </div>
          <span className="text-[10px] text-text-secondary">Xuất tài liệu PDF khảo sát công trình</span>
        </button>

        {/* BOM */}
        <button
          onClick={handleExportBOM}
          className="flex flex-col items-start p-2 rounded bg-surface-2/70 hover:bg-surface-2 border border-border/60 hover:border-status-existing/50 text-left transition-all group"
        >
          <div className="flex items-center gap-1.5 text-status-existing mb-1">
            <FileSpreadsheet className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-text-primary text-[11px]">BOM thiết bị</span>
          </div>
          <span className="text-[10px] text-text-secondary">Xuất bảng khối lượng thiết bị Excel</span>
        </button>

        {/* Connection diagram */}
        <button
          onClick={() => handleAction("Sơ đồ kết nối AV/Network")}
          className="flex flex-col items-start p-2 rounded bg-surface-2/70 hover:bg-surface-2 border border-border/60 hover:border-primary/50 text-left transition-all group"
        >
          <div className="flex items-center gap-1.5 text-primary mb-1">
            <Network className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-text-primary text-[11px]">Sơ đồ kết nối</span>
          </div>
          <span className="text-[10px] text-text-secondary">Xuất sơ đồ đấu nối cáp tín hiệu</span>
        </button>

        {/* 2D Layout */}
        <button
          onClick={() => handleAction("Xuất Bản vẽ 2D CAD/DWG")}
          className="flex flex-col items-start p-2 rounded bg-surface-2/70 hover:bg-surface-2 border border-border/60 hover:border-status-proposed/50 text-left transition-all group"
        >
          <div className="flex items-center gap-1.5 text-status-proposed mb-1">
            <Layout className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-text-primary text-[11px]">Layout 2D</span>
          </div>
          <span className="text-[10px] text-text-secondary">Xuất mặt bằng kỹ thuật bố trí</span>
        </button>

        {/* 3D GLB export */}
        <button
          onClick={() => exportSceneToJson(objects, currentProject, currentRoom)}
          className="flex flex-col items-start p-2 rounded bg-surface-2/70 hover:bg-surface-2 border border-border/60 hover:border-warning/50 text-left transition-all group col-span-2 lg:col-span-2"
        >
          <div className="flex items-center gap-1.5 text-warning mb-1">
            <Box className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-text-primary text-[11px]">Xuất 3D JSON / Model</span>
          </div>
          <span className="text-[10px] text-text-secondary">Tải dữ liệu mô hình không gian phòng 3D đầy đủ</span>
        </button>
      </div>
    </div>
  );
};
