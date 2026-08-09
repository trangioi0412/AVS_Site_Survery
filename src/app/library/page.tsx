"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/app-shell/app-layout";
import { MOCK_EQUIPMENT_LIBRARY } from "@/data/mock-equipment";
import { Library, Search, Box, CheckCircle2, Clock } from "lucide-react";

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");

  const brands = Array.from(new Set(MOCK_EQUIPMENT_LIBRARY.map((item) => item.brand)));

  const filteredAssets = MOCK_EQUIPMENT_LIBRARY.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = selectedBrand === "all" || item.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b border-border/80 pb-4">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Library className="w-5 h-5" />
            <span>Thư Viện Asset Mô Hình 3D</span>
          </div>
          <h1 className="text-xl font-bold text-text-primary mt-1">
            Kho Mô Hình & Bản Vẽ Thiết Bị AV ({MOCK_EQUIPMENT_LIBRARY.length})
          </h1>
        </div>

        {/* Search & Brand Filter */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-surface-1 p-3 rounded-lg border border-border">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mô hình asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-text-primary focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-text-secondary">Hãng sản xuất:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-surface-2 border border-border rounded-md px-3 py-1.5 text-text-primary focus:outline-none"
            >
              <option value="all">Tất cả hãng ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset, idx) => {
            const has3DModel = idx % 2 === 0; // Demonstration status indicator

            return (
              <div
                key={asset.id}
                className="bg-surface-1 border border-border rounded-xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-text-primary truncate">{asset.name}</span>
                    <span className="text-[10px] bg-surface-3 px-2 py-0.5 rounded text-text-secondary font-mono border border-border/40 uppercase">
                      {asset.category}
                    </span>
                  </div>

                  <div className="text-xs text-text-secondary space-y-0.5">
                    <p>Hãng: <strong className="text-text-primary">{asset.brand}</strong></p>
                    <p>Model: <strong className="text-primary font-mono">{asset.model}</strong></p>
                  </div>

                  <div className="p-2.5 bg-surface-2 rounded border border-border/40 text-xs flex items-center justify-between">
                    <span className="text-text-secondary">Trạng thái 3D Model:</span>
                    {has3DModel ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Mesh Procedural
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        GLTF Loader (TASK-004)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
