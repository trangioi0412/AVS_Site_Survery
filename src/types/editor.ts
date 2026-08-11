export type EditorMode =
  | "select"
  | "translate"
  | "rotate"
  | "scale"
  | "measure"
  | "note";

export type ViewMode = "2d" | "3d";

export type ObjectStatus = "existing" | "proposed" | "remove" | "unknown";

export type ObjectCategory =
  | "architecture"
  | "furniture"
  | "display"
  | "camera"
  | "audio"
  | "microphone"
  | "rack"
  | "infrastructure"
  | "other";

export interface SceneObject {
  id: string;
  name: string;
  type: string;
  category: ObjectCategory;
  model?: string;
  brand?: string;
  status: ObjectStatus;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  visible: boolean;
  locked: boolean;
  color?: string;
  metadata?: {
    resolution?: string;
    zoom?: string;
    fov?: string;
    power?: string;
    poe?: boolean;
    network?: string;
    ipAddress?: string;
    connections?: string[];
    mountingHeight?: number;
    notes?: string;
    installationPosition?: string;
    [key: string]: unknown;
  };
}

export interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

export interface EditorSnapshot {
  objects: SceneObject[];
  dimensions: RoomDimensions;
}

export interface HistoryEntry {
  id: string;
  label: string;
  timestamp: number;
  snapshot: EditorSnapshot;
}

export interface HistoryTransaction {
  label: string;
  before: EditorSnapshot;
  wasDirty: boolean;
}
