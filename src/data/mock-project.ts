import { ProjectInfo, RoomInfo } from "@/types/equipment";

export const MOCK_PROJECT: ProjectInfo = {
  id: "project-abc-building",
  name: "ABC Building",
  customer: "ABC Corporation",
  location: "TP. Hồ Chí Minh",
  status: "surveying",
  updatedAt: "10:30 AM",
};

export const MOCK_ROOM: RoomInfo = {
  id: "meeting-room-501",
  name: "Meeting Room 501",
  type: "meeting-room",
  dimensions: {
    width: 8,   // X axis (meters)
    length: 12, // Z axis (meters)
    height: 3.2 // Y axis (meters)
  },
};

export const MOCK_PROJECTS_LIST: ProjectInfo[] = [
  MOCK_PROJECT,
  {
    id: "project-keangnam-72",
    name: "Keangnam Landmark 72",
    customer: "Keangnam Vina",
    location: "Hà Nội",
    status: "planning",
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
    status: "surveying",
    updatedAt: "08:45 AM",
  },
];

export const MOCK_ROOMS_LIST: Record<string, RoomInfo[]> = {
  "project-abc-building": [
    MOCK_ROOM,
    {
      id: "executive-boardroom-802",
      name: "Executive Boardroom 802",
      type: "boardroom",
      dimensions: { width: 10, length: 15, height: 3.5 },
    },
    {
      id: "huddle-room-201",
      name: "Huddle Space 201",
      type: "huddle",
      dimensions: { width: 4, length: 5, height: 2.8 },
    },
  ],
  "project-keangnam-72": [
    {
      id: "auditorium-hall-a",
      name: "Auditorium Hall A",
      type: "auditorium",
      dimensions: { width: 15, length: 25, height: 6.0 },
    },
    {
      id: "video-conf-1204",
      name: "Video Conference 1204",
      type: "meeting-room",
      dimensions: { width: 6, length: 9, height: 3.0 },
    },
  ],
  "project-bitexco": [
    {
      id: "townhall-main",
      name: "Townhall Main Area",
      type: "townhall",
      dimensions: { width: 14, length: 20, height: 4.5 },
    },
    {
      id: "training-room-302",
      name: "Training Room 302",
      type: "training",
      dimensions: { width: 8, length: 10, height: 3.2 },
    },
  ],
  "project-vietcombank": [
    {
      id: "vip-lounge-room",
      name: "VIP Lounge Meeting",
      type: "vip",
      dimensions: { width: 7, length: 9, height: 3.2 },
    },
  ],
};

