"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronRight,
  User,
  Plus,
  Box,
  CheckCircle2,
  Globe,
  Settings,
  ShieldCheck,
  LogOut,
  X,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { toast } from "sonner";

export const AppHeader: React.FC = () => {
  const pathname = usePathname();
  const { currentProject, currentRoom, createProject } = useEditorStore();

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCustomer, setNewProjectCustomer] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");

  // Generate breadcrumb titles
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    const crumbs = [{ label: "Trang chủ", href: "/dashboard" }];

    if (parts[0] === "dashboard") {
      crumbs.push({ label: "Dashboard", href: "/dashboard" });
    } else if (parts[0] === "projects") {
      crumbs.push({ label: "Danh sách dự án", href: "/projects" });
      if (parts[1]) {
        crumbs.push({ label: currentProject.name || parts[1], href: `/projects/${parts[1]}` });
        if (parts[2] === "survey") {
          crumbs.push({ label: "Khảo sát", href: `/projects/${parts[1]}/survey` });
        } else if (parts[2] === "rooms" && parts[3]) {
          crumbs.push({ label: currentRoom.name || parts[3], href: `/projects/${parts[1]}/rooms/${parts[3]}` });
          if (parts[4] === "editor") {
            crumbs.push({ label: "3D Editor", href: pathname });
          }
        }
      }
    } else if (parts[0] === "equipment") {
      crumbs.push({ label: "Quản lý thiết bị", href: "/equipment" });
    } else if (parts[0] === "library") {
      crumbs.push({ label: "Thư viện Asset", href: "/library" });
    } else if (parts[0] === "reports") {
      crumbs.push({ label: "Báo cáo khảo sát", href: "/reports" });
    } else if (parts[0] === "settings") {
      crumbs.push({ label: "Cài đặt hệ thống", href: "/settings" });
    }

    return crumbs;
  };

  const handleCreateProject = (e: React.FormEvent) => {
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
    toast.success(`Đã tạo thành công dự án "${newProjectName.trim()}"!`);
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      <header className="h-[56px] bg-surface-1 border-b border-border px-4 flex items-center justify-between select-none z-30 shrink-0 sticky top-0">
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs">
          <Building2 className="w-4 h-4 text-primary shrink-0" />
          <nav className="flex items-center gap-1.5 overflow-x-auto py-1">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 text-text-secondary shrink-0" />}
                  {isLast ? (
                    <span className="font-semibold text-text-primary truncate max-w-[180px]">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="text-text-secondary hover:text-text-primary transition-colors truncate max-w-[140px]"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Right: Active Project Badge, Create Project Action, User Dropdown */}
        <div className="flex items-center gap-3 text-xs">
          {/* Active Context Badge */}
          {currentProject?.id && (
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-2 border border-border/80 text-text-secondary">
              <span className="w-2 h-2 rounded-full bg-status-existing animate-pulse shrink-0"></span>
              <span className="font-medium text-text-primary truncate max-w-[130px]">{currentProject.name}</span>
              <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.2 rounded border border-primary/30">
                {currentRoom.name}
              </span>
            </div>
          )}

          {/* Quick Create Project Button */}
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-md font-medium shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tạo dự án mới</span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 border-l border-border/60 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-semibold">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="font-semibold text-text-primary text-xs">Kỹ Sư AV</span>
                <span className="text-[10px] text-text-secondary">Admin</span>
              </div>
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-surface-2 border border-border rounded-md shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 space-y-2">
                <div className="p-2 bg-surface-3 rounded border border-border/60">
                  <p className="font-bold text-text-primary text-xs">Kỹ Sư AV Survey</p>
                  <p className="text-[10px] text-text-secondary">admin@avsurvey.com</p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-primary">
                    <ShieldCheck className="w-3 h-3" />
                    <span>System Administrator</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs text-text-primary">
                  <Link
                    href="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-3 flex items-center gap-2 transition-colors block"
                  >
                    <Settings className="w-3.5 h-3.5 text-text-secondary" />
                    <span>Cài đặt hệ thống</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-border/60">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      toast.info("Đã giả lập đăng xuất hệ thống");
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-danger/10 text-danger flex items-center gap-2 transition-colors text-xs font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

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

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-text-secondary font-medium">Tên dự án công trình *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tòa nhà Bitexco Financial - Tầng 18"
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
                    placeholder="Tập đoàn ABC"
                    value={newProjectCustomer}
                    onChange={(e) => setNewProjectCustomer(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Địa điểm / Địa chỉ</label>
                  <input
                    type="text"
                    placeholder="TP. Hồ Chí Minh"
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
    </>
  );
};
