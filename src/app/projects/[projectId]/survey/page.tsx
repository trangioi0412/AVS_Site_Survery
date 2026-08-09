"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/app-shell/app-layout";
import { useEditorStore } from "@/stores/editor-store";
import {
  ClipboardCheck,
  Building2,
  DoorClosed,
  Sliders,
  Zap,
  Network,
  Cpu,
  MapPin,
  FileText,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Save,
  Box,
} from "lucide-react";
import { toast } from "sonner";

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string;

  const {
    projects,
    rooms,
    updateRoomDimensions,
    saveSurveyDraft,
    surveyDrafts,
  } = useEditorStore();

  const project = projects.find((p) => p.id === projectId);
  const projectRooms = rooms[projectId] || [];

  const [selectedRoomId, setSelectedRoomId] = useState<string>(
    projectRooms[0]?.id || ""
  );
  const [currentStep, setCurrentStep] = useState(1);

  const selectedRoom =
    projectRooms.find((r) => r.id === selectedRoomId) || projectRooms[0];

  // Survey Form Fields
  const [projectName, setProjectName] = useState(project?.name || "");
  const [customer, setCustomer] = useState(project?.customer || "");
  const [location, setLocation] = useState(project?.location || "");

  const [roomName, setRoomName] = useState(selectedRoom?.name || "");
  const [roomType, setRoomType] = useState(selectedRoom?.type || "meeting-room");

  const [width, setWidth] = useState(selectedRoom?.dimensions?.width || 8);
  const [length, setLength] = useState(selectedRoom?.dimensions?.length || 10);
  const [height, setHeight] = useState(selectedRoom?.dimensions?.height || 3.2);

  const [powerSockets, setPowerSockets] = useState("2 x 220V Sockets (Under Table & Wall)");
  const [networkOutlets, setNetworkOutlets] = useState("2 x Cat6A Dual RJ45 Outlets");
  const [existingEquipment, setExistingEquipment] = useState("1x 85 inch Display, 2x JBL Ceiling Speakers");
  const [desiredInstallation, setDesiredInstallation] = useState("Wall Mount Display + PTZ Camera Center");
  const [notes, setNotes] = useState("Trần thạch cao cao 3.2m, dây mạng âm tường có sẵn.");

  // Sync form when selected room changes
  useEffect(() => {
    if (selectedRoom) {
      setRoomName(selectedRoom.name);
      setRoomType(selectedRoom.type);
      setWidth(selectedRoom.dimensions.width);
      setLength(selectedRoom.dimensions.length);
      setHeight(selectedRoom.dimensions.height);

      const existingDraft = surveyDrafts[selectedRoom.id];
      if (existingDraft) {
        setPowerSockets((existingDraft.powerSockets as string) || "2 x 220V Sockets (Under Table & Wall)");
        setNetworkOutlets((existingDraft.networkOutlets as string) || "2 x Cat6A Dual RJ45 Outlets");
        setExistingEquipment((existingDraft.existingEquipment as string) || "1x 85 inch Display, 2x JBL Ceiling Speakers");
        setDesiredInstallation((existingDraft.desiredInstallation as string) || "Wall Mount Display + PTZ Camera Center");
        setNotes((existingDraft.notes as string) || "Trần thạch cao cao 3.2m, dây mạng âm tường có sẵn.");
      }
    }
  }, [selectedRoomId, selectedRoom, surveyDrafts]);

  if (!project || !selectedRoom) {
    return (
      <AppLayout>
        <div className="p-12 text-center bg-surface-1 border border-dashed border-border rounded-xl space-y-4 max-w-md mx-auto my-12">
          <ClipboardCheck className="w-12 h-12 text-text-secondary/40 mx-auto" />
          <h2 className="text-base font-bold text-text-primary">Không tìm thấy khảo sát</h2>
          <p className="text-xs text-text-secondary">Dự án hoặc phòng họp không tồn tại.</p>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-md text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Danh sách dự án</span>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const STEPS = [
    { num: 1, label: "Dự án", icon: Building2 },
    { num: 2, label: "Phòng họp", icon: DoorClosed },
    { num: 3, label: "Kích thước 3D", icon: Sliders },
    { num: 4, label: "Hạ tầng Điện", icon: Zap },
    { num: 5, label: "Hạ tầng Mạng", icon: Network },
    { num: 6, label: "Thiết bị có sẵn", icon: Cpu },
    { num: 7, label: "Vị trí lắp đặt", icon: MapPin },
    { num: 8, label: "Ghi chú & Ảnh", icon: FileText },
    { num: 9, label: "Xác nhận", icon: CheckCircle2 },
  ];

  const handleSaveDraft = () => {
    // Update 3D room dimensions
    updateRoomDimensions({
      width: Math.max(2, Number(width)),
      length: Math.max(2, Number(length)),
      height: Math.max(2, Number(height)),
    });

    // Save survey draft text
    saveSurveyDraft(selectedRoom.id, {
      projectName,
      customer,
      location,
      roomName,
      roomType,
      width,
      length,
      height,
      powerSockets,
      networkOutlets,
      existingEquipment,
      desiredInstallation,
      notes,
      updatedAt: new Date().toISOString(),
    });

    toast.success(`Đã lưu bản nháp khảo sát cho phòng "${selectedRoom.name}"!`);
  };

  const handleCompleteSurvey = () => {
    handleSaveDraft();
    toast.success("Đã hoàn tất quy trình khảo sát! Đang chuyển sang 3D Editor...");
    setTimeout(() => {
      router.push(`/projects/${project.id}/rooms/${selectedRoom.id}/editor`);
    }, 600);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div className="space-y-1">
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại chi tiết dự án</span>
            </Link>
            <h1 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Quy Trình Khảo Sát Kỹ Thuật AV
            </h1>
            <p className="text-xs text-text-secondary">
              Khảo sát thực địa {project.name} • {selectedRoom.name}
            </p>
          </div>

          {/* Select Room Dropdown & Actions */}
          <div className="flex items-center gap-2 shrink-0 text-xs">
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary font-medium focus:border-primary focus:outline-none"
            >
              {projectRooms.map((rm) => (
                <option key={rm.id} value={rm.id}>
                  {rm.name} ({rm.dimensions.width}x{rm.dimensions.length}m)
                </option>
              ))}
            </select>

            <button
              onClick={handleSaveDraft}
              className="px-3.5 py-2 bg-surface-2 hover:bg-surface-3 border border-border text-text-primary rounded-md font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4 text-primary" />
              <span>Lưu Nháp</span>
            </button>
          </div>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-surface-1 p-3 rounded-xl border border-border overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] text-xs">
            {STEPS.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.num;
              const isPassed = currentStep > step.num;

              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className={`flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors ${
                    isActive
                      ? "text-primary font-bold"
                      : isPassed
                      ? "text-emerald-400 font-medium"
                      : "text-text-secondary"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs border ${
                      isActive
                        ? "bg-primary text-white border-primary shadow-sm"
                        : isPassed
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : "bg-surface-2 border-border text-text-secondary"
                    }`}
                  >
                    {isPassed ? "✓" : step.num}
                  </div>
                  <span className="text-[10px] whitespace-nowrap">{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Form Container */}
        <div className="bg-surface-1 border border-border rounded-xl p-6 space-y-6">
          {/* STEP 1: PROJECT INFO */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <Building2 className="w-4 h-4 text-primary" />
                Bước 1: Thông tin công trình dự án
              </h2>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Tên dự án</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Tên khách hàng</label>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Địa điểm khảo sát</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ROOM INFO */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <DoorClosed className="w-4 h-4 text-primary" />
                Bước 2: Thông tin phòng khảo sát
              </h2>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Tên phòng họp</label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium">Loại phòng</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  >
                    <option value="meeting-room">Phòng họp tiêu chuẩn</option>
                    <option value="boardroom">Hội trường / Boardroom</option>
                    <option value="huddle">Huddle Space</option>
                    <option value="training">Phòng Đào tạo</option>
                    <option value="auditorium">Auditorium</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DIMENSIONS */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <Sliders className="w-4 h-4 text-primary" />
                Bước 3: Kích thước hình học 3D (X, Z, Y)
              </h2>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Chiều Rộng (X - m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Chiều Dài (Z - m)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="2"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-text-secondary font-medium font-sans">Chiều Cao (Y - m)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary"
                  />
                </div>
              </div>
              <div className="p-3 bg-surface-2 rounded border border-border/60 text-xs text-text-secondary">
                Diện tích sàn tính toán: <strong className="text-primary font-mono">{width * length} m²</strong>.
              </div>
            </div>
          )}

          {/* STEP 4: POWER */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Bước 4: Hạ tầng Cấp Nguồn Điện
              </h2>
              <div className="space-y-1 text-xs">
                <label className="text-text-secondary font-medium">Mô tả hạ tầng điện tại phòng</label>
                <textarea
                  rows={4}
                  value={powerSockets}
                  onChange={(e) => setPowerSockets(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-md p-3 text-text-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 5: NETWORK */}
          {currentStep === 5 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <Network className="w-4 h-4 text-blue-400" />
                Bước 5: Hạ tầng Mạng & Viễn thông
              </h2>
              <div className="space-y-1 text-xs">
                <label className="text-text-secondary font-medium">Mô tả ổ cắm LAN / Patch Panel</label>
                <textarea
                  rows={4}
                  value={networkOutlets}
                  onChange={(e) => setNetworkOutlets(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-md p-3 text-text-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: EXISTING EQUIPMENT */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Bước 6: Thiết bị hiện có (Existing AV Equipment)
              </h2>
              <div className="space-y-1 text-xs">
                <label className="text-text-secondary font-medium">Danh sách TV, loa, camera hiện trạng</label>
                <textarea
                  rows={4}
                  value={existingEquipment}
                  onChange={(e) => setExistingEquipment(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-md p-3 text-text-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 7: DESIRED INSTALLATION */}
          {currentStep === 7 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <MapPin className="w-4 h-4 text-purple-400" />
                Bước 7: Vị trí lắp đặt thiết bị mong muốn
              </h2>
              <div className="space-y-1 text-xs">
                <label className="text-text-secondary font-medium">Phương án bố trí (Tường trước, trần, bàn)</label>
                <textarea
                  rows={4}
                  value={desiredInstallation}
                  onChange={(e) => setDesiredInstallation(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-md p-3 text-text-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 8: NOTES & PHOTOS */}
          {currentStep === 8 && (
            <div className="space-y-4 max-w-lg">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <FileText className="w-4 h-4 text-primary" />
                Bước 8: Ghi chú khảo sát & Ảnh hiện trường
              </h2>
              <div className="space-y-1 text-xs">
                <label className="text-text-secondary font-medium">Ghi chú đặc biệt (Trần thạch cao, tường kính, tiếng ồn)</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-2 border border-border rounded-md p-3 text-text-primary focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 9: CONFIRMATION */}
          {currentStep === 9 && (
            <div className="space-y-4 max-w-xl">
              <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 border-b border-border/60 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Bước 9: Tổng hợp và xác nhận bản khảo sát
              </h2>

              <div className="bg-surface-2 p-4 rounded-lg border border-border space-y-2 text-xs">
                <p><strong>Công trình:</strong> {projectName} ({customer})</p>
                <p><strong>Phòng:</strong> {roomName} ({width}m x {length}m x {height}m - {width * length}m²)</p>
                <p><strong>Hạ tầng điện:</strong> {powerSockets}</p>
                <p><strong>Hạ tầng mạng:</strong> {networkOutlets}</p>
                <p><strong>Thiết bị đề xuất:</strong> {desiredInstallation}</p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={handleCompleteSurvey}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-md shadow-primary/20 transition-all"
                >
                  <Box className="w-4 h-4" />
                  <span>Hoàn Thành & Mở 3D Editor</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Prev / Next Buttons */}
          <div className="pt-4 border-t border-border/80 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-4 py-1.5 rounded bg-surface-2 hover:bg-surface-3 border border-border text-text-primary disabled:opacity-40 text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại</span>
            </button>

            {currentStep < 9 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(9, prev + 1))}
                className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Tiếp theo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã kiểm tra xong</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
