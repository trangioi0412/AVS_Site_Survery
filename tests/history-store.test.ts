import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../src/stores/editor-store";
import { SceneObject } from "../src/types/editor";

describe("TASK-003A — Transactional Undo/Redo Foundation Tests", () => {
  beforeEach(() => {
    useEditorStore.getState().resetLocalStorage();
  });

  // --- 1. BASELINE TESTS ---
  describe("1. Baseline Lifecycle", () => {
    it("1.1. Store initialization creates exactly 1 baseline entry", () => {
      const state = useEditorStore.getState();
      expect(state.history.length).toBe(1);
      expect(state.historyIndex).toBe(0);
      expect(state.history[0].label).toBe("Initial Scene");
    });

    it("1.2. Reset localStorage creates a new clean baseline", () => {
      const store = useEditorStore.getState();
      store.addObject({
        id: "temp-1",
        name: "Temp Obj",
        type: "Test",
        category: "other",
        status: "proposed",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      });
      expect(useEditorStore.getState().history.length).toBe(2);

      useEditorStore.getState().resetLocalStorage();
      const state = useEditorStore.getState();
      expect(state.history.length).toBe(1);
      expect(state.historyIndex).toBe(0);
      expect(state.objects.some((o) => o.id === "temp-1")).toBe(false);
    });

    it("1.3. Switch Room resets history to a single baseline for target room", () => {
      const store = useEditorStore.getState();
      const proj = store.projects[0];
      const rooms = store.rooms[proj.id];
      expect(rooms.length).toBeGreaterThan(1);

      store.addObject({
        id: "room-a-obj",
        name: "Room A Obj",
        type: "Test",
        category: "other",
        status: "proposed",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      });
      expect(useEditorStore.getState().history.length).toBe(2);

      store.switchRoom(rooms[1]);
      const state = useEditorStore.getState();
      expect(state.history.length).toBe(1);
      expect(state.historyIndex).toBe(0);
      expect(state.selectedObjectId).toBeNull();
    });

    it("1.4. Switch Project resets history to a single baseline for target project", () => {
      const store = useEditorStore.getState();
      const initialProjId = store.currentProject.id;
      store.addObject({
        id: "proj-a-obj",
        name: "Proj A Obj",
        type: "Test",
        category: "other",
        status: "proposed",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      });

      store.createProject({ name: "Project B" });
      const state = useEditorStore.getState();
      expect(state.currentProject.id).not.toBe(initialProjId);
      expect(state.history.length).toBe(1);
      expect(state.historyIndex).toBe(0);
    });
  });

  // --- 2. ADD / DELETE TESTS ---
  describe("2. Add & Delete Operations", () => {
    it("2.1. Add Object creates 1 entry and Undo/Redo works correctly", () => {
      const store = useEditorStore.getState();
      const newObj: SceneObject = {
        id: "cam-unit-101",
        name: "PTZ Camera 4K",
        type: "Camera",
        category: "camera",
        status: "proposed",
        position: [1, 2, 3],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      };

      store.addObject(newObj);
      let state = useEditorStore.getState();
      expect(state.history.length).toBe(2);
      expect(state.objects.some((o) => o.id === "cam-unit-101")).toBe(true);
      expect(state.selectedObjectId).toBe("cam-unit-101");

      // Undo
      store.undo();
      state = useEditorStore.getState();
      expect(state.objects.some((o) => o.id === "cam-unit-101")).toBe(false);
      expect(state.selectedObjectId).toBeNull();

      // Redo
      store.redo();
      state = useEditorStore.getState();
      expect(state.objects.some((o) => o.id === "cam-unit-101")).toBe(true);
    });

    it("2.2. Delete Object creates 1 entry and Undo restores object", () => {
      const store = useEditorStore.getState();
      const firstObj = store.objects[0];
      expect(firstObj).toBeDefined();

      store.removeObject(firstObj.id);
      let state = useEditorStore.getState();
      expect(state.objects.some((o) => o.id === firstObj.id)).toBe(false);

      // Undo delete
      store.undo();
      state = useEditorStore.getState();
      expect(state.objects.some((o) => o.id === firstObj.id)).toBe(true);
    });
  });

  // --- 3. TRANSACTION TESTS ---
  describe("3. Transaction API", () => {
    it("3.1. Begin -> multiple updateObject calls -> Commit creates only 1 entry", () => {
      const store = useEditorStore.getState();
      const targetObj = store.objects[0];

      store.beginHistoryTransaction(`Move object: ${targetObj.name}`);
      store.updateObject(targetObj.id, { position: [1, 0, 0] });
      store.updateObject(targetObj.id, { position: [2, 0, 0] });
      store.updateObject(targetObj.id, { position: [3, 0, 0] });
      store.commitHistoryTransaction();

      const state = useEditorStore.getState();
      expect(state.history.length).toBe(2);
      expect(state.history[1].label).toBe(`Move object: ${targetObj.name}`);
      expect(state.objects.find((o) => o.id === targetObj.id)?.position).toEqual([3, 0, 0]);

      // Undo restores initial position before drag
      store.undo();
      expect(useEditorStore.getState().objects.find((o) => o.id === targetObj.id)?.position).toEqual(targetObj.position);
    });

    it("3.2. Transaction without data changes does NOT create a history entry", () => {
      const store = useEditorStore.getState();
      const targetObj = store.objects[0];

      store.beginHistoryTransaction("No-op Transaction");
      store.updateObject(targetObj.id, { name: targetObj.name });
      store.commitHistoryTransaction();

      expect(useEditorStore.getState().history.length).toBe(1);
    });

    it("3.3. Cancel transaction discards uncommitted changes when restore option is true", () => {
      const store = useEditorStore.getState();
      const targetObj = store.objects[0];
      const initialPos = [...targetObj.position];

      store.beginHistoryTransaction("Cancelled Drag");
      store.updateObject(targetObj.id, { position: [99, 99, 99] });
      store.cancelHistoryTransaction({ restore: true });

      const state = useEditorStore.getState();
      expect(state.history.length).toBe(1);
      expect(state.activeHistoryTransaction).toBeNull();
      expect(state.objects.find((o) => o.id === targetObj.id)?.position).toEqual(initialPos);
    });
  });

  // --- 4. TRANSFORM & PROPERTIES TESTS ---
  describe("4. Transform & Properties Editing", () => {
    it("4.1. Status change creates 1 history entry", () => {
      const store = useEditorStore.getState();
      const targetObj = store.objects[0];

      store.updateObjectWithHistory(targetObj.id, { status: "proposed" }, "Change status");
      const state = useEditorStore.getState();
      expect(state.history.length).toBe(2);
      expect(state.objects.find((o) => o.id === targetObj.id)?.status).toBe("proposed");

      store.undo();
      expect(useEditorStore.getState().objects.find((o) => o.id === targetObj.id)?.status).toBe(targetObj.status);
    });

    it("4.2. Visibility toggle creates 1 history entry", () => {
      const store = useEditorStore.getState();
      const targetObj = store.objects[0];
      const initialVis = targetObj.visible;

      store.toggleVisibility(targetObj.id);
      expect(useEditorStore.getState().objects.find((o) => o.id === targetObj.id)?.visible).toBe(!initialVis);
      expect(useEditorStore.getState().history.length).toBe(2);

      store.undo();
      expect(useEditorStore.getState().objects.find((o) => o.id === targetObj.id)?.visible).toBe(initialVis);
    });

    it("4.3. Lock toggle creates 1 history entry", () => {
      const store = useEditorStore.getState();
      const targetObj = store.objects[0];
      const initialLocked = targetObj.locked;

      store.toggleLock(targetObj.id);
      expect(useEditorStore.getState().objects.find((o) => o.id === targetObj.id)?.locked).toBe(!initialLocked);
      expect(useEditorStore.getState().history.length).toBe(2);

      store.undo();
      expect(useEditorStore.getState().objects.find((o) => o.id === targetObj.id)?.locked).toBe(initialLocked);
    });
  });

  // --- 5. ROOM DIMENSIONS TESTS ---
  describe("5. Room Dimensions Undo/Redo", () => {
    it("5.1. Update room dimensions creates history and Undo restores old dimensions & 4 walls", () => {
      const store = useEditorStore.getState();
      const oldDims = { ...store.currentRoom.dimensions };

      store.updateRoomDimensions({ width: 14, length: 20, height: 4.5 });
      let state = useEditorStore.getState();
      expect(state.history.length).toBe(2);
      expect(state.currentRoom.dimensions).toEqual({ width: 14, length: 20, height: 4.5 });

      const floor = state.objects.find((o) => o.type === "Floor");
      expect(floor?.dimensions?.width).toBe(14);
      expect(floor?.dimensions?.depth).toBe(20);

      // Undo dimensions
      store.undo();
      state = useEditorStore.getState();
      expect(state.currentRoom.dimensions).toEqual(oldDims);
      const restoredFloor = state.objects.find((o) => o.type === "Floor");
      expect(restoredFloor?.dimensions?.width).toBe(oldDims.width);
      expect(restoredFloor?.dimensions?.depth).toBe(oldDims.length);
    });
  });

  // --- 6. REDO BRANCH & LIMIT TESTS ---
  describe("6. Redo Branch & Limit Safety", () => {
    it("6.1. New action after Undo truncates the Redo branch", () => {
      const store = useEditorStore.getState();

      store.addObject({
        id: "obj-1",
        name: "Obj 1",
        type: "Test",
        category: "other",
        status: "proposed",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      });
      store.addObject({
        id: "obj-2",
        name: "Obj 2",
        type: "Test",
        category: "other",
        status: "proposed",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      });
      expect(useEditorStore.getState().history.length).toBe(3);

      // Undo back to Obj 1
      store.undo();
      expect(useEditorStore.getState().historyIndex).toBe(1);

      // Add Obj 3 (should slice Redo branch Obj 2)
      store.addObject({
        id: "obj-3",
        name: "Obj 3",
        type: "Test",
        category: "other",
        status: "proposed",
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        visible: true,
        locked: false,
      });

      const state = useEditorStore.getState();
      expect(state.history.length).toBe(3);
      expect(state.historyIndex).toBe(2);
      expect(state.objects.some((o) => o.id === "obj-2")).toBe(false);
      expect(state.objects.some((o) => o.id === "obj-3")).toBe(true);
    });

    it("6.2. History entries do not exceed MAX_HISTORY_ENTRIES (100)", () => {
      const store = useEditorStore.getState();
      for (let i = 0; i < 120; i++) {
        store.addObject({
          id: `batch-obj-${i}`,
          name: `Batch Obj ${i}`,
          type: "Test",
          category: "other",
          status: "proposed",
          position: [i, 0, 0],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
          visible: true,
          locked: false,
        });
      }

      const state = useEditorStore.getState();
      expect(state.history.length).toBeLessThanOrEqual(100);
      expect(state.historyIndex).toBe(state.history.length - 1);
    });
  });
});
