import { ObjectCategory, ObjectStatus } from "./editor";

export interface EquipmentItem {
  id: string;
  name: string;
  category: ObjectCategory;
  subcategory: string;
  brand: string;
  model: string;
  iconName: string;
  defaultDimensions: {
    width: number;
    height: number;
    depth: number;
  };
  defaultColor: string;
  defaultStatus: ObjectStatus;
  metadata?: Record<string, unknown>;
}

export interface InfrastructureItem {
  id: string;
  objectId?: string;
  type: "LAN" | "PWR" | "HDMI" | "AUDIO" | "OTHER";
  code: string;
  name: string;
  location: string;
  description: string;
  status: ObjectStatus;
  position: [number, number, number];
}

export interface ProjectInfo {
  id: string;
  name: string;
  customer: string;
  location: string;
  status: "surveying" | "planning" | "approved" | "completed";
  updatedAt: string;
}

export interface RoomInfo {
  id: string;
  name: string;
  type: string;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
}
