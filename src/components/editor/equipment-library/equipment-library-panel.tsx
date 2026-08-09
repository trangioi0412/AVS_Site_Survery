"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Tv,
  Camera,
  Volume2,
  Mic,
  Server,
  Network,
  Zap,
  Plug,
  Plus,
  PlusCircle,
  Armchair,
  Video,
  MonitorPlay,
  Projector,
  MicOff,
  VolumeX,
} from "lucide-react";
import { MOCK_EQUIPMENT_LIBRARY } from "@/data/mock-equipment";
import { useEditorStore } from "@/stores/editor-store";
import { EquipmentItem } from "@/types/equipment";
import { generateId } from "@/lib/utils";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Tv,
  MonitorPlay,
  Projector,
  Camera,
  Video,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Server,
  Network,
  Zap,
  Plug,
};

export const EquipmentLibraryPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "av" | "it" | "furniture">("all");
  const { addObject } = useEditorStore();

  const handleAddEquipment = (item: EquipmentItem) => {
    const newId = generateId(item.category);
    // Slight random offset in position so new items don't overlap completely at origin
    const offsetX = (Math.random() - 0.5) * 2;
    const offsetZ = (Math.random() - 0.5) * 2;

    addObject({
      id: newId,
      name: `${item.name} (${item.brand})`,
      type: item.subcategory,
      category: item.category,
      brand: item.brand,
      model: item.model,
      status: item.defaultStatus,
      position: [offsetX, 1.0, offsetZ],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      dimensions: item.defaultDimensions,
      visible: true,
      locked: false,
      color: item.defaultStatus === "proposed" ? "#8b5cf6" : "#22c55e",
      metadata: { ...item.metadata },
    });

    toast.success(`Đã thêm ${item.name} vào mô hình 3D!`);
  };

  const filteredEquipment = MOCK_EQUIPMENT_LIBRARY.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.model.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "av") return ["display", "camera", "audio", "microphone"].includes(item.category);
    if (activeTab === "it") return ["rack", "infrastructure"].includes(item.category);
    if (activeTab === "furniture") return item.category === "furniture";

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-surface-1 border-r border-border select-none overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-primary" />
            Thư viện thiết bị
          </h2>
          <span className="text-[10px] text-text-secondary bg-surface-2 px-1.5 py-0.5 rounded border border-border/50 font-mono">
            {filteredEquipment.length} mục
          </span>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-1.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Tìm thiết bị, brand, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-border/80 rounded-md pl-8 pr-2 py-1 text-xs text-text-primary placeholder:text-text-secondary/60 focus:border-primary focus:outline-none"
            />
          </div>
          <button
            title="Lọc danh mục"
            className="p-1.5 bg-surface-2 hover:bg-surface-3 border border-border/80 rounded-md text-text-secondary hover:text-text-primary transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-4 gap-1 p-0.5 bg-surface-2 rounded-md border border-border/60 text-[11px]">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-1 rounded text-center font-medium transition-colors ${
              activeTab === "all" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("av")}
            className={`py-1 rounded text-center font-medium transition-colors ${
              activeTab === "av" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            AV
          </button>
          <button
            onClick={() => setActiveTab("it")}
            className={`py-1 rounded text-center font-medium transition-colors ${
              activeTab === "it" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            IT
          </button>
          <button
            onClick={() => setActiveTab("furniture")}
            className={`py-1 rounded text-center font-medium transition-colors ${
              activeTab === "furniture" ? "bg-primary text-white" : "text-text-secondary hover:text-text-primary"
            }`}
          >
            Nội thất
          </button>
        </div>
      </div>

      {/* Equipment Item List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {filteredEquipment.length === 0 ? (
          <div className="py-8 text-center text-text-secondary text-xs">
            Không tìm thấy thiết bị phù hợp
          </div>
        ) : (
          filteredEquipment.map((item) => {
            const IconComponent = ICON_MAP[item.iconName] || Tv;
            return (
              <div
                key={item.id}
                onClick={() => handleAddEquipment(item)}
                className="group relative flex items-center justify-between p-2 rounded-md bg-surface-2/60 hover:bg-surface-2 border border-border/50 hover:border-primary/50 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded bg-surface-3 border border-border/80 flex items-center justify-center shrink-0 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                      {item.name}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-text-secondary truncate mt-0.5">
                      <span className="font-mono text-text-primary/80">{item.brand}</span>
                      <span>•</span>
                      <span>{item.model}</span>
                    </div>
                  </div>
                </div>

                <button
                  title="Thêm vào phòng"
                  className="p-1 rounded bg-surface-3 group-hover:bg-primary group-hover:text-white text-text-secondary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
