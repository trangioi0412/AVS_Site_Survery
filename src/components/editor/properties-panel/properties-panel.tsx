"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  Info,
  Move3d,
  Cpu,
  Trash2,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Tv,
  Camera,
  Volume2,
  Mic,
  Server,
  Network,
  CheckCircle,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { ObjectStatus } from "@/types/editor";
import { formatNumber } from "@/lib/utils";
import { toast } from "sonner";

export const PropertiesPanel: React.FC = () => {
  const {
    objects,
    selectedObjectId,
    updateObject,
    removeObject,
    toggleLock,
    toggleVisibility,
  } = useEditorStore();

  const [activeTab, setActiveTab] = useState<"info" | "transform" | "advanced">("info");

  const selectedObject = objects.find((obj) => obj.id === selectedObjectId);

  if (!selectedObject) {
    return (
      <aside className="w-[300px] h-full bg-surface-1 border-l border-border flex flex-col items-center justify-center p-6 text-center select-none z-20 shrink-0">
        <div className="w-12 h-12 rounded-full bg-surface-2 border border-border/80 flex items-center justify-center text-text-secondary mb-3">
          <SlidersHorizontal className="w-6 h-6 text-primary" />
        </div>
        <h3 className="text-xs font-semibold text-text-primary mb-1">Chưa chọn đối tượng</h3>
        <p className="text-[11px] text-text-secondary max-w-[200px] leading-relaxed">
          Chọn một đối tượng trong mô hình 3D hoặc bảng Scene Layers để xem và chỉnh sửa thuộc tính.
        </p>
      </aside>
    );
  }

  const handlePositionChange = (axisIndex: 0 | 1 | 2, val: number) => {
    const newPos = [...selectedObject.position] as [number, number, number];
    newPos[axisIndex] = val;
    updateObject(selectedObject.id, { position: newPos });
  };

  const handleRotationChange = (axisIndex: 0 | 1 | 2, degVal: number) => {
    const newRot = [...selectedObject.rotation] as [number, number, number];
    // convert degrees to radians
    newRot[axisIndex] = (degVal * Math.PI) / 180;
    updateObject(selectedObject.id, { rotation: newRot });
  };

  const handleScaleChange = (axisIndex: 0 | 1 | 2, val: number) => {
    const newScale = [...selectedObject.scale] as [number, number, number];
    newScale[axisIndex] = Math.max(0.01, val);
    updateObject(selectedObject.id, { scale: newScale });
  };

  const handleStatusChange = (status: ObjectStatus) => {
    const color =
      status === "existing"
        ? "#22c55e"
        : status === "proposed"
        ? "#8b5cf6"
        : status === "remove"
        ? "#ef4444"
        : "#94a3b8";

    updateObject(selectedObject.id, { status, color });
    toast.info(`Đã đổi trạng thái đối tượng sang ${status.toUpperCase()}`);
  };

  return (
    <aside className="w-[300px] h-full bg-surface-1 border-l border-border flex flex-col select-none z-20 shrink-0 overflow-hidden">
      {/* Header Info */}
      <div className="p-3 border-b border-border/80 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
            {selectedObject.category}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleVisibility(selectedObject.id)}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded hover:bg-surface-2 transition-colors"
              title={selectedObject.visible ? "Ẩn object" : "Hiện object"}
            >
              {selectedObject.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => toggleLock(selectedObject.id)}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded hover:bg-surface-2 transition-colors"
              title={selectedObject.locked ? "Mở khóa" : "Khóa vị trí"}
            >
              {selectedObject.locked ? <Lock className="w-3.5 h-3.5 text-warning" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => removeObject(selectedObject.id)}
              className="p-1.5 text-text-secondary hover:text-danger rounded hover:bg-surface-2 transition-colors"
              title="Xóa đối tượng"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-bold text-text-primary truncate">{selectedObject.name}</h2>
          <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
            <span>{selectedObject.brand || "AVS"}</span>
            <span>•</span>
            <span className="font-mono">{selectedObject.model || "Standard"}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-3 gap-1 p-0.5 bg-surface-2 rounded-md border border-border/60 text-xs mt-2">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-1 rounded font-medium flex items-center justify-center gap-1 transition-colors ${
              activeTab === "info" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Info className="w-3 h-3" />
            <span>Thông tin</span>
          </button>

          <button
            onClick={() => setActiveTab("transform")}
            className={`py-1 rounded font-medium flex items-center justify-center gap-1 transition-colors ${
              activeTab === "transform" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Move3d className="w-3 h-3" />
            <span>Vị trí</span>
          </button>

          <button
            onClick={() => setActiveTab("advanced")}
            className={`py-1 rounded font-medium flex items-center justify-center gap-1 transition-colors ${
              activeTab === "advanced" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Cpu className="w-3 h-3" />
            <span>Nâng cao</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
        {activeTab === "info" && (
          <div className="space-y-3">
            {/* Status Field */}
            <div className="space-y-1">
              <label className="text-[11px] text-text-secondary font-medium">Trạng thái thiết bị</label>
              <div className="grid grid-cols-2 gap-1.5">
                {(["existing", "proposed", "remove", "unknown"] as ObjectStatus[]).map((st) => {
                  const isActive = selectedObject.status === st;
                  const labelMap: Record<ObjectStatus, string> = {
                    existing: "Hiện có",
                    proposed: "Đề xuất",
                    remove: "Tháo dỡ",
                    unknown: "Chưa xác định",
                  };
                  return (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`px-2 py-1.5 rounded-md border text-left font-medium flex items-center justify-between transition-all ${
                        isActive
                          ? "bg-surface-2 border-primary text-text-primary shadow-sm"
                          : "bg-surface-2/40 border-border/60 text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      <span className="capitalize">{labelMap[st]}</span>
                      {isActive && <CheckCircle className="w-3.5 h-3.5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-[11px] text-text-secondary font-medium">Tên thiết bị</label>
              <input
                type="text"
                value={selectedObject.name}
                onChange={(e) => updateObject(selectedObject.id, { name: e.target.value })}
                className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            {/* Brand & Model */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-text-secondary font-medium">Thương hiệu (Brand)</label>
                <input
                  type="text"
                  value={selectedObject.brand || ""}
                  onChange={(e) => updateObject(selectedObject.id, { brand: e.target.value })}
                  className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-text-secondary font-medium">Model</label>
                <input
                  type="text"
                  value={selectedObject.model || ""}
                  onChange={(e) => updateObject(selectedObject.id, { model: e.target.value })}
                  className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Installation Position */}
            <div className="space-y-1">
              <label className="text-[11px] text-text-secondary font-medium">Vị trí lắp đặt</label>
              <input
                type="text"
                value={(selectedObject.metadata?.installationPosition as string) || "Tường phòng họp"}
                onChange={(e) =>
                  updateObject(selectedObject.id, {
                    metadata: { ...selectedObject.metadata, installationPosition: e.target.value },
                  })
                }
                className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1">
              <label className="text-[11px] text-text-secondary font-medium">Ghi chú khảo sát</label>
              <textarea
                rows={3}
                value={(selectedObject.metadata?.notes as string) || ""}
                placeholder="Nhập ghi chú kỹ thuật, lưu ý thi công..."
                onChange={(e) =>
                  updateObject(selectedObject.id, {
                    metadata: { ...selectedObject.metadata, notes: e.target.value },
                  })
                }
                className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {activeTab === "transform" && (
          <div className="space-y-4">
            {/* Position X Y Z */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
                <span>Tọa độ Vị trí (m)</span>
                <span className="font-mono text-primary text-[10px]">X / Y / Z</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">X</span>
                  <input
                    type="number"
                    step="0.05"
                    value={formatNumber(selectedObject.position[0])}
                    onChange={(e) => handlePositionChange(0, parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">Y</span>
                  <input
                    type="number"
                    step="0.05"
                    value={formatNumber(selectedObject.position[1])}
                    onChange={(e) => handlePositionChange(1, parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">Z</span>
                  <input
                    type="number"
                    step="0.05"
                    value={formatNumber(selectedObject.position[2])}
                    onChange={(e) => handlePositionChange(2, parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Rotation X Y Z */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
                <span>Góc Xoay (Độ °)</span>
                <span className="font-mono text-primary text-[10px]">RX / RY / RZ</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">X</span>
                  <input
                    type="number"
                    step="5"
                    value={formatNumber((selectedObject.rotation[0] * 180) / Math.PI, 0)}
                    onChange={(e) => handleRotationChange(0, parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">Y</span>
                  <input
                    type="number"
                    step="5"
                    value={formatNumber((selectedObject.rotation[1] * 180) / Math.PI, 0)}
                    onChange={(e) => handleRotationChange(1, parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">Z</span>
                  <input
                    type="number"
                    step="5"
                    value={formatNumber((selectedObject.rotation[2] * 180) / Math.PI, 0)}
                    onChange={(e) => handleRotationChange(2, parseFloat(e.target.value) || 0)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Scale X Y Z */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-text-secondary">
                <span>Tỷ lệ Kích thước (Scale)</span>
                <span className="font-mono text-primary text-[10px]">SX / SY / SZ</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono">
                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">X</span>
                  <input
                    type="number"
                    step="0.1"
                    value={formatNumber(selectedObject.scale[0])}
                    onChange={(e) => handleScaleChange(0, parseFloat(e.target.value) || 1)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">Y</span>
                  <input
                    type="number"
                    step="0.1"
                    value={formatNumber(selectedObject.scale[1])}
                    onChange={(e) => handleScaleChange(1, parseFloat(e.target.value) || 1)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-text-secondary font-bold">Z</span>
                  <input
                    type="number"
                    step="0.1"
                    value={formatNumber(selectedObject.scale[2])}
                    onChange={(e) => handleScaleChange(2, parseFloat(e.target.value) || 1)}
                    className="w-full bg-surface-2 border border-border/80 rounded-md pl-6 pr-1.5 py-1 text-xs text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mounting Height Helper */}
            <div className="space-y-1 pt-2 border-t border-border/60">
              <label className="text-[11px] text-text-secondary font-medium">Chiều cao so với mặt sàn (m)</label>
              <input
                type="number"
                step="0.1"
                value={formatNumber(selectedObject.position[1])}
                onChange={(e) => handlePositionChange(1, parseFloat(e.target.value) || 0)}
                className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === "advanced" && (
          <div className="space-y-3">
            {/* Dynamic Schema per category */}
            <div className="space-y-1">
              <label className="text-[11px] text-text-secondary font-medium">Độ phân giải (Resolution)</label>
              <input
                type="text"
                value={(selectedObject.metadata?.resolution as string) || "4K UHD (3840x2160)"}
                onChange={(e) =>
                  updateObject(selectedObject.id, {
                    metadata: { ...selectedObject.metadata, resolution: e.target.value },
                  })
                }
                className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-text-secondary font-medium">Công suất (Power)</label>
                <input
                  type="text"
                  value={(selectedObject.metadata?.power as string) || "120W"}
                  onChange={(e) =>
                    updateObject(selectedObject.id, {
                      metadata: { ...selectedObject.metadata, power: e.target.value },
                    })
                  }
                  className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-text-secondary font-medium">Địa chỉ IP</label>
                <input
                  type="text"
                  value={(selectedObject.metadata?.ipAddress as string) || "192.168.10.100"}
                  onChange={(e) =>
                    updateObject(selectedObject.id, {
                      metadata: { ...selectedObject.metadata, ipAddress: e.target.value },
                    })
                  }
                  className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-text-secondary font-medium">Chuẩn kết nối tín hiệu</label>
              <input
                type="text"
                value={
                  Array.isArray(selectedObject.metadata?.connections)
                    ? (selectedObject.metadata?.connections as string[]).join(", ")
                    : "HDMI 2.0, LAN RJ45, Dante Audio"
                }
                onChange={(e) =>
                  updateObject(selectedObject.id, {
                    metadata: {
                      ...selectedObject.metadata,
                      connections: e.target.value.split(",").map((s) => s.trim()),
                    },
                  })
                }
                className="w-full bg-surface-2 border border-border/80 rounded-md px-2.5 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
