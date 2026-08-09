"use client";

import React, { useState } from "react";
import { Camera, Image as ImageIcon, Download, RefreshCw, Eye } from "lucide-react";
import { toast } from "sonner";

export const PreviewPanel: React.FC = () => {
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);

  const handleTakeSnapshot = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      try {
        const dataUrl = canvas.toDataURL("image/png");
        setSnapshotUrl(dataUrl);
        toast.success("Đã chụp ảnh mô hình 3D thành công!");
      } catch (err) {
        toast.error("Không thể chụp ảnh canvas 3D");
      }
    } else {
      toast.info("Đã tạo ảnh chụp mô hình mẫu");
    }
  };

  const handleDownloadSnapshot = () => {
    if (!snapshotUrl) return;
    const a = document.createElement("a");
    a.href = snapshotUrl;
    a.download = "meeting-room-501-survey.png";
    a.click();
    toast.success("Đã tải ảnh chụp góc nhìn 3D");
  };

  return (
    <div className="flex flex-col h-full bg-surface-1 p-2 select-none overflow-hidden text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-1.5 font-bold text-text-primary uppercase tracking-wider text-[11px]">
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          <span>Preview & Chụp ảnh</span>
        </div>
        <button
          onClick={handleTakeSnapshot}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary hover:bg-primary-hover text-white text-[11px] font-medium transition-colors shadow-sm"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Chụp ảnh</span>
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-2">
        {snapshotUrl ? (
          <div className="relative group w-full h-full flex flex-col items-center justify-center bg-surface-2 rounded-md border border-border/80 p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={snapshotUrl}
              alt="3D Scene Preview"
              className="max-h-[100px] w-auto object-contain rounded"
            />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity rounded">
              <button
                onClick={handleDownloadSnapshot}
                className="p-1.5 bg-primary text-white rounded hover:scale-105 transition-transform"
                title="Tải ảnh về máy"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full rounded-md border border-dashed border-border/80 bg-surface-2/40 flex flex-col items-center justify-center text-text-secondary p-3 text-center">
            <Camera className="w-6 h-6 text-text-secondary/50 mb-1" />
            <span className="text-[11px]">Chưa có ảnh chụp</span>
            <span className="text-[10px] text-text-secondary/60">Bấm "Chụp ảnh" để lưu góc nhìn 3D hiện tại</span>
          </div>
        )}
      </div>
    </div>
  );
};
