import { SceneObject } from "@/types/editor";
import { ProjectInfo, RoomInfo } from "@/types/equipment";

/**
 * Deep clones an object to prevent shared state references.
 */
export function deepClone<T>(obj: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generates initial 3D architectural scene objects for a room based on dimensions.
 * Width = X axis (meters)
 * Length = Z axis (meters)
 * Height = Y axis (meters)
 */
export function createArchitecturalScene(dimensions?: {
  width: number;
  length: number;
  height: number;
}): SceneObject[] {
  const W = Math.max(2, Number(dimensions?.width) || 8);
  const L = Math.max(2, Number(dimensions?.length) || 10);
  const H = Math.max(2, Number(dimensions?.height) || 3.2);

  return [
    {
      id: "arch-floor",
      name: `Room Floor (${W}m x ${L}m)`,
      type: "Floor",
      category: "architecture",
      status: "existing",
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      dimensions: { width: W, height: 0.1, depth: L },
      visible: true,
      locked: true,
      color: "#1e293b",
    },
    {
      id: "arch-wall-front",
      name: "Front Wall",
      type: "Wall",
      category: "architecture",
      status: "existing",
      position: [0, H / 2, -L / 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      dimensions: { width: W, height: H, depth: 0.2 },
      visible: true,
      locked: true,
      color: "#0f172a",
    },
    {
      id: "arch-wall-back",
      name: "Back Wall",
      type: "Wall",
      category: "architecture",
      status: "existing",
      position: [0, H / 2, L / 2],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      dimensions: { width: W, height: H, depth: 0.2 },
      visible: true,
      locked: true,
      color: "#0f172a",
    },
    {
      id: "arch-wall-left",
      name: "Left Wall",
      type: "Wall",
      category: "architecture",
      status: "existing",
      position: [-W / 2, H / 2, 0],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      dimensions: { width: L, height: H, depth: 0.2 },
      visible: true,
      locked: true,
      color: "#0f172a",
    },
    {
      id: "arch-wall-right",
      name: "Right Wall",
      type: "Wall",
      category: "architecture",
      status: "existing",
      position: [W / 2, H / 2, 0],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      dimensions: { width: L, height: H, depth: 0.2 },
      visible: true,
      locked: true,
      color: "#0f172a",
    },
    {
      id: "arch-door-main",
      name: "Entrance Door",
      type: "Door",
      category: "architecture",
      status: "existing",
      position: [-W / 2 + 0.2, Math.min(1.1, H / 2), Math.max(-L / 2 + 1, L / 2 - 1.5)],
      rotation: [0, Math.PI / 2, 0],
      scale: [1, 1, 1],
      dimensions: { width: 1.0, height: Math.min(2.2, H - 0.2), depth: 0.1 },
      visible: true,
      locked: true,
      color: "#334155",
    },
  ];
}

/**
 * Updates architectural objects (Floor, 4 Walls, Door) in an existing scene
 * to match new room dimensions without losing equipment objects.
 */
export function updateArchitecturalObjects(
  objects: SceneObject[],
  dimensions: { width: number; length: number; height: number }
): SceneObject[] {
  const { width: W, length: L, height: H } = dimensions;

  // Track which arch objects exist
  const archIdsFound = new Set<string>();

  const updatedObjects = objects.map((obj) => {
    const isFloor = obj.id === "arch-floor" || obj.type === "Floor";
    const isFrontWall =
      obj.id === "arch-wall-front" ||
      (obj.type === "Wall" && (obj.id.includes("front") || obj.name.toLowerCase().includes("front")));
    const isBackWall =
      obj.id === "arch-wall-back" ||
      (obj.type === "Wall" && (obj.id.includes("back") || obj.name.toLowerCase().includes("back")));
    const isLeftWall =
      obj.id === "arch-wall-left" ||
      (obj.type === "Wall" && (obj.id.includes("left") || obj.name.toLowerCase().includes("left")));
    const isRightWall =
      obj.id === "arch-wall-right" ||
      (obj.type === "Wall" && (obj.id.includes("right") || obj.name.toLowerCase().includes("right")));
    const isDoor = obj.id === "arch-door-main" || obj.type === "Door";

    if (isFloor) {
      archIdsFound.add("arch-floor");
      return {
        ...obj,
        name: `Room Floor (${W}m x ${L}m)`,
        position: [0, 0, 0] as [number, number, number],
        dimensions: { width: W, height: 0.1, depth: L },
      };
    }

    if (isFrontWall) {
      archIdsFound.add("arch-wall-front");
      return {
        ...obj,
        position: [0, H / 2, -L / 2] as [number, number, number],
        dimensions: { width: W, height: H, depth: 0.2 },
      };
    }

    if (isBackWall) {
      archIdsFound.add("arch-wall-back");
      return {
        ...obj,
        position: [0, H / 2, L / 2] as [number, number, number],
        dimensions: { width: W, height: H, depth: 0.2 },
      };
    }

    if (isLeftWall) {
      archIdsFound.add("arch-wall-left");
      return {
        ...obj,
        position: [-W / 2, H / 2, 0] as [number, number, number],
        dimensions: { width: L, height: H, depth: 0.2 },
      };
    }

    if (isRightWall) {
      archIdsFound.add("arch-wall-right");
      return {
        ...obj,
        position: [W / 2, H / 2, 0] as [number, number, number],
        dimensions: { width: L, height: H, depth: 0.2 },
      };
    }

    if (isDoor) {
      archIdsFound.add("arch-door-main");
      return {
        ...obj,
        position: [-W / 2 + 0.2, Math.min(1.1, H / 2), Math.max(-L / 2 + 1, L / 2 - 1.5)] as [number, number, number],
        dimensions: { width: 1.0, height: Math.min(2.2, H - 0.2), depth: 0.1 },
      };
    }

    return obj;
  });

  // If any standard architectural element is missing from scene, append it
  const fullArchScene = createArchitecturalScene(dimensions);
  fullArchScene.forEach((archObj) => {
    if (!archIdsFound.has(archObj.id)) {
      updatedObjects.push(archObj);
    }
  });

  return updatedObjects;
}

/**
 * Factory for creating a default room with safe architectural 3D scene.
 */
export function createDefaultRoom(
  projectId: string,
  name = "Phòng họp chính",
  dimensions = { width: 8, length: 10, height: 3.2 }
): RoomInfo {
  const roomId = `room-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  return {
    id: roomId,
    projectId,
    name,
    type: "meeting-room",
    dimensions,
    sceneObjects: createArchitecturalScene(dimensions),
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Factory for creating a new project along with its default room.
 */
export function createNewProject(data: {
  name: string;
  customer?: string;
  location?: string;
}): { project: ProjectInfo; room: RoomInfo } {
  const projectId = `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const nowStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const project: ProjectInfo = {
    id: projectId,
    name: data.name.trim(),
    customer: data.customer?.trim() || "Khách hàng mới",
    location: data.location?.trim() || "Việt Nam",
    status: "survey",
    createdAt: new Date().toISOString(),
    updatedAt: nowStr,
  };

  const room = createDefaultRoom(projectId, "Phòng họp chính");

  return { project, room };
}
