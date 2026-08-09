"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/app-shell/app-layout";
import { useEditorStore } from "@/stores/editor-store";
import {
  Settings,
  Sliders,
  Ruler,
  Grid,
  Trash2,
  CheckCircle2,
  RefreshCw,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const {
    unit,
    gridSize,
    snapEnabled,
    showGrid,
    setSettings,
    setGridSize,
    toggleSnap,
    toggleGrid,
    resetLocalStorage,
  } = useEditorStore();

  const [showResetModal, setShowResetModal] = useState(false);

  const handleResetConfirm = () => {
    resetLocalStorage();
    setShowResetModal(false);
    toast.success("Đã khôi phục dữ liệu mặc định và làm sạch bộ nhớ cục bộ!");
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Title */}
        <div className="border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Settings className="w-5 h-5" />
            <span>Cài Đặt Hệ Thống AVS Site Survey</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary mt-1">
            Cấu Hình Đơn Vị Đo, Editor 3D & Dữ Liệu
          </h1>
        </div>

        {/* Section 1: Measurement Unit */}
        <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2">
            <Ruler className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-text-primary">Đơn Vị Đo Chiều Kích Kỹ Thuật</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md text-xs">
            <button
              onClick={() => {
                setSettings({ unit: "m" });
                toast.info("Đã chọn đơn vị đo Mét (m)");
              }}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                unit === "m"
                  ? "bg-primary/15 border-primary text-primary font-bold"
                  : "bg-surface-2 border-border/60 text-text-secondary"
              }`}
            >
              <div>
                <p className="text-sm font-bold">Mét (m)</p>
                <p className="text-[10px] font-normal text-text-secondary">Ví dụ: 8.0m x 12.0m</p>
              </div>
              {unit === "m" && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
            </button>

            <button
              onClick={() => {
                setSettings({ unit: "mm" });
                toast.info("Đã chọn đơn vị đo Millimét (mm)");
              }}
              className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                unit === "mm"
                  ? "bg-primary/15 border-primary text-primary font-bold"
                  : "bg-surface-2 border-border/60 text-text-secondary"
              }`}
            >
              <div>
                <p className="text-sm font-bold">Millimét (mm)</p>
                <p className="text-[10px] font-normal text-text-secondary">Ví dụ: 8000mm x 12000mm</p>
              </div>
              {unit === "mm" && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
            </button>
          </div>
        </div>

        {/* Section 2: Editor 3D Grid & Snap */}
        <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2">
            <Grid className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-text-primary">Cấu Hình Lưới Grid & Snap 3D Editor</h2>
          </div>

          <div className="space-y-4 max-w-md text-xs">
            {/* Grid Size */}
            <div className="space-y-1">
              <label className="text-text-secondary font-medium">Kích thước ô lưới Grid Size (meters)</label>
              <div className="flex items-center gap-2">
                {[0.5, 1.0, 2.0].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setGridSize(size);
                      toast.info(`Đã đổi kích thước lưới Grid: ${size}m`);
                    }}
                    className={`px-3 py-1.5 rounded border font-mono font-medium transition-colors ${
                      gridSize === size
                        ? "bg-primary/15 border-primary text-primary font-bold"
                        : "bg-surface-2 border-border/60 text-text-secondary"
                    }`}
                  >
                    {size}m
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Snap & Show Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  toggleSnap();
                  toast.info(`Snap bắt điểm: ${!snapEnabled ? "Bật" : "Tắt"}`);
                }}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  snapEnabled
                    ? "bg-primary/15 border-primary text-primary font-bold"
                    : "bg-surface-2 border-border/60 text-text-secondary"
                }`}
              >
                <span>Snap bắt điểm theo Grid</span>
                {snapEnabled && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              </button>

              <button
                onClick={() => {
                  toggleGrid();
                  toast.info(`Hiển thị lưới Grid: ${!showGrid ? "Bật" : "Tắt"}`);
                }}
                className={`p-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                  showGrid
                    ? "bg-primary/15 border-primary text-primary font-bold"
                    : "bg-surface-2 border-border/60 text-text-secondary"
                }`}
              >
                <span>Hiển thị mặt sàn Grid</span>
                {showGrid && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Reset Local Storage */}
        <div className="bg-surface-1 border border-danger/40 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 border-b border-border/60 pb-2">
            <Trash2 className="w-4 h-4 text-danger" />
            <h2 className="text-sm font-bold text-danger">Quản Lý Bộ Nhớ Cục Bộ (Local Storage)</h2>
          </div>

          <p className="text-xs text-text-secondary max-w-lg leading-relaxed">
            Khôi phục trạng thái mặc định của ứng dụng và làm sạch bộ nhớ tạm `avs-site-survey-editor-storage` trong trình duyệt. Thao tác này không thể hoàn tác.
          </p>

          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 bg-danger/15 hover:bg-danger/25 text-danger border border-danger/30 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Khôi Phục Dữ Liệu Mặc Định</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <span className="text-sm font-bold text-danger flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" />
                Xác Nhận Khôi Phục Dữ Liệu
              </span>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed">
              Bạn có chắc chắn muốn xóa toàn bộ các dự án, phòng họp và bản nháp khảo sát đã lưu trong trình duyệt và khôi phục dữ liệu mẫu ban đầu?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 text-text-secondary text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleResetConfirm}
                className="px-4 py-1.5 rounded bg-danger hover:bg-red-600 text-white text-xs font-semibold"
              >
                Xác Nhận Khôi Phục
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
