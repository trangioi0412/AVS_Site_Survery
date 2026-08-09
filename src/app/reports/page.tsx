"use client";

import React from "react";
import { AppLayout } from "@/components/app-shell/app-layout";
import { useEditorStore } from "@/stores/editor-store";
import { exportSceneToJson, exportBomToCsv } from "@/lib/export-helpers";
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  Download,
  Building2,
  DoorClosed,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

export default function ReportsPage() {
  const { currentProject, currentRoom, objects } = useEditorStore();

  // Export Handlers with sanitized dynamic filenames
  const handleExportJson = () => {
    const filename = `${currentProject.name}_${currentRoom.name}`;
    exportSceneToJson(objects, filename);
    toast.success(`Đã xuất file 3D JSON cho "${currentProject.name} - ${currentRoom.name}"!`);
  };

  const handleExportBomCsv = () => {
    exportBomToCsv(objects, currentProject.name, currentRoom.name);
    toast.success(`Đã xuất bảng BOM CSV cho "${currentProject.name} - ${currentRoom.name}"!`);
  };

  const proposedEquipment = objects.filter((o) => o.status === "proposed" && o.category !== "architecture");
  const existingEquipment = objects.filter((o) => o.status === "existing" && o.category !== "architecture");

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <FileText className="w-5 h-5" />
            <span>Quản Lý Báo Cáo Khảo Sát & Lập Danh Mục BOM</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary mt-1">
            Báo Cáo Khảo Sát & Xuất Dữ Liệu Thi Công
          </h1>
        </div>

        {/* Export Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 3D Scene JSON */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-primary/15 text-primary w-fit">
                <FileCode className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">Cấu Trúc Mô Hình 3D (.JSON)</h3>
              <p className="text-xs text-text-secondary">
                Xuất toàn bộ tọa độ position, rotation, dimensions và metadata của từng đối tượng 3D.
              </p>
            </div>

            <button
              onClick={handleExportJson}
              className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải File 3D JSON</span>
            </button>
          </div>

          {/* Card 2: BOM CSV / Excel */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-status-existing/15 text-status-existing w-fit">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-text-primary">Danh Mục Thiết Bị BOM (.CSV)</h3>
              <p className="text-xs text-text-secondary">
                Xuất bảng thống kê danh mục thiết bị AV đề xuất và hiện trạng dạng CSV tương thích Excel.
              </p>
            </div>

            <button
              onClick={handleExportBomCsv}
              className="w-full py-2 bg-status-existing hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Tải Bảng BOM CSV</span>
            </button>
          </div>

          {/* Card 3: PDF Full Report (Placeholder for TASK-005) */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3 flex flex-col justify-between opacity-80">
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-surface-2 text-text-secondary w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary">Báo Cáo PDF Khảo Sát</h3>
                <span className="text-[10px] bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded font-mono font-semibold border border-amber-500/30">
                  Sắp có (TASK-005)
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                Tự động dàn trang báo cáo PDF hoàn chỉnh kèm sơ đồ 2D và hình ảnh khảo sát thực địa.
              </p>
            </div>

            <button
              disabled
              className="w-full py-2 bg-surface-2 text-text-secondary rounded-lg text-xs font-semibold cursor-not-allowed border border-border/60"
            >
              Xuất Báo Cáo PDF (TASK-005)
            </button>
          </div>
        </div>

        {/* Preview BOM Table for Current Room */}
        <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="space-y-0.5">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                Xem Trước Danh Mục BOM: {currentProject.name} — {currentRoom.name}
              </h2>
              <p className="text-xs text-text-secondary">
                Tổng cộng {proposedEquipment.length + existingEquipment.length} thiết bị trong phòng 3D hiện tại
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2 text-text-secondary font-mono border-b border-border">
                <tr>
                  <th className="p-2.5">Mã thiết bị</th>
                  <th className="p-2.5">Tên thiết bị</th>
                  <th className="p-2.5">Hãng sản xuất</th>
                  <th className="p-2.5">Model</th>
                  <th className="p-2.5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text-primary">
                {proposedEquipment.map((obj) => (
                  <tr key={obj.id} className="hover:bg-surface-2/40">
                    <td className="p-2.5 font-mono text-[11px] text-text-secondary">{obj.id}</td>
                    <td className="p-2.5 font-semibold">{obj.name}</td>
                    <td className="p-2.5">{obj.brand || "Samsung"}</td>
                    <td className="p-2.5 font-mono">{obj.model || "QM85R"}</td>
                    <td className="p-2.5">
                      <span className="text-[10px] bg-status-proposed/15 text-status-proposed px-2 py-0.5 rounded font-mono font-semibold border border-status-proposed/30">
                        Proposed (Đề xuất)
                      </span>
                    </td>
                  </tr>
                ))}
                {existingEquipment.map((obj) => (
                  <tr key={obj.id} className="hover:bg-surface-2/40">
                    <td className="p-2.5 font-mono text-[11px] text-text-secondary">{obj.id}</td>
                    <td className="p-2.5 font-semibold">{obj.name}</td>
                    <td className="p-2.5">{obj.brand || "JBL"}</td>
                    <td className="p-2.5 font-mono">{obj.model || "Control 26"}</td>
                    <td className="p-2.5">
                      <span className="text-[10px] bg-status-existing/15 text-status-existing px-2 py-0.5 rounded font-mono font-semibold border border-status-existing/30">
                        Existing (Hiện trạng)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
