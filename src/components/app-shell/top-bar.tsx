"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  PanelLeftClose,
  PanelLeftOpen,
  Undo2,
  Redo2,
  Share2,
  Download,
  Building2,
  ChevronDown,
  User,
  CheckCircle2,
  FileSpreadsheet,
  FileCode,
  Image as ImageIcon,
  Plus,
  Settings,
  Globe,
  LogOut,
  Sliders,
  Copy,
  Check,
  QrCode,
  Lock,
  Eye,
  ShieldCheck,
  Save,
  X,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { ProjectInfo, RoomInfo } from "@/types/equipment";
import { toast } from "sonner";
import { exportSceneToJson, exportBomToCsv } from "@/lib/export-helpers";

export const TopBar: React.FC = () => {
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    undo,
    redo,
    historyIndex,
    history,
    objects,
    projects,
    rooms,
    currentProject,
    currentRoom,
    isDirty,
    lastSavedAt,
    createProject,
    switchProject,
    switchRoom,
    updateRoomDimensions,
    saveProject,
    setViewMode,
  } = useEditorStore();

  // Dropdown states
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [roomDropdownOpen, setRoomDropdownOpen] = useState(false);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Modal states
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showRoomDimensionsModal, setShowRoomDimensionsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  // Copy state
  const [copiedLink, setCopiedLink] = useState(false);

  // Form states
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectCustomer, setNewProjectCustomer] = useState("");
  const [newProjectLocation, setNewProjectLocation] = useState("");

  const [roomWidth, setRoomWidth] = useState(currentRoom.dimensions.width);
  const [roomLength, setRoomLength] = useState(currentRoom.dimensions.length);
  const [roomHeight, setRoomHeight] = useState(currentRoom.dimensions.height);

  const [shareAccess, setShareAccess] = useState<"private" | "team" | "public">("team");
  const [language, setLanguage] = useState<"vie" | "eng">("vie");

  // Sync room dimensions when room changes
  useEffect(() => {
    setRoomWidth(currentRoom.dimensions.width);
    setRoomLength(currentRoom.dimensions.length);
    setRoomHeight(currentRoom.dimensions.height);
  }, [currentRoom]);

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveProject();
        toast.success("Đã lưu tiến độ khảo sát dự án!");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, saveProject]);

  // Handle Project Creation
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Vui lòng nhập tên dự án!");
      return;
    }

    createProject({
      name: newProjectName.trim(),
      customer: newProjectCustomer.trim(),
      location: newProjectLocation.trim(),
    });

    setShowNewProjectModal(false);
    setNewProjectName("");
    setNewProjectCustomer("");
    setNewProjectLocation("");
    toast.success(`Đã tạo và chuyển sang dự án "${newProjectName.trim()}"!`);
  };

  // Handle Room Dimension Update
  const handleSaveRoomDimensions = (e: React.FormEvent) => {
    e.preventDefault();
    const w = Math.max(2, Math.min(50, Number(roomWidth)));
    const l = Math.max(2, Math.min(50, Number(roomLength)));
    const h = Math.max(2, Math.min(15, Number(roomHeight)));

    updateRoomDimensions({ width: w, length: l, height: h });
    setShowRoomDimensionsModal(false);
    toast.success(`Đã cập nhật kích thước phòng: ${w}m x ${l}m x ${h}m`);
  };

  // Export JSON
  const handleExportJson = () => {
    exportSceneToJson(objects, currentProject.name);
    toast.success("Đã tải xuống file cấu trúc 3D JSON!");
    setExportDropdownOpen(false);
  };

  // Export CSV BOM
  const handleExportBom = () => {
    exportBomToCsv(objects, currentProject.name, currentRoom.name);
    toast.success("Đã xuất danh sách BOM thiết bị dạng CSV!");
    setExportDropdownOpen(false);
  };

  // Export 2D View Layout
  const handleExport2DLayout = () => {
    setViewMode("2d");
    toast.info("Đã chuyển sang góc nhìn Top-down 2D. Đang chụp mặt bằng...");
    setExportDropdownOpen(false);

    setTimeout(() => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const link = document.createElement("a");
        link.download = `MatBang2D_${currentProject.name.replace(/\s+/g, "_")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Đã xuất ảnh sơ đồ mặt bằng 2D PNG!");
      }
    }, 500);
  };

  // Copy Share Link
  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/projects/${currentProject.id}/rooms/${currentRoom.id}/editor`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    toast.success("Đã sao chép liên kết dự án vào bộ nhớ tạm!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <>
      <header className="h-[56px] bg-surface-1 border-b border-border px-4 flex items-center justify-between select-none z-30 relative shrink-0">
        {/* Left section: Logo, Sidebar Toggle, Project & Room Selectors */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setShowAboutModal(true)}
            className="flex items-center gap-2.5 font-bold text-text-primary text-base tracking-wide pr-2 border-r border-border/60 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <Box className="w-5 h-5" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              AV Survey{" "}
              <span className="text-xs font-normal px-1.5 py-0.5 rounded bg-primary/20 text-primary border border-primary/30 ml-1">
                3D
              </span>
            </span>
          </div>

          <button
            onClick={toggleSidebar}
            title={sidebarCollapsed ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-2 rounded-md transition-colors"
            aria-label="Toggle Sidebar"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Selectors */}
          <div className="flex items-center gap-2 text-xs text-text-secondary pl-1">
            {/* Project Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProjectDropdownOpen(!projectDropdownOpen);
                  setRoomDropdownOpen(false);
                  setExportDropdownOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface-2 border border-border/80 hover:border-primary/60 cursor-pointer transition-all text-text-primary font-medium"
              >
                <Building2 className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[130px]">{currentProject.name}</span>
                <ChevronDown className="w-3 h-3 text-text-secondary ml-0.5" />
              </button>

              {projectDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-60 bg-surface-2 border border-border rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-text-secondary border-b border-border/60 flex items-center justify-between">
                    <span>Danh sách Dự Án ({projects.length})</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto py-1">
                    {projects.map((proj) => {
                      const isActive = proj.id === currentProject.id;
                      return (
                        <button
                          key={proj.id}
                          onClick={() => {
                            const targetRooms = rooms[proj.id] || [];
                            const targetRoomId = targetRooms[0]?.id || currentRoom.id;
                            router.push(`/projects/${proj.id}/rooms/${targetRoomId}/editor`);
                            setProjectDropdownOpen(false);
                            toast.info(`Đã chuyển sang dự án ${proj.name}`);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                            isActive
                              ? "bg-primary/15 text-primary font-semibold"
                              : "text-text-primary hover:bg-surface-3"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="truncate">{proj.name}</span>
                            <span className="text-[10px] text-text-secondary font-normal">
                              {proj.customer} • {proj.location}
                            </span>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-1.5 border-t border-border/60">
                    <button
                      onClick={() => {
                        setProjectDropdownOpen(false);
                        setShowNewProjectModal(true);
                      }}
                      className="w-full py-1.5 px-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded flex items-center justify-center gap-1 text-xs font-medium transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tạo dự án mới</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="text-border font-light">/</span>

            {/* Room Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setRoomDropdownOpen(!roomDropdownOpen);
                  setProjectDropdownOpen(false);
                  setExportDropdownOpen(false);
                  setUserDropdownOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-surface-2 border border-border/80 hover:border-primary/60 cursor-pointer transition-all text-text-primary font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-status-existing animate-pulse"></span>
                <span className="truncate max-w-[140px]">{currentRoom.name}</span>
                <span className="text-[10px] text-text-secondary ml-1 bg-surface-3 px-1.5 py-0.2 rounded border border-border/40 font-mono">
                  {currentRoom.dimensions.width}m x {currentRoom.dimensions.length}m
                </span>
                <ChevronDown className="w-3 h-3 text-text-secondary ml-0.5" />
              </button>

              {roomDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-64 bg-surface-2 border border-border rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-text-secondary border-b border-border/60 flex items-center justify-between">
                    <span>Phòng trong {currentProject.name}</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto py-1">
                    {(rooms[currentProject.id] || [currentRoom]).map((rm) => {
                      const isActive = rm.id === currentRoom.id;
                      return (
                        <button
                          key={rm.id}
                          onClick={() => {
                            router.push(`/projects/${currentProject.id}/rooms/${rm.id}/editor`);
                            setRoomDropdownOpen(false);
                            toast.info(`Đã chuyển sang phòng ${rm.name}`);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                            isActive
                              ? "bg-primary/15 text-primary font-semibold"
                              : "text-text-primary hover:bg-surface-3"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{rm.name}</span>
                            <span className="text-[10px] text-text-secondary font-mono">
                              Kích thước: {rm.dimensions.width}m x {rm.dimensions.length}m x {rm.dimensions.height}m
                            </span>
                          </div>
                          {isActive && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-1.5 border-t border-border/60">
                    <button
                      onClick={() => {
                        setRoomDropdownOpen(false);
                        setShowRoomDimensionsModal(true);
                      }}
                      className="w-full py-1.5 px-2 bg-surface-3 hover:bg-border text-text-primary rounded flex items-center justify-center gap-1.5 text-xs font-medium transition-colors"
                    >
                      <Sliders className="w-3.5 h-3.5 text-primary" />
                      <span>Chỉnh kích thước phòng</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Actions, Save Indicator, Export, User Profile */}
        <div className="flex items-center gap-3 text-xs">
          {/* Undo / Redo */}
          <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-md border border-border/60">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              title="Hoàn tác (Ctrl+Z)"
              className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-3 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors"
              aria-label="Undo"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              title="Làm lại (Ctrl+Y)"
              className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface-3 disabled:opacity-40 disabled:hover:bg-transparent rounded transition-colors"
              aria-label="Redo"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Save indicator */}
          <button
            onClick={() => {
              saveProject();
              toast.success("Đã lưu tiến độ khảo sát dự án!");
            }}
            title="Nhấp để lưu thủ công (Ctrl+S)"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
              isDirty
                ? "bg-warning/10 border-warning/40 text-warning hover:bg-warning/20"
                : "bg-surface-2/60 border-border/40 text-text-secondary hover:border-primary/40"
            }`}
          >
            {isDirty ? (
              <>
                <span className="w-2 h-2 rounded-full bg-warning animate-ping"></span>
                <span className="text-[11px] font-medium">Chưa lưu *</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-status-existing" />
                <span className="text-[11px]">Đã lưu {lastSavedAt}</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text-primary font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-primary" />
            <span>Chia sẻ</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setExportDropdownOpen(!exportDropdownOpen);
                setProjectDropdownOpen(false);
                setRoomDropdownOpen(false);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white font-medium shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất file</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface-2 border border-border rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95">
                <button
                  onClick={handleExportJson}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-text-primary hover:bg-surface-3 transition-colors"
                >
                  <FileCode className="w-4 h-4 text-primary" />
                  <span>Xuất Cấu trúc 3D (.JSON)</span>
                </button>
                <button
                  onClick={handleExportBom}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-text-primary hover:bg-surface-3 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-status-existing" />
                  <span>Xuất Bảng BOM (.CSV / Excel)</span>
                </button>
                <button
                  onClick={handleExport2DLayout}
                  className="w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 text-text-primary hover:bg-surface-3 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-status-proposed" />
                  <span>Xuất Sơ đồ Mặt bằng 2D (.PNG)</span>
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setProjectDropdownOpen(false);
                setRoomDropdownOpen(false);
                setExportDropdownOpen(false);
              }}
              className="flex items-center gap-2 pl-2 border-l border-border/60 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-semibold">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden lg:flex flex-col text-left leading-tight">
                <span className="font-semibold text-text-primary text-xs">Kỹ Sư AV</span>
                <span className="text-[10px] text-text-secondary">Admin</span>
              </div>
              <ChevronDown className="w-3 h-3 text-text-secondary hidden lg:block" />
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
                  <button
                    onClick={() => {
                      setLanguage(language === "vie" ? "eng" : "vie");
                      toast.info(`Đã đổi ngôn ngữ sang ${language === "vie" ? "English" : "Tiếng Việt"}`);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-3 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-primary" />
                      <span>Ngôn ngữ</span>
                    </div>
                    <span className="font-mono text-[10px] text-primary uppercase font-bold bg-primary/10 px-1.5 py-0.5 rounded">
                      {language}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowAboutModal(true);
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded hover:bg-surface-3 flex items-center gap-2 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-text-secondary" />
                    <span>Thông tin hệ thống</span>
                  </button>
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

      {/* --- MODALS OVERLAYS --- */}

      {/* 1. Modal Tạo Dự Án Mới */}
      {showNewProjectModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
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
                  placeholder="Ví dụ: Tòa nhà Landmark 81 - Tầng 15"
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

      {/* 2. Modal Chỉnh Sửa Kích Thước Phòng */}
      {showRoomDimensionsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sliders className="w-4 h-4" />
                <span>Kích Thước Phòng: {currentRoom.name}</span>
              </div>
              <button
                onClick={() => setShowRoomDimensionsModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRoomDimensions} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Chiều Rộng (X - m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="50"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Chiều Dài (Z - m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    max="50"
                    value={roomLength}
                    onChange={(e) => setRoomLength(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Chiều Cao (Y - m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    max="15"
                    value={roomHeight}
                    onChange={(e) => setRoomHeight(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-2.5 bg-surface-2/60 rounded border border-border/40 text-[11px] text-text-secondary">
                <p className="font-semibold text-primary mb-0.5">Lưu ý mô hình 3D:</p>
                <p>Thay đổi chiều dài và chiều rộng sẽ tự động mở rộng hoặc thu hẹp sàn 3D phòng họp lập tức.</p>
              </div>

              <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRoomDimensionsModal(false)}
                  className="px-3 py-1.5 rounded-md bg-surface-2 hover:bg-surface-3 border border-border text-text-secondary"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-white font-medium"
                >
                  Cập Nhật 3D
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal Chia Sẻ Dự Án */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Share2 className="w-4 h-4" />
                <span>Chia Sẻ Dự Án Khảo Sát</span>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-text-secondary font-medium">Quyền truy cập dự án</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setShareAccess("private")}
                    className={`p-2 rounded border text-center font-medium flex flex-col items-center gap-1 transition-colors ${
                      shareAccess === "private"
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-surface-2 border-border/60 text-text-secondary"
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Cá nhân</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareAccess("team")}
                    className={`p-2 rounded border text-center font-medium flex flex-col items-center gap-1 transition-colors ${
                      shareAccess === "team"
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-surface-2 border-border/60 text-text-secondary"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Nội bộ Team</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShareAccess("public")}
                    className={`p-2 rounded border text-center font-medium flex flex-col items-center gap-1 transition-colors ${
                      shareAccess === "public"
                        ? "bg-primary/15 border-primary text-primary"
                        : "bg-surface-2 border-border/60 text-text-secondary"
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Công khai</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-text-secondary font-medium">Liên kết trực tuyến</label>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/?project=${currentProject.id}&room=${currentRoom.id}`}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-1.5 text-text-primary text-[11px] font-mono focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyShareLink}
                    className="px-3 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-md flex items-center gap-1 shrink-0 transition-colors"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? "Đã chép" : "Sao chép"}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-surface-2/60 rounded-md border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-semibold text-text-primary">Mã QR Khảo Sát Nhanh</p>
                    <p className="text-[10px] text-text-secondary">Quét mã bằng iPad / Smartphone khi khảo sát công trình</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Thông Tin Hệ Thống */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-1 border border-border rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border/80 pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Box className="w-4 h-4" />
                <span>AV Survey 3D Planner v1.0.0</span>
              </div>
              <button
                onClick={() => setShowAboutModal(false)}
                className="text-text-secondary hover:text-text-primary p-1 rounded hover:bg-surface-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-text-secondary">
              <p>
                Hệ thống web application nội bộ dành cho kỹ sư khảo sát hệ thống Audio Visual (AV), quản lý công trình, hạ tầng và bố trí thiết bị 3D.
              </p>
              <div className="space-y-1 font-mono text-[11px] bg-surface-2 p-3 rounded border border-border/60 text-text-primary">
                <p>• Core: Next.js 14 App Router (TypeScript)</p>
                <p>• 3D Engine: Three.js & React Three Fiber</p>
                <p>• Store: Zustand State Management</p>
                <p>• Theme: Enterprise Dark Technical Theme</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/80 flex justify-end">
              <button
                onClick={() => setShowAboutModal(false)}
                className="px-4 py-1.5 bg-primary hover:bg-primary-hover text-white rounded-md font-medium text-xs"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
