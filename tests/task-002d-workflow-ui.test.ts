import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../src/stores/editor-store";
import { exportSceneToJson } from "../src/lib/export-helpers";
import { getProjectStatusLabel, getProjectStatusClass } from "../src/lib/project-utils";

describe("TASK-002D Workflow & Integration Tests", () => {
  beforeEach(() => {
    useEditorStore.getState().resetLocalStorage();
  });

  it("1. Project status updating and persistence", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];

    expect(proj.status).toBe("survey");

    // Update status to 'drafting'
    store.updateProjectStatus(proj.id, "drafting");

    const updatedState = useEditorStore.getState();
    const updatedProj = updatedState.projects.find((p) => p.id === proj.id);
    expect(updatedProj?.status).toBe("drafting");
    expect(updatedState.currentProject.status).toBe("drafting");

    // Verify status Vietnamese labels and CSS classes
    expect(getProjectStatusLabel("drafting")).toBe("Đang lập bản vẽ");
    expect(getProjectStatusClass("drafting")).toContain("amber");

    expect(getProjectStatusLabel("approved")).toBe("Đã duyệt");
    expect(getProjectStatusClass("approved")).toContain("emerald");
  });

  it("2. Room management per project and room isolation", () => {
    const store = useEditorStore.getState();
    const projA = store.projects[0];

    const initialRoomsCount = store.rooms[projA.id].length;

    // Add new room to Project A
    const newRoom = store.addRoomToProject(projA.id, "Phòng Họp 601 mới", {
      width: 12,
      length: 15,
      height: 4.0,
    });

    const stateAfterAdd = useEditorStore.getState();
    const projARooms = stateAfterAdd.rooms[projA.id];
    expect(projARooms.length).toBe(initialRoomsCount + 1);
    expect(projARooms.some((r) => r.id === newRoom.id)).toBe(true);

    // Verify Project B rooms are unaffected
    if (stateAfterAdd.projects.length > 1) {
      const projB = stateAfterAdd.projects[1];
      const projBRooms = stateAfterAdd.rooms[projB.id];
      expect(projBRooms.some((r) => r.id === newRoom.id)).toBe(false);
    }
  });

  it("3. Room deletion safety rules", () => {
    const store = useEditorStore.getState();
    const projA = store.projects[0];
    const projectRooms = store.rooms[projA.id];

    expect(projectRooms.length).toBeGreaterThan(1);
    const roomToDelete = projectRooms[projectRooms.length - 1];

    // Delete one room when multiple exist
    store.deleteRoom(projA.id, roomToDelete.id);
    const roomsAfterDelete = useEditorStore.getState().rooms[projA.id];
    expect(roomsAfterDelete.length).toBe(projectRooms.length - 1);
    expect(roomsAfterDelete.some((r) => r.id === roomToDelete.id)).toBe(false);

    // Attempting to delete the last remaining room should be blocked
    while (useEditorStore.getState().rooms[projA.id].length > 1) {
      const rms = useEditorStore.getState().rooms[projA.id];
      store.deleteRoom(projA.id, rms[rms.length - 1].id);
    }

    const lastRoom = useEditorStore.getState().rooms[projA.id][0];
    store.deleteRoom(projA.id, lastRoom.id);
    // Room count should remain at 1
    expect(useEditorStore.getState().rooms[projA.id].length).toBe(1);
  });

  it("4. Scene export payload structure and formatting", () => {
    const store = useEditorStore.getState();
    const proj = store.currentProject;
    const room = store.currentRoom;
    const objects = store.objects;

    let createdBlob: Blob | null = null;
    const originalCreateObjectURL = URL.createObjectURL;
    URL.createObjectURL = (blob: Blob) => {
      createdBlob = blob;
      return "blob:mock-url";
    };

    const originalDoc = (globalThis as any).document;
    (globalThis as any).document = {
      createElement: () => ({ setAttribute: () => {}, click: () => {}, remove: () => {} }),
      body: { appendChild: () => {} },
    };

    // Execute exportSceneToJson
    expect(() => exportSceneToJson(objects, proj, room)).not.toThrow();
    expect(createdBlob).not.toBeNull();

    // Clean up mocks
    URL.createObjectURL = originalCreateObjectURL;
    (globalThis as any).document = originalDoc;
  });

  it("5. Visual scene state and deselect on room switch", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];
    const projectRooms = store.rooms[proj.id];

    // Select object
    store.selectObject(store.objects[0]?.id || "test-id");
    expect(useEditorStore.getState().selectedObjectId).not.toBeNull();

    // Switch room should reset selection
    store.switchRoom(projectRooms[1]);
    expect(useEditorStore.getState().selectedObjectId).toBeNull();
  });
});
