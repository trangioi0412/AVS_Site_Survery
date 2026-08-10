"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/app-shell/app-layout";
import { MOCK_EQUIPMENT_LIBRARY } from "@/data/mock-equipment";
import { EquipmentItem } from "@/types/equipment";
import { ObjectCategory } from "@/types/editor";
import {
  Cpu,
  Search,
  Plus,
  Tv,
  Camera,
  Volume2,
  Mic,
  Server,
  Network,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { PortalModal } from "@/components/ui/portal-modal";

export default function EquipmentPage() {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>(MOCK_EQUIPMENT_LIBRARY);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [category, setCategory] = useState<ObjectCategory>("display");
  const [width, setWidth] = useState(1.0);
  const [height, setHeight] = useState(0.8);
  const [depth, setDepth] = useState(0.1);

  const filteredEquipment = equipmentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !model.trim()) {
      toast.error("Vui lòng nhập tên thiết bị và model!");
      return;
    }

    const newItem: EquipmentItem = {
      id: `eq-custom-${Date.now()}`,
      name: name.trim(),
      category,
      subcategory: category.toUpperCase(),
      brand: brand.trim() || "Generic",
      model: model.trim(),
      iconName: "Cpu",
      defaultDimensions: { width, height, depth },
      defaultColor: "#3b82f6",
      defaultStatus: "proposed",
    };

    setEquipmentList([newItem, ...equipmentList]);
    setShowAddModal(false);
    setName("");
    setBrand("");
    setModel("");
    toast.success(`Đã thêm thiết bị "${newItem.name}" vào danh mục!`);
  };

  const CATEGORIES = [
    { id: "all", label: "Tất cả thiết bị", icon: Cpu },
    { id: "display", label: "Màn hình & TV", icon: Tv },
    { id: "camera", label: "Camera PTZ", icon: Camera },
    { id: "audio", label: "Âm thanh & Loa", icon: Volume2 },
    { id: "microphone", label: "Microphone", icon: Mic },
    { id: "rack", label: "Tủ Rack Server", icon: Server },
    { id: "infrastructure", label: "Hạ tầng Ổ cắm", icon: Network },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Cpu className="w-5 h-5" />
              <span>Quản Lý Danh Mục Thiết Bị AV</span>
            </div>
            <h1 className="text-xl font-bold text-text-primary mt-1">
              Thư Viện Thông Số Kỹ Thuật Thiết Bị ({equipmentList.length})
            </h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md shadow-primary/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Thiết Bị Mới</span>
          </button>
        </div>

        {/* Search & Category Tabs */}
        <div className="space-y-3">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, hãng sản xuất (Samsung, Shure, JBL, Logitech)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-1 border border-border rounded-md pl-9 pr-3 py-2 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full border font-medium flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary/15 border-primary text-primary font-semibold"
                      : "bg-surface-1 border-border/60 text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Cards Grid */}
        {filteredEquipment.length === 0 ? (
          <div className="p-12 text-center bg-surface-1 border border-dashed border-border rounded-xl space-y-3">
            <Cpu className="w-12 h-12 text-text-secondary/40 mx-auto" />
            <h3 className="text-sm font-semibold text-text-primary">Không tìm thấy thiết bị phù hợp</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto">
              Thử thay đổi từ khóa hoặc bộ lọc danh mục.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipment.map((item) => (
              <div
                key={item.id}
                className="bg-surface-1 border border-border hover:border-primary/40 rounded-xl p-4 space-y-3 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-text-primary block line-clamp-1">
                      {item.name}
                    </span>
                    <span className="text-[10px] bg-surface-3 px-2 py-0.5 rounded text-text-secondary font-mono border border-border/40 uppercase shrink-0">
                      {item.category}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-text-secondary">
                    <p>Hãng: <strong className="text-text-primary">{item.brand}</strong></p>
                    <p>Model: <strong className="text-primary font-mono">{item.model}</strong></p>
                    {item.subcategory && (
                      <p>Phân loại: <span className="text-text-primary">{item.subcategory}</span></p>
                    )}
                  </div>

                  <div className="p-2 bg-surface-2 rounded border border-border/40 text-[11px] font-mono text-text-secondary flex justify-between">
                    <span>Kích thước 3D chuẩn:</span>
                    <span className="text-text-primary font-bold">
                      {item.defaultDimensions.width}m x {item.defaultDimensions.height}m x {item.defaultDimensions.depth}m
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Equipment */}
      <PortalModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Thêm Thiết Bị AV Mới"
        icon={Plus}
      >
        <form onSubmit={handleAddEquipmentSubmit} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Tên thiết bị *</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Samsung 98 Inch 4K Display"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-text-secondary font-medium">Hãng sản xuất</label>
              <input
                type="text"
                placeholder="Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-text-secondary font-medium">Model *</label>
              <input
                type="text"
                required
                placeholder="QM98R"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-text-secondary font-medium">Danh mục thiết bị</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ObjectCategory)}
              className="w-full bg-surface-2 border border-border rounded-md px-3 py-2 text-text-primary focus:border-primary focus:outline-none"
            >
              <option value="display">Màn hình Display</option>
              <option value="camera">Camera PTZ</option>
              <option value="audio">Âm thanh / Loa</option>
              <option value="microphone">Microphone</option>
              <option value="rack">Tủ Rack Server</option>
              <option value="infrastructure">Hạ tầng Viễn thông</option>
              <option value="furniture">Bàn ghế Nội thất</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono">
            <div className="space-y-1">
              <label className="text-text-secondary font-medium font-sans">Rộng (m)</label>
              <input
                type="number"
                step="0.1"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full bg-surface-2 border border-border rounded-md px-2 py-1.5 text-text-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-text-secondary font-medium font-sans">Cao (m)</label>
              <input
                type="number"
                step="0.1"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full bg-surface-2 border border-border rounded-md px-2 py-1.5 text-text-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-text-secondary font-medium font-sans">Sâu (m)</label>
              <input
                type="number"
                step="0.1"
                value={depth}
                onChange={(e) => setDepth(Number(e.target.value))}
                className="w-full bg-surface-2 border border-border rounded-md px-2 py-1.5 text-text-primary"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-border/80 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 rounded bg-surface-2 hover:bg-surface-3 text-text-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-primary hover:bg-primary-hover text-white font-medium"
            >
              Thêm Thiết Bị
            </button>
          </div>
        </form>
      </PortalModal>
    </AppLayout>
  );
}
