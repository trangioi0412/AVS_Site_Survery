import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../src/stores/editor-store";
import { createArchitecturalScene } from "../src/lib/scene-factory";

describe("Zustand Editor Store - TASK-001B Isolation & Persistence Tests", () => {
  beforeEach(() => {
    // Reset store state before each test
    useEditorStore.getState().resetLocalStorage();
  });

  it("should create a new project with a clean default room and architectural scene", () => {
    const store = useEditorStore.getState();

    store.createProject({
      name: "Tòa nhà Bitexco P2",
      customer: "Tập đoàn ABC",
      location: "TP.HCM",
    });

    const state = useEditorStore.getState();
    expect(state.currentProject.name).toBe("Tòa nhà Bitexco P2");
    expect(state.currentRoom.name).toBe("Phòng họp chính");

    // Check that scene has architecture objects but NO sample devices from other project
    const objects = state.objects;
    const hasArchitecture = objects.some((o) => o.category === "architecture");
    const hasSampleDisplay = objects.some((o) => o.id === "av-main-display");

    expect(hasArchitecture).toBe(true);
    expect(hasSampleDisplay).toBe(false);
  });

  it("should ensure scene objects are independent and NOT shared references between rooms", () => {
    const store = useEditorStore.getState();

    const proj = store.projects[0]; // ABC Building
    const rooms = store.rooms[proj.id];
    expect(rooms.length).toBeGreaterThan(1);

    const roomA = rooms[0];
    const roomB = rooms[1];

    // Switch to room A and add an object
    store.switchRoom(roomA);
    const testObjId = "test-camera-unit-1";
    store.addObject({
      id: testObjId,
      name: "Test PTZ Cam",
      type: "PTZ Camera",
      category: "camera",
      status: "proposed",
      position: [0, 2, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      locked: false,
    });

    // Switch to room B
    store.switchRoom(roomB);

    // Verify room B does NOT contain testObjId
    const roomBObjects = useEditorStore.getState().objects;
    const foundInRoomB = roomBObjects.some((o) => o.id === testObjId);
    expect(foundInRoomB).toBe(false);

    // Switch back to room A and verify testObjId is present
    store.switchRoom(roomA);
    const roomAObjects = useEditorStore.getState().objects;
    const foundInRoomA = roomAObjects.some((o) => o.id === testObjId);
    expect(foundInRoomA).toBe(true);
  });

  it("should reset selectedObjectId and history when switching rooms or projects", () => {
    const store = useEditorStore.getState();

    store.selectObject("arch-floor");
    expect(useEditorStore.getState().selectedObjectId).toBe("arch-floor");

    const proj = store.projects[0];
    const rooms = store.rooms[proj.id];

    // Switch room
    store.switchRoom(rooms[1]);

    expect(useEditorStore.getState().selectedObjectId).toBeNull();
    expect(useEditorStore.getState().historyIndex).toBe(0);
  });

  it("should dynamically calculate architectural walls when room dimensions change", () => {
    const store = useEditorStore.getState();

    store.updateRoomDimensions({ width: 12, length: 18, height: 4.0 });

    const state = useEditorStore.getState();
    expect(state.currentRoom.dimensions).toEqual({ width: 12, length: 18, height: 4.0 });

    const floor = state.objects.find((o) => o.type === "Floor");
    expect(floor?.dimensions?.width).toBe(12);
    expect(floor?.dimensions?.depth).toBe(18);

    const frontWall = state.objects.find((o) => o.id === "arch-wall-front" || o.name.includes("Front"));
    expect(frontWall?.dimensions?.width).toBe(12);
    expect(frontWall?.position[2]).toBe(-9); // -L/2 = -18/2
  });

  it("should fall back safely when data is corrupt or missing room dimensions", () => {
    const store = useEditorStore.getState();
    const mockCorruptRoom = {
      id: "corrupt-room",
      projectId: "project-abc-building",
      name: "Corrupt Room",
      type: "meeting",
      // missing dimensions & sceneObjects
    };

    store.switchRoom(mockCorruptRoom as any);

    const state = useEditorStore.getState();
    expect(state.currentRoom.dimensions.width).toBeGreaterThan(0);
    expect(state.objects.length).toBeGreaterThan(0);
  });
});
