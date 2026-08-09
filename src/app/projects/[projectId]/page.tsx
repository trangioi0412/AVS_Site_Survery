"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-shell/app-layout";
import { useEditorStore } from "@/stores/editor-store";
import {
  Building2,
  MapPin,
  Clock,
  DoorClosed,
  Plus,
  Box,
  ClipboardCheck,
  ArrowLeft,
  Trash2,
  Sliders,
  X,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const {
    projects,
    rooms,
    switchProject,
    switchRoom,
    addRoomToProject,
    deleteRoom,
  } = useEditorStore();

  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const [newRoomName, setNewRoomName] = useState("");
  const [roomWidth, setRoomWidth] = useState(8);
  const [roomLength, setRoomLength] = useState(10);
  const [roomHeight, setRoomHeight] = useState(3.2);

  // Find target project
  const project = projects.find((p) => p.id === projectId);
  const projectRooms = rooms[projectId] || [];

  if (!project) {
    return (
      <AppLayout>
        <div className="p-12 text-center bg-surface-1 border border-dashed border-border rounded-xl space-y-4 max-w-md mx-auto my-12">
          <Building2 className="w-12 h-12 text-text-secondary/40 mx-auto" />
          <h2 className="text-base font-bold text-text-primary">Không tìm thấy dự án</h2>
          <p className="text-xs text-text-secondary">
            Dự án có mã ID &quot;{projectId}&quot; không tồn tại hoặc đã bị xóa.
          </p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-md text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh sách dự án</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleAddRoomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) {
      toast.error("Vui lòng nhập tên phòng!");
      return;
    }

    const createdRoom = addRoomToProject(projectId, newRoomName.trim(), {
      width: Math.max(2, Number(roomWidth)),
      length: Math.max(2, Number(roomLength)),
      height: Math.max(2, Number(roomHeight)),
    });

    setShowAddRoomModal(false);
    setNewRoomName("");
    toast.success(`Đã thêm phòng "${createdRoom.name}" vào dự án!`);
  };

  const handleDeleteRoomConfirm = () => {
    if (!roomToDelete) return;
    if (projectRooms.length <= 1) {
      toast.error("Dự án phải chứa ít nhất 1 phòng họp!");
      setRoomToDelete(null);
      return;
    }

    const rm = projectRooms.find((r) => r.id === roomToDelete);
    deleteRoom(projectId, roomToDelete);
    toast.success(`Đã xóa phòng "${rm?.name || roomToDelete}"!`);
    setRoomToDelete(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Back Link & Header */}
        <div className="space-y-2">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Danh sách dự án</span>
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-1 p-5 rounded-xl border border-border">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-text-primary">{project.name}</h1>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase border ${
                    project.status === "surveying"
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  }`}
                >
                  {project.status === "surveying" ? "Đang khảo sát" : "Lập bản vẽ"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
                <span>Khách hàng: <strong className="text-text-primary">{project.customer}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-text-secondary" />
                  {project.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-text-secondary" />
                  {project.updatedAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/projects/${project.id}/survey`}
                onClick={() => switchProject(project)}
                className="px-3.5 py-2 bg-surface-2 hover:bg-surface-3 border border-border text-text-primary rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ClipboardCheck className="w-4 h-4 text-primary" />
                <span>Quy trình khảo sát</span>
              </Link>

              <button
                onClick={() => setShowAddRoomModal(true)}
                className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm phòng mới</span>
              </button>
            </div>
          </div>
        </div>

        {/* Rooms Section */}
        <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <DoorClosed className="w-4 h-4 text-status-existing" />
              <h2 className="text-sm font-bold text-text-primary">
                Danh Sách Phòng Khảo Sát ({projectRooms.length})
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectRooms.map((rm) => {
              const area = rm.dimensions.width * rm.dimensions.length;
              return (
                <div
                  key={rm.id}
                  className="bg-surface-2/50 border border-border hover:border-primary/40 rounded-lg p-4 space-y-3 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/projects/${project.id}/rooms/${rm.id}`}
                        onClick={() => {
                          switchProject(project, rm.id);
                          switchRoom(rm);
                        }}
                        className="font-bold text-xs text-text-primary hover:text-primary transition-colors line-clamp-1"
                      >
                        {rm.name}
                      </Link>
                      <span className="text-[10px] font-mono bg-surface-3 px-1.5 py-0.5 rounded text-text-secondary border border-border/40 shrink-0">
                        {rm.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
                      <div className="bg-surface-1 p-2 rounded border border-border/40 font-mono">
                        <span className="text-[10px] text-text-secondary block font-sans">Kích thước (WxLxH)</span>
                        <span className="text-text-primary font-bold">
                          {rm.dimensions.width}m x {rm.dimensions.length}m x {rm.dimensions.height}m
                        </span>
                      </div>

                      <div className="bg-surface-1 p-2 rounded border border-border/40 font-mono">
                        <span className="text-[10px] text-text-secondary block font-sans">Diện tích sàn</span>
                        <span className="text-primary font-bold">{area} m²</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setRoomToDelete(rm.id)}
                      className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors"
                      title="Xóa phòng"
                      aria-label="Delete room"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/projects/${project.id}/rooms/${rm.id}`}
                        onClick={() => {
                          switchProject(project, rm.id);
                          switchRoom(rm);
                        }}
                        className="px-2.5 py-1.5 bg-surface-3 hover:bg-border text-text-primary text-xs rounded font-medium transition-colors"
                      >
                        Chi tiết
                      </Link>

                      <Link
                        href={`/projects/${project.id}/rooms/${rm.id}/editor`}
                        onClick={() => {
                          switchProject(project, rm.id);
                          switchRoom(rm);
                        }}
                        className="px-2.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs rounded font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D Editor</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal Add Room */}
      {showAddRoomModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Plus className="w-4 h-4" />
                <span>Thêm Phòng Khảo Sát Mới</span>
              </div>
              <button
                onClick={() => setShowAddRoomModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRoomSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-text-secondary font-medium">Tên phòng *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Phòng Họp VIP 402"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Rộng (X-m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-2 py-1.5 text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Dài (Z-m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    value={roomLength}
                    onChange={(e) => setRoomLength(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-2 py-1.5 text-text-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Cao (Y-m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    value={roomHeight}
                    onChange={(e) => setRoomHeight(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-2 py-1.5 text-text-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddRoomModal(false)}
                  className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 text-text-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white font-medium"
                >
                  Tạo Phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Room Modal */}
      {roomToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-text-primary">Xác Nhận Xóa Phòng</h3>
            <p className="text-xs text-text-secondary">
              Bạn có chắc chắn muốn xóa phòng này khỏi dự án? Sơ đồ 3D đi kèm phòng này sẽ bị xóa.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRoomToDelete(null)}
                className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 text-text-secondary text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteRoomConfirm}
                className="px-4 py-1.5 rounded bg-danger hover:bg-red-600 text-white text-xs font-semibold"
              >
                Xóa Phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
