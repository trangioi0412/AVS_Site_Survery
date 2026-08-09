import { SceneObject } from "@/types/editor";

export function exportSceneToJson(objects: SceneObject[], projectName: string) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(objects, null, 2));
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `${projectName.toLowerCase().replace(/\s+/g, "-")}-scene.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
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

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement("a");
  downloadAnchor.setAttribute("href", url);
  downloadAnchor.setAttribute(
    "download",
    `BOM_${projectName.toLowerCase().replace(/\s+/g, "_")}_${roomName.toLowerCase().replace(/\s+/g, "_")}.csv`
  );
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  URL.revokeObjectURL(url);
}

