import { create } from "zustand";
import { EditorMode, SceneObject, ViewMode } from "@/types/editor";
import { ProjectInfo, RoomInfo } from "@/types/equipment";
import { INITIAL_SCENE_OBJECTS } from "@/data/mock-scene";
import { MOCK_PROJECT, MOCK_ROOM, MOCK_ROOMS_LIST } from "@/data/mock-project";

interface EditorState {
  // State
  currentProject: ProjectInfo;
  currentRoom: RoomInfo;
  isDirty: boolean;
  lastSavedAt: string;
  objects: SceneObject[];
  selectedObjectId: string | null;
  editorMode: EditorMode;
  viewMode: ViewMode;
  snapEnabled: boolean;
  gridSize: number;
  showGrid: boolean;
  showHelpers: boolean;
  sidebarCollapsed: boolean;
  history: SceneObject[][];
  historyIndex: number;

  // Actions
  selectObject: (id: string | null) => void;
  addObject: (object: SceneObject) => void;
  updateObject: (id: string, changes: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;
  setEditorMode: (mode: EditorMode) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  toggleSnap: () => void;
  setGridSize: (size: number) => void;
  toggleGrid: () => void;
  toggleHelpers: () => void;
  toggleSidebar: () => void;
  switchProject: (project: ProjectInfo) => void;
  switchRoom: (room: RoomInfo) => void;
  updateRoomDimensions: (dims: { width: number; length: number; height: number }) => void;
  saveProject: () => void;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  currentProject: MOCK_PROJECT,
  currentRoom: MOCK_ROOM,
  isDirty: false,
  lastSavedAt: "10:30 AM",
  objects: INITIAL_SCENE_OBJECTS,
  selectedObjectId: "av-main-display",
  editorMode: "translate",
  viewMode: "3d",
  snapEnabled: true,
  gridSize: 1.0,
  showGrid: true,
  showHelpers: true,
  sidebarCollapsed: false,
  history: [INITIAL_SCENE_OBJECTS],
  historyIndex: 0,

  selectObject: (id) => set({ selectedObjectId: id }),

  addObject: (newObj) => {
    const { objects, history, historyIndex } = get();
    const updated = [...objects, newObj];
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);

    set({
      objects: updated,
      selectedObjectId: newObj.id,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  updateObject: (id, changes) => {
    set((state) => {
      const updated = state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...changes } : obj
      );
      return { objects: updated, isDirty: true };
    });
  },

  removeObject: (id) => {
    const { objects, history, historyIndex, selectedObjectId } = get();
    const updated = objects.filter((obj) => obj.id !== id);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(updated);

    set({
      objects: updated,
      selectedObjectId: selectedObjectId === id ? null : selectedObjectId,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      isDirty: true,
    });
  },

  setEditorMode: (mode) => set({ editorMode: mode }),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleVisibility: (id) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, visible: !obj.visible } : obj
      ),
      isDirty: true,
    }));
  },

  toggleLock: (id) => {
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, locked: !obj.locked } : obj
      ),
      isDirty: true,
    }));
  },

  toggleSnap: () => set((state) => ({ snapEnabled: !state.snapEnabled })),

  setGridSize: (size) =>
    set({ gridSize: Math.max(0.1, Math.min(5.0, Number(size.toFixed(1)))) }),

  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),

  toggleHelpers: () => set((state) => ({ showHelpers: !state.showHelpers })),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  switchProject: (project) => {
    const rooms = MOCK_ROOMS_LIST[project.id] || [MOCK_ROOM];
    set({
      currentProject: project,
      currentRoom: rooms[0],
      isDirty: false,
    });
  },

  switchRoom: (room) => {
    const { currentRoom, objects } = get();
    // Update floor and walls dimension in objects state according to room width & length
    const updatedObjects = objects.map((obj) => {
      if (obj.type === "Floor") {
        return {
          ...obj,
          dimensions: { width: room.dimensions.width, height: 0.1, depth: room.dimensions.length },
        };
      }
      return obj;
    });

    set({
      currentRoom: room,
      objects: updatedObjects,
      isDirty: false,
    });
  },

  updateRoomDimensions: (dims) => {
    set((state) => {
      const updatedRoom = {
        ...state.currentRoom,
        dimensions: dims,
      };

      const updatedObjects = state.objects.map((obj) => {
        if (obj.type === "Floor") {
          return {
            ...obj,
            dimensions: { width: dims.width, height: 0.1, depth: dims.length },
          };
        }
        return obj;
      });

      return {
        currentRoom: updatedRoom,
        objects: updatedObjects,
        isDirty: true,
      };
    });
  },

  saveProject: () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    set({
      isDirty: false,
      lastSavedAt: timeString,
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      set({
        objects: history[nextIndex],
        historyIndex: nextIndex,
        isDirty: true,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex - 1;
      set({
        objects: history[nextIndex],
        historyIndex: nextIndex,
        isDirty: true,
      });
    }
  },
}));

