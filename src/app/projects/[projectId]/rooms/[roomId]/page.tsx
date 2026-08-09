"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayout } from "@/components/app-shell/app-layout";
import { useEditorStore } from "@/stores/editor-store";
import {
  DoorClosed,
  Building2,
  Box,
  ClipboardCheck,
  ArrowLeft,
  Sliders,
  Cpu,
  HardDrive,
  CheckCircle2,
  X,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

export default function RoomDetailPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const roomId = params?.roomId as string;

  const {
    projects,
    rooms,
    switchProject,
    switchRoom,
    updateRoomDimensions,
  } = useEditorStore();

  const [showEditDimsModal, setShowEditDimsModal] = useState(false);

  const project = projects.find((p) => p.id === projectId);
  const projectRooms = rooms[projectId] || [];
  const room = projectRooms.find((r) => r.id === roomId);

  const [roomWidth, setRoomWidth] = useState(room?.dimensions?.width || 8);
  const [roomLength, setRoomLength] = useState(room?.dimensions?.length || 10);
  const [roomHeight, setRoomHeight] = useState(room?.dimensions?.height || 3.2);

  // Validate Project and Room belonging
  if (!project || !room) {
    return (
      <AppLayout>
        <div className="p-12 text-center bg-surface-1 border border-dashed border-border rounded-xl space-y-4 max-w-md mx-auto my-12">
          <DoorClosed className="w-12 h-12 text-text-secondary/40 mx-auto" />
          <h2 className="text-base font-bold text-text-primary">Không tìm thấy phòng họp</h2>
          <p className="text-xs text-text-secondary">
            Phòng họp có mã ID &quot;{roomId}&quot; không tồn tại hoặc không thuộc dự án này.
          </p>
          <Link
            href={project ? `/projects/${project.id}` : "/projects"}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-md text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại chi tiết dự án</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const area = room.dimensions.width * room.dimensions.length;
  const sceneObjects = room.sceneObjects || [];

  const existingObjects = sceneObjects.filter((o) => o.status === "existing" && o.category !== "architecture");
  const proposedObjects = sceneObjects.filter((o) => o.status === "proposed" && o.category !== "architecture");
  const architectureObjects = sceneObjects.filter((o) => o.category === "architecture");

  const handleSaveDimensions = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Math.max(2, Number(roomWidth));
    const l = Math.max(2, Number(roomLength));
    const h = Math.max(2, Number(roomHeight));

    switchProject(project, room.id);
    switchRoom(room);
    updateRoomDimensions({ width: w, length: l, height: h });

    setShowEditDimsModal(false);
    toast.success(`Đã cập nhật kích thước phòng: ${w}m x ${l}m x ${h}m (${w * l} m²)`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header navigation & Info */}
        <div className="space-y-2">
          <Link
            href={`/projects/${project.id}`}
            className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại dự án {project.name}</span>
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-1 p-5 rounded-xl border border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <DoorClosed className="w-5 h-5 text-status-existing shrink-0" />
                <h1 className="text-xl font-bold text-text-primary">{room.name}</h1>
                <span className="text-xs bg-surface-3 px-2 py-0.5 rounded text-text-secondary font-mono border border-border/40">
                  {room.type}
                </span>
              </div>
              <p className="text-xs text-text-secondary">Dự án: {project.name} • {project.customer}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-xs">
              <button
                onClick={() => setShowEditDimsModal(true)}
                className="px-3.5 py-2 bg-surface-2 hover:bg-surface-3 border border-border text-text-primary rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <Sliders className="w-4 h-4 text-primary" />
                <span>Sửa kích thước</span>
              </button>

              <Link
                href={`/projects/${project.id}/survey`}
                onClick={() => {
                  switchProject(project, room.id);
                  switchRoom(room);
                }}
                className="px-3.5 py-2 bg-surface-2 hover:bg-surface-3 border border-border text-text-primary rounded-lg font-medium flex items-center gap-1.5 transition-colors"
              >
                <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                <span>Khảo sát</span>
              </Link>

              <Link
                href={`/projects/${project.id}/rooms/${room.id}/editor`}
                onClick={() => {
                  switchProject(project, room.id);
                  switchRoom(room);
                }}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Box className="w-4 h-4" />
                <span>Mở 3D Editor</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Geometry Metrics & Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-1 p-4 rounded-xl border border-border space-y-1">
            <span className="text-xs text-text-secondary font-medium">Chiều Rộng (X) & Chiều Dài (Z)</span>
            <p className="text-xl font-bold font-mono text-text-primary">
              {room.dimensions.width}m x {room.dimensions.length}m
            </p>
          </div>

          <div className="bg-surface-1 p-4 rounded-xl border border-border space-y-1">
            <span className="text-xs text-text-secondary font-medium">Chiều Cao Trần (Y)</span>
            <p className="text-xl font-bold font-mono text-text-primary">
              {room.dimensions.height} m
            </p>
          </div>

          <div className="bg-surface-1 p-4 rounded-xl border border-border space-y-1">
            <span className="text-xs text-text-secondary font-medium">Diện Tích Sàn Động</span>
            <p className="text-xl font-bold font-mono text-primary">
              {area} m²
            </p>
          </div>
        </div>

        {/* Equipment Breakdown Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proposed AV Equipment */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-status-proposed" />
                <h2 className="text-sm font-bold text-text-primary">
                  Thiết Bị Đề Xuất Mới ({proposedObjects.length})
                </h2>
              </div>
            </div>

            {proposedObjects.length === 0 ? (
              <p className="text-xs text-text-secondary italic">Chưa có thiết bị đề xuất mới. Mở 3D Editor để kéo thả thiết bị.</p>
            ) : (
              <div className="space-y-2">
                {proposedObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3 bg-surface-2/60 border border-border/60 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-text-primary block">{obj.name}</span>
                      <span className="text-[10px] text-text-secondary">
                        {obj.brand} • {obj.model} ({obj.category})
                      </span>
                    </div>
                    <span className="text-[10px] bg-status-proposed/15 text-status-proposed px-2 py-0.5 rounded font-mono font-semibold border border-status-proposed/30">
                      Proposed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Existing AV Equipment */}
          <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-status-existing" />
                <h2 className="text-sm font-bold text-text-primary">
                  Thiết Bị & Hạ Tầng Hiện Có ({existingObjects.length})
                </h2>
              </div>
            </div>

            {existingObjects.length === 0 ? (
              <p className="text-xs text-text-secondary italic">Chưa có thiết bị hiện trạng.</p>
            ) : (
              <div className="space-y-2">
                {existingObjects.map((obj) => (
                  <div
                    key={obj.id}
                    className="p-3 bg-surface-2/60 border border-border/60 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-text-primary block">{obj.name}</span>
                      <span className="text-[10px] text-text-secondary">
                        {obj.brand} • {obj.type}
                      </span>
                    </div>
                    <span className="text-[10px] bg-status-existing/15 text-status-existing px-2 py-0.5 rounded font-mono font-semibold border border-status-existing/30">
                      Existing
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dimensions Modal */}
      {showEditDimsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sliders className="w-4 h-4" />
                <span>Chỉnh Sửa Kích Thước 3D Phòng</span>
              </div>
              <button
                onClick={() => setShowEditDimsModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDimensions} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2 font-mono">
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Rộng (X - m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Dài (Z - m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    value={roomLength}
                    onChange={(e) => setRoomLength(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Cao (Y - m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    value={roomHeight}
                    onChange={(e) => setRoomHeight(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditDimsModal(false)}
                  className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 text-text-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white font-medium"
                >
                  Lưu & Cập Nhật 3D
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
