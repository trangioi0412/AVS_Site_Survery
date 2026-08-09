"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-shell/app-layout";
import { useEditorStore } from "@/stores/editor-store";
import {
  FolderKanban,
  Search,
  Plus,
  Building2,
  MapPin,
  Clock,
  DoorClosed,
  Box,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

export default function ProjectsPage() {
  const {
    projects,
    rooms,
    currentProject,
    createProject,
    switchProject,
    deleteProject,
  } = useEditorStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCustomer, setNewProjectCustomer] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");

  // Filter & Search Logic
  const filteredProjects = projects.filter((proj) => {
    const matchesSearch =
      proj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proj.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || proj.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Vui lòng nhập tên dự án!");
      return;
    }

    createProject({
      name: newProjectName.trim(),
      customer: newProjectCustomer.trim() || "Khách hàng mới",
      location: newProjectLocation.trim() || "Việt Nam",
    });

    setShowNewProjectModal(false);
    setNewProjectName("");
    setNewProjectCustomer("");
    setNewProjectLocation("");
    toast.success(`Đã tạo dự án mới "${newProjectName.trim()}"!`);
  };

  const handleDeleteConfirm = () => {
    if (!projectToDelete) return;
    if (projects.length <= 1) {
      toast.error("Không thể xóa dự án duy nhất còn lại!");
      setProjectToDelete(null);
      return;
    }

    const proj = projects.find((p) => p.id === projectToDelete);
    deleteProject(projectToDelete);
    toast.success(`Đã xóa dự án "${proj?.name || projectToDelete}"!`);
    setProjectToDelete(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <FolderKanban className="w-5 h-5" />
              <span>Quản Lý Dự Án Khảo Sát</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary mt-1">Danh Sách Công Trình AV</h1>
          </div>

          <button
            onClick={() => setShowNewProjectModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md shadow-primary/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo Dự Án Mới</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-surface-1 p-3 rounded-lg border border-border">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm dự án, khách hàng, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
            <span className="text-text-secondary">Trạng thái:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-surface-2 border border-border rounded-md px-3 py-1.5 text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="all">Tất cả ({projects.length})</option>
              <option value="surveying">Đang khảo sát</option>
              <option value="planning">Lập bản vẽ</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center bg-surface-1 border border-dashed border-border rounded-xl space-y-3">
            <FolderKanban className="w-12 h-12 text-text-secondary/40 mx-auto" />
            <h3 className="text-sm font-semibold text-text-primary">Không tìm thấy dự án phù hợp</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              Thử thay đổi từ khóa tìm kiếm hoặc tạo một dự án công trình mới.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((proj) => {
              const projectRooms = rooms[proj.id] || [];
              const isCurrent = proj.id === currentProject.id;
              const firstRoom = projectRooms[0];

              return (
                <div
                  key={proj.id}
                  className={`bg-surface-1 border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all relative ${
                    isCurrent ? "border-primary shadow-md shadow-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="space-y-2">
                    {/* Header line */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <Link
                          href={`/projects/${proj.id}`}
                          onClick={() => switchProject(proj)}
                          className="font-bold text-sm text-text-primary hover:text-primary transition-colors line-clamp-1 block"
                        >
                          {proj.name}
                        </Link>
                        <span className="text-xs text-text-secondary block truncate">{proj.customer}</span>
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase shrink-0 border ${
                          proj.status === "surveying"
                            ? "bg-primary/15 text-primary border-primary/30"
                            : proj.status === "approved" || proj.status === "completed"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        {proj.status === "surveying"
                          ? "Khảo sát"
                          : proj.status === "approved"
                          ? "Đã duyệt"
                          : proj.status === "completed"
                          ? "Hoàn thành"
                          : "Lập bản vẽ"}
                      </span>
                    </div>

                    {/* Metadata info */}
                    <div className="space-y-1 pt-1 text-xs text-text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-text-secondary" />
                        <span className="truncate">{proj.location}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <DoorClosed className="w-3.5 h-3.5 text-status-existing" />
                        <span>{projectRooms.length} phòng khảo sát</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3 h-3 text-text-secondary" />
                        <span>Cập nhật: {proj.updatedAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setProjectToDelete(proj.id)}
                      className="p-1.5 text-text-secondary hover:text-danger hover:bg-danger/10 rounded transition-colors"
                      title="Xóa dự án"
                      aria-label="Delete project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/projects/${proj.id}`}
                        onClick={() => switchProject(proj)}
                        className="px-3 py-1.5 bg-surface-2 hover:bg-surface-3 border border-border text-text-primary rounded text-xs font-medium transition-colors"
                      >
                        Chi tiết
                      </Link>

                      <Link
                        href={`/projects/${proj.id}/rooms/${firstRoom?.id || ""}/editor`}
                        onClick={() => switchProject(proj)}
                        className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
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
        )}
      </div>

      {/* Modal Tạo Dự Án Mới */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 select-none">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Building2 className="w-4 h-4" />
                <span>Tạo Dự Án Khảo Sát Mới</span>
              </div>
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-text-secondary font-medium">Tên dự án công trình *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Keangnam Hanoi Landmark - Tầng 24"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Tên khách hàng</label>
                  <input
                    type="text"
                    placeholder="Tập đoàn Keangnam"
                    value={newProjectCustomer}
                    onChange={(e) => setNewProjectCustomer(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Địa điểm / Địa chỉ</label>
                  <input
                    type="text"
                    placeholder="Hà Nội"
                    value={newProjectLocation}
                    onChange={(e) => setNewProjectLocation(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text-secondary"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white font-medium"
                >
                  Tạo Dự Án
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal Delete Project */}
      {projectToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-sm p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="text-sm font-bold text-text-primary">Xác Nhận Xóa Dự Án</h3>
            <p className="text-xs text-text-secondary">
              Bạn có chắc chắn muốn xóa dự án này? Thao tác này sẽ làm mất toàn bộ các phòng và sơ đồ 3D đi kèm.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 text-text-secondary text-xs"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-1.5 rounded bg-danger hover:bg-red-600 text-white text-xs font-semibold"
              >
                Xóa Dự Án
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
