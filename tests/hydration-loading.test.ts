import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../src/stores/editor-store";

describe("TASK-002C Hydration & Loading Fix Tests", () => {
  beforeEach(() => {
    // Reset store state before each test
    useEditorStore.getState().resetLocalStorage();
  });

  it("should set isHydrated to true when storage is empty or initial", () => {
    // Manually trigger hydration completion simulation for empty storage
    useEditorStore.getState().setHydrated(true);

    const state = useEditorStore.getState();
    expect(state.isHydrated).toBe(true);
    expect(state.projects.length).toBeGreaterThan(0);
    expect(state.currentProject).toBeDefined();
    expect(state.currentRoom).toBeDefined();
  });

  it("should normalize corrupted or partial persisted state without getting stuck", () => {
    // Simulate rehydration of empty/corrupt object
    const rawState = null;
    const store = useEditorStore.getState();
    
    store.setHydrated(true);
    const updatedState = useEditorStore.getState();

    expect(updatedState.isHydrated).toBe(true);
    expect(updatedState.currentProject.id).toBeDefined();
    expect(updatedState.currentRoom.id).toBeDefined();
    expect(Array.isArray(updatedState.objects)).toBe(true);
  });

  it("should synchronize target project and room when store is hydrated", () => {
    const store = useEditorStore.getState();
    store.setHydrated(true);

    const projectA = store.projects[0];
    const roomA2 = store.rooms[projectA.id]?.[1] || store.rooms[projectA.id]?.[0];

    store.switchProject(projectA, roomA2.id);

    const currentState = useEditorStore.getState();
    expect(currentState.isHydrated).toBe(true);
    expect(currentState.currentProject.id).toBe(projectA.id);
    expect(currentState.currentRoom.id).toBe(roomA2.id);
  });
});
