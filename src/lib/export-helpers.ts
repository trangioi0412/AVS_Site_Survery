import { SceneObject } from "@/types/editor";
import { ProjectInfo, RoomInfo } from "@/types/equipment";

export interface SceneExportPayload {
  version: number;
  exportedAt: string;
  project: {
    id: string;
    name: string;
    customer?: string;
    status?: string;
  };
  room: {
    id: string;
    projectId: string;
    name: string;
    type?: string;
    dimensions: {
      width: number;
      length: number;
      height: number;
    };
  };
  scene: {
    objects: SceneObject[];
  };
}

/**
 * Sanitizes a string for safe filename usage.
 */
function sanitizeFilename(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove Vietnamese diacritics
    .replace(/[^a-z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function exportSceneToJson(
  objects: SceneObject[],
  project: ProjectInfo | { id: string; name: string; customer?: string; status?: string },
  room: RoomInfo | { id: string; projectId: string; name: string; type?: string; dimensions: { width: number; length: number; height: number } }
) {
  const cleanObjects = objects.map((obj) => ({
    id: obj.id,
    name: obj.name,
    type: obj.type,
    category: obj.category,
    brand: obj.brand,
    model: obj.model,
    status: obj.status,
    position: obj.position,
    rotation: obj.rotation,
    scale: obj.scale,
    dimensions: obj.dimensions,
    visible: obj.visible,
    locked: obj.locked,
    color: obj.color,
    metadata: obj.metadata,
  }));

  const payload: SceneExportPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    project: {
      id: project.id,
      name: project.name,
      customer: project.customer,
      status: project.status,
    },
    room: {
      id: room.id,
      projectId: room.projectId,
      name: room.name,
      type: room.type,
      dimensions: {
        width: room.dimensions.width,
        length: room.dimensions.length,
        height: room.dimensions.height,
      },
    },
    scene: {
      objects: cleanObjects,
    },
  };

  const safeProj = sanitizeFilename(project.name || "project");
  const safeRoom = sanitizeFilename(room.name || "room");
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const fileName = `${safeProj}_${safeRoom}_scene_${dateStr}.json`;

  if (typeof document !== "undefined" && typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  }
}

export function generateBOMReport(objects: SceneObject[]) {
  const avObjects = objects.filter((o) => o.category !== "architecture" && o.category !== "furniture");
  const bomList = avObjects.map((obj) => ({
    Name: obj.name,
    Category: obj.category.toUpperCase(),
    Brand: obj.brand || "Generic",
    Model: obj.model || "N/A",
    Status: obj.status.toUpperCase(),
    Position: `[${obj.position.map((n) => n.toFixed(2)).join(", ")}]`,
  }));
  return bomList;
}

export function exportBomToCsv(objects: SceneObject[], projectName: string, roomName: string) {
  const bomData = generateBOMReport(objects);
  const headers = ["STT", "Tên thiết bị", "Phân loại", "Thương hiệu", "Model", "Trạng thái", "Tọa độ X/Y/Z"];
  
  const rows = bomData.map((item, idx) => [
    idx + 1,
    `"${item.Name}"`,
    `"${item.Category}"`,
    `"${item.Brand}"`,
    `"${item.Model}"`,
    `"${item.Status}"`,
    `"${item.Position}"`,
  ]);

  const csvContent =
    "\uFEFF" + // UTF-8 BOM byte order mark for Excel compatibility
    `BÁO CÁO DANH SÁCH THIẾT BỊ (BOM) - DỰ ÁN: ${projectName.toUpperCase()} - PHÒNG: ${roomName.toUpperCase()}\n\n` +
    [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  if (typeof document !== "undefined" && typeof URL !== "undefined" && typeof URL.createObjectURL === "function") {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    const safeProj = sanitizeFilename(projectName);
    const safeRoom = sanitizeFilename(roomName);
    downloadAnchor.setAttribute(
      "download",
      `BOM_${safeProj}_${safeRoom}.csv`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  }
}
