"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/app-shell/app-layout";
import { useEditorStore } from "@/stores/editor-store";
import {
  FolderKanban,
  DoorClosed,
  ClipboardCheck,
  Cpu,
  Plus,
  ArrowRight,
  Box,
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Sliders,
  FileCode,
} from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const {
    projects,
    rooms,
    currentProject,
    currentRoom,
    createProject,
    switchProject,
  } = useEditorStore();

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCustomer, setNewProjectCustomer] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");

  // Calculate Metrics from Store State
  const totalProjects = projects.length;
  const totalRooms = Object.values(rooms).reduce((acc, list) => acc + list.length, 0);
  const surveyingProjects = projects.filter((p) => p.status === "surveying").length;
  const approvedProjects = projects.filter((p) => p.status === "approved" || p.status === "completed").length;

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
    toast.success(`Đã tạo và kích hoạt dự án mới "${newProjectName.trim()}"!`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Hero Banner */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-surface-1 via-surface-2 to-surface-1 border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1.5 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-xs font-semibold">
              <Box className="w-3.5 h-3.5" />
              <span>AVS Site Survey & 3D Planner System</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">
              Bảng Khảo Sát & Lập Kế Hoạch AV 3D
            </h1>
            <p className="text-xs text-text-secondary max-w-xl">
              Hệ thống khảo sát công trình kỹ thuật, dựng sơ đồ 3D phòng họp và lập danh mục thiết bị cho Kỹ sư AV Planner.
            </p>
          </div>

          <div className="flex items-center gap-2.5 z-10 shrink-0">
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md shadow-primary/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Dự Án Mới</span>
            </button>
            <Link
              href={`/projects/${currentProject.id}/rooms/${currentRoom.id}/editor`}
              className="px-4 py-2 bg-surface-3 hover:bg-border text-text-primary border border-border/80 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Box className="w-4 h-4 text-primary" />
              <span>Mở 3D Editor</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1 */}
          <div className="p-4 rounded-lg bg-surface-1 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">Tổng Dự Án</span>
              <div className="p-2 rounded-md bg-primary/15 text-primary">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary font-mono">{totalProjects}</span>
              <span className="text-[10px] text-text-secondary">công trình</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-lg bg-surface-1 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">Tổng Phòng Khảo Sát</span>
              <div className="p-2 rounded-md bg-status-existing/15 text-status-existing">
                <DoorClosed className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary font-mono">{totalRooms}</span>
              <span className="text-[10px] text-text-secondary">phòng 3D</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-lg bg-surface-1 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">Đang Khảo Sát</span>
              <div className="p-2 rounded-md bg-status-proposed/15 text-status-proposed">
                <ClipboardCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary font-mono">{surveyingProjects}</span>
              <span className="text-[10px] text-text-secondary">đang triển khai</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="p-4 rounded-lg bg-surface-1 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">Đã Duyệt Phương Án</span>
              <div className="p-2 rounded-md bg-emerald-500/15 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-text-primary font-mono">{approvedProjects}</span>
              <span className="text-[10px] text-text-secondary">hoàn thành</span>
            </div>
          </div>
        </div>

        {/* Content Section: Recent Projects & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Recent Projects List (2 cols) */}
          <div className="lg:col-span-2 bg-surface-1 border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-bold text-text-primary">Dự Án Khảo Sát Gần Đây</h2>
              </div>
              <Link
                href="/projects"
                className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
              >
                <span>Xem tất cả ({totalProjects})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 4).map((proj) => {
                const projectRooms = rooms[proj.id] || [];
                const isCurrent = proj.id === currentProject.id;
                return (
                  <div
                    key={proj.id}
                    className={`p-3.5 rounded-lg border transition-all flex items-center justify-between gap-3 ${
                      isCurrent
                        ? "bg-primary/10 border-primary/40 shadow-sm"
                        : "bg-surface-2/60 border-border/60 hover:border-primary/40"
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-text-primary truncate">{proj.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-primary text-white px-1.5 py-0.2 rounded font-medium shrink-0">
                            Đang mở
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-text-secondary">
                        <span>{proj.customer}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-text-secondary" />
                          {proj.location}
                        </span>
                        <span>•</span>
                        <span>{projectRooms.length} phòng</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/projects/${proj.id}`}
                        onClick={() => switchProject(proj)}
                        className="px-3 py-1.5 rounded bg-surface-3 hover:bg-border text-text-primary text-xs font-medium transition-colors"
                      >
                        Chi tiết
                      </Link>
                      <Link
                        href={`/projects/${proj.id}/rooms/${projectRooms[0]?.id || ""}/editor`}
                        onClick={() => switchProject(proj)}
                        className="px-3 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-medium flex items-center gap-1 transition-colors"
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>3D Editor</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Quick Actions & Active Room Info */}
          <div className="space-y-6">
            {/* Active Room Card */}
            <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <DoorClosed className="w-4 h-4 text-status-existing" />
                  Phòng Hiện Tại
                </span>
                <span className="text-[10px] text-primary font-mono bg-primary/10 px-2 py-0.5 rounded border border-primary/30 font-semibold">
                  {currentRoom.dimensions.width}m x {currentRoom.dimensions.length}m
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-text-primary">{currentRoom.name}</h3>
                <p className="text-xs text-text-secondary">{currentProject.name}</p>
                <div className="pt-2 flex items-center gap-2 text-xs text-text-secondary">
                  <span>Diện tích:</span>
                  <span className="font-mono font-bold text-text-primary">
                    {currentRoom.dimensions.width * currentRoom.dimensions.length} m²
                  </span>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                <Link
                  href={`/projects/${currentProject.id}/survey`}
                  className="w-full py-2 bg-surface-2 hover:bg-surface-3 border border-border/80 text-text-primary rounded-md flex items-center justify-center gap-1.5 font-medium transition-colors"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-primary" />
                  <span>Khảo sát</span>
                </Link>

                <Link
                  href={`/projects/${currentProject.id}/rooms/${currentRoom.id}/editor`}
                  className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-md flex items-center justify-center gap-1.5 font-semibold transition-colors"
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Mở Editor</span>
                </Link>
              </div>
            </div>

            {/* Navigation Quick Shortcuts */}
            <div className="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-text-primary border-b border-border/60 pb-2">
                Truy Cập Nhanh
              </h3>

              <div className="space-y-2 text-xs">
                <Link
                  href="/equipment"
                  className="w-full p-2.5 rounded-lg bg-surface-2/60 hover:bg-surface-2 border border-border/60 flex items-center justify-between text-text-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-primary" />
                    <span>Danh mục thiết bị AV</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />
                </Link>

                <Link
                  href="/reports"
                  className="w-full p-2.5 rounded-lg bg-surface-2/60 hover:bg-surface-2 border border-border/60 flex items-center justify-between text-text-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-status-existing" />
                    <span>Xuất báo cáo BOM & 3D JSON</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />
                </Link>

                <Link
                  href="/settings"
                  className="w-full p-2.5 rounded-lg bg-surface-2/60 hover:bg-surface-2 border border-border/60 flex items-center justify-between text-text-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-status-proposed" />
                    <span>Cài đặt đơn vị đo & Grid 3D</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-text-secondary" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
