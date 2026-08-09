"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Layers,
  Building,
  Armchair,
  Tv,
  Network,
  Box,
} from "lucide-react";
import { useEditorStore } from "@/stores/editor-store";
import { ObjectCategory, SceneObject } from "@/types/editor";
import { cn } from "@/lib/utils";

interface CategoryGroup {
  id: ObjectCategory;
  name: string;
  icon: React.FC<{ className?: string }>;
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  { id: "architecture", name: "Architecture", icon: Building },
  { id: "furniture", name: "Furniture", icon: Armchair },
  { id: "display", name: "AV Equipment", icon: Tv },
  { id: "infrastructure", name: "Infrastructure", icon: Network },
];

export const LayersPanel: React.FC = () => {
  const {
    objects,
    selectedObjectId,
    selectObject,
    toggleVisibility,
    toggleLock,
  } = useEditorStore();

  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    architecture: true,
    furniture: true,
    display: true,
    camera: true,
    audio: true,
    microphone: true,
    rack: true,
    infrastructure: true,
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const getCategoryObjects = (category: ObjectCategory) => {
    if (category === "display") {
      return objects.filter((o) =>
        ["display", "camera", "audio", "microphone", "rack"].includes(o.category)
      );
    }
    return objects.filter((o) => o.category === category);
  };

  return (
    <div className="flex flex-col h-full bg-surface-1 border-r border-border select-none overflow-hidden">
      {/* Panel Header */}
      <div className="p-3 border-b border-border/80 flex items-center justify-between">
        <h2 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-primary" />
          Scene Layers & Hierarchy
        </h2>
        <span className="text-[10px] text-text-secondary bg-surface-2 px-1.5 py-0.5 rounded border border-border/50 font-mono">
          {objects.length} objects
        </span>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
        {/* Root Node */}
        <div className="font-semibold text-text-primary flex items-center gap-1.5 px-2 py-1 bg-surface-2/60 rounded border border-border/40 mb-2">
          <Box className="w-4 h-4 text-primary" />
          <span>Meeting Room 501</span>
        </div>

        {CATEGORY_GROUPS.map((catGroup) => {
          const catObjects = getCategoryObjects(catGroup.id);
          const isExpanded = expandedCategories[catGroup.id] ?? true;
          const GroupIcon = catGroup.icon;

          if (catObjects.length === 0) return null;

          return (
            <div key={catGroup.id} className="space-y-0.5">
              {/* Category Header */}
              <div
                onClick={() => toggleCategory(catGroup.id)}
                className="flex items-center justify-between px-2 py-1 rounded hover:bg-surface-2 cursor-pointer text-text-secondary hover:text-text-primary transition-colors"
              >
                <div className="flex items-center gap-1.5 font-medium">
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                  <GroupIcon className="w-3.5 h-3.5 text-primary" />
                  <span>{catGroup.name}</span>
                </div>
                <span className="text-[10px] text-text-secondary/70 font-mono">
                  ({catObjects.length})
                </span>
              </div>

              {/* Category Children Objects */}
              {isExpanded && (
                <div className="pl-4 space-y-0.5 border-l border-border/40 ml-2.5">
                  {catObjects.map((obj) => {
                    const isSelected = selectedObjectId === obj.id;
                    return (
                      <div
                        key={obj.id}
                        onClick={() => selectObject(obj.id)}
                        className={cn(
                          "group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-all border",
                          isSelected
                            ? "bg-primary/20 border-primary text-text-primary font-medium"
                            : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2/70"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0">
                          {/* Status Color Dot */}
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                obj.status === "existing"
                                  ? "#22c55e"
                                  : obj.status === "proposed"
                                  ? "#8b5cf6"
                                  : "#ef4444",
                            }}
                            title={`Trạng thái: ${obj.status}`}
                          />
                          <span className="truncate text-xs">{obj.name}</span>
                        </div>

                        {/* Quick Control Actions */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          {/* Visibility Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleVisibility(obj.id);
                            }}
                            title={obj.visible ? "Ẩn đối tượng" : "Hiện đối tượng"}
                            className="p-1 hover:text-text-primary rounded"
                          >
                            {obj.visible ? (
                              <Eye className="w-3 h-3 text-text-secondary" />
                            ) : (
                              <EyeOff className="w-3 h-3 text-text-secondary/40" />
                            )}
                          </button>

                          {/* Lock Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLock(obj.id);
                            }}
                            title={obj.locked ? "Mở khóa di chuyển" : "Khóa vị trí"}
                            className="p-1 hover:text-text-primary rounded"
                          >
                            {obj.locked ? (
                              <Lock className="w-3 h-3 text-warning" />
                            ) : (
                              <Unlock className="w-3 h-3 text-text-secondary/30 group-hover:text-text-secondary" />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
