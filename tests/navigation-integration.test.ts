import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../src/stores/editor-store";

describe("TASK-002B Integration Audit Tests", () => {
  beforeEach(() => {
    useEditorStore.getState().resetLocalStorage();
  });

  it("10.1 - Store should track hydration state and allow manual hydrated override", () => {
    const store = useEditorStore.getState();
    expect(typeof store.isHydrated).toBe("boolean");

    store.setHydrated(true);
    expect(useEditorStore.getState().isHydrated).toBe(true);
  });

  it("10.2 - Dynamic route room switching should load target room scene and objects cleanly", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];
    const projectRooms = store.rooms[proj.id];
    expect(projectRooms.length).toBeGreaterThan(1);

    const roomA = projectRooms[0];
    const roomB = projectRooms[1];

    // Switch to Room A
    store.switchRoom(roomA);
    const stateRoomA = useEditorStore.getState();
    expect(stateRoomA.currentRoom.id).toBe(roomA.id);
    expect(stateRoomA.currentRoom.dimensions).toEqual(roomA.dimensions);

    // Switch to Room B
    store.switchRoom(roomB);
    const stateRoomB = useEditorStore.getState();
    expect(stateRoomB.currentRoom.id).toBe(roomB.id);
    expect(stateRoomB.currentRoom.dimensions).toEqual(roomB.dimensions);
  });

  it("10.3 - Switching Project should maintain scene object isolation", () => {
    const store = useEditorStore.getState();
    
    // Create new project B
    store.createProject({
      name: "Dự án Tòa nhà Landmark 81",
      customer: "Tập đoàn Vingroup",
      location: "TP.HCM",
    });

    const projectB = useEditorStore.getState().currentProject;
    expect(projectB.name).toBe("Dự án Tòa nhà Landmark 81");

    // Add unique device to Project B
    const uniqueBObjId = "landmark-display-99";
    store.addObject({
      id: uniqueBObjId,
      name: "Landmark 98 Inch Display",
      type: "Display",
      category: "display",
      status: "proposed",
      position: [0, 1.5, -4],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      visible: true,
      locked: false,
    });

    // Switch back to original Project A
    const projectA = store.projects[0];
    store.switchProject(projectA);

    const objectsInProjectA = useEditorStore.getState().objects;
    const foundInA = objectsInProjectA.some((o) => o.id === uniqueBObjId);
    expect(foundInA).toBe(false);

    // Switch back to Project B
    store.switchProject(projectB);
    const objectsInProjectB = useEditorStore.getState().objects;
    const foundInB = objectsInProjectB.some((o) => o.id === uniqueBObjId);
    expect(foundInB).toBe(true);
  });

  it("10.4 - Fallback scene generation should persist fallback scene back into room", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];

    const emptyRoom = {
      id: "empty-room-test",
      projectId: proj.id,
      name: "Empty Test Room",
      type: "meeting",
      dimensions: { width: 10, length: 12, height: 3.5 },
      sceneObjects: [],
    };

    store.switchRoom(emptyRoom as any);

    const stateAfterSwitch = useEditorStore.getState();
    expect(stateAfterSwitch.objects.length).toBeGreaterThan(0);
    
    // Verify room scene is saved in rooms map
    const roomsMapList = stateAfterSwitch.rooms[proj.id];
    const savedRoom = roomsMapList.find((r) => r.id === emptyRoom.id);
    expect(savedRoom).toBeDefined();
    expect(savedRoom?.sceneObjects.length).toBeGreaterThan(0);
  });

  it("10.5 - Selection and transform gizmos reset when changing rooms", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];
    const projectRooms = store.rooms[proj.id];

    store.selectObject("arch-floor");
    expect(useEditorStore.getState().selectedObjectId).toBe("arch-floor");

    store.switchRoom(projectRooms[1]);
    expect(useEditorStore.getState().selectedObjectId).toBeNull();
  });
});
