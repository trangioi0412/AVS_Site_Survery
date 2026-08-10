import { ProjectInfo, RoomInfo } from "@/types/equipment";
import { INITIAL_SCENE_OBJECTS } from "./mock-scene";
import { createArchitecturalScene, deepClone } from "@/lib/scene-factory";

export const MOCK_PROJECT: ProjectInfo = {
  id: "project-abc-building",
  name: "ABC Building",
  customer: "ABC Corporation",
  location: "TP. Hồ Chí Minh",
  status: "survey",
  updatedAt: "10:30 AM",
};

export const MOCK_ROOM: RoomInfo = {
  id: "meeting-room-501",
  projectId: "project-abc-building",
  name: "Meeting Room 501",
  type: "meeting-room",
  dimensions: {
    width: 8,   // X axis (meters)
    length: 12, // Z axis (meters)
    height: 3.2, // Y axis (meters)
  },
  sceneObjects: deepClone(INITIAL_SCENE_OBJECTS),
};

export const MOCK_PROJECTS_LIST: ProjectInfo[] = [
  MOCK_PROJECT,
  {
    id: "project-keangnam-72",
    name: "Keangnam Landmark 72",
    customer: "Keangnam Vina",
    location: "Hà Nội",
    status: "drafting",
    updatedAt: "09:15 AM",
  },
  {
    id: "project-bitexco",
    name: "Bitexco Financial Tower",
    customer: "Bitexco Group",
    location: "TP. Hồ Chí Minh",
    status: "approved",
    updatedAt: "Hôm qua",
  },
  {
    id: "project-vietcombank",
    name: "Vietcombank Tower HQ",
    customer: "Vietcombank",
    location: "TP. Hồ Chí Minh",
    status: "survey",
    updatedAt: "08:45 AM",
  },
];

export const MOCK_ROOMS_LIST: Record<string, RoomInfo[]> = {
  "project-abc-building": [
    MOCK_ROOM,
    {
      id: "executive-boardroom-802",
      projectId: "project-abc-building",
      name: "Executive Boardroom 802",
      type: "boardroom",
      dimensions: { width: 10, length: 15, height: 3.5 },
      sceneObjects: createArchitecturalScene({ width: 10, length: 15, height: 3.5 }),
    },
    {
      id: "huddle-room-201",
      projectId: "project-abc-building",
      name: "Huddle Space 201",
      type: "huddle",
      dimensions: { width: 4, length: 5, height: 2.8 },
      sceneObjects: createArchitecturalScene({ width: 4, length: 5, height: 2.8 }),
    },
  ],
  "project-keangnam-72": [
    {
      id: "auditorium-hall-a",
      projectId: "project-keangnam-72",
      name: "Auditorium Hall A",
      type: "auditorium",
      dimensions: { width: 15, length: 25, height: 6.0 },
      sceneObjects: createArchitecturalScene({ width: 15, length: 25, height: 6.0 }),
    },
    {
      id: "video-conf-1204",
      projectId: "project-keangnam-72",
      name: "Video Conference 1204",
      type: "meeting-room",
      dimensions: { width: 6, length: 9, height: 3.0 },
      sceneObjects: createArchitecturalScene({ width: 6, length: 9, height: 3.0 }),
    },
  ],
  "project-bitexco": [
    {
      id: "townhall-main",
      projectId: "project-bitexco",
      name: "Townhall Main Area",
      type: "townhall",
      dimensions: { width: 14, length: 20, height: 4.5 },
      sceneObjects: createArchitecturalScene({ width: 14, length: 20, height: 4.5 }),
    },
    {
      id: "training-room-302",
      projectId: "project-bitexco",
      name: "Training Room 302",
      type: "training",
      dimensions: { width: 8, length: 10, height: 3.2 },
      sceneObjects: createArchitecturalScene({ width: 8, length: 10, height: 3.2 }),
    },
  ],
  "project-vietcombank": [
    {
      id: "vip-lounge-room",
      projectId: "project-vietcombank",
      name: "VIP Lounge Meeting",
      type: "vip",
      dimensions: { width: 7, length: 9, height: 3.2 },
      sceneObjects: createArchitecturalScene({ width: 7, length: 9, height: 3.2 }),
    },
  ],
};

/**
 * Returns deep copy of initial projects list to avoid mutation bugs.
 */
export function getInitialProjects(): ProjectInfo[] {
  return deepClone(MOCK_PROJECTS_LIST);
}

/**
 * Returns deep copy of initial rooms map to avoid mutation bugs.
 */
export function getInitialRoomsMap(): Record<string, RoomInfo[]> {
  return deepClone(MOCK_ROOMS_LIST);
}
