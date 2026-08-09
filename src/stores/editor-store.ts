import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EditorMode, SceneObject, ViewMode } from "@/types/editor";
import { ProjectInfo, RoomInfo } from "@/types/equipment";
import {
  getInitialProjects,
  getInitialRoomsMap,
  MOCK_PROJECT,
  MOCK_ROOM,
} from "@/data/mock-project";
import {
  createArchitecturalScene,
  createNewProject,
  createDefaultRoom,
  deepClone,
  updateArchitecturalObjects,
} from "@/lib/scene-factory";

interface EditorState {
  // State
  projects: ProjectInfo[];
  rooms: Record<string, RoomInfo[]>;
  currentProject: ProjectInfo;
  currentRoom: RoomInfo;
  objects: SceneObject[];
  isDirty: boolean;
  lastSavedAt: string;
  isHydrated: boolean;

  // UI State
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
  setHydrated: (hydrated: boolean) => void;
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

  createProject: (data: { name: string; customer?: string; location?: string }) => void;
  switchProject: (project: ProjectInfo, targetRoomId?: string) => void;
  switchRoom: (room: RoomInfo) => void;
  updateRoomDimensions: (dims: { width: number; length: number; height: number }) => void;
  saveProject: () => void;
  initFromUrl: (projectId?: string | null, roomId?: string | null) => void;
  undo: () => void;
  redo: () => void;
}

/**
 * Helper to sync URL search params without triggering full page reload.
 */
function updateUrlParams(projectId: string, roomId: string) {
  if (typeof window === "undefined") return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set("project", projectId);
    url.searchParams.set("room", roomId);
    window.history.replaceState({}, "", url.toString());
  } catch {
    // Ignore URL errors in non-browser env
  }
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Default Initial States
      projects: getInitialProjects(),
      rooms: getInitialRoomsMap(),
      currentProject: MOCK_PROJECT,
      currentRoom: MOCK_ROOM,
      objects: deepClone(MOCK_ROOM.sceneObjects || []),
      isDirty: false,
      lastSavedAt: "10:30 AM",
      isHydrated: false,

      // UI States
      selectedObjectId: null,
      editorMode: "translate",
      viewMode: "3d",
      snapEnabled: true,
      gridSize: 1.0,
      showGrid: true,
      showHelpers: true,
      sidebarCollapsed: false,
      history: [deepClone(MOCK_ROOM.sceneObjects || [])],
      historyIndex: 0,

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      selectObject: (id) => set({ selectedObjectId: id }),

      addObject: (newObj) => {
        const { objects, history, historyIndex } = get();
        const updated = [...objects, newObj];
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(deepClone(updated));

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
        newHistory.push(deepClone(updated));

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

      // --- PROJECT & ROOM MANAGEMENT ---

      createProject: (data) => {
        const { saveProject, projects, rooms } = get();
        // Save current room first
        saveProject();

        const { project, room } = createNewProject(data);
        const updatedProjects = [...projects, project];
        const updatedRoomsMap = {
          ...rooms,
          [project.id]: [room],
        };

        const roomScene = deepClone(room.sceneObjects || []);

        set({
          projects: updatedProjects,
          rooms: updatedRoomsMap,
          currentProject: project,
          currentRoom: room,
          objects: roomScene,
          selectedObjectId: null,
          history: [roomScene],
          historyIndex: 0,
          isDirty: false,
        });

        updateUrlParams(project.id, room.id);
      },

      switchProject: (targetProject, targetRoomId) => {
        const { currentProject, currentRoom, objects, rooms } = get();

        // 1. Save scene of current room into rooms map before switching
        const updatedRoomsMap = { ...rooms };
        if (currentProject?.id && currentRoom?.id) {
          const projectRooms = updatedRoomsMap[currentProject.id] || [];
          updatedRoomsMap[currentProject.id] = projectRooms.map((r) =>
            r.id === currentRoom.id ? { ...r, sceneObjects: deepClone(objects) } : r
          );
        }

        // 2. Resolve target project's rooms
        let targetRooms = updatedRoomsMap[targetProject.id];
        if (!targetRooms || targetRooms.length === 0) {
          const defaultRoom = createDefaultRoom(targetProject.id);
          targetRooms = [defaultRoom];
          updatedRoomsMap[targetProject.id] = targetRooms;
        }

        // 3. Resolve target room
        let selectedRoom = targetRooms.find((r) => r.id === targetRoomId);
        if (!selectedRoom) {
          selectedRoom = targetRooms[0];
        }

        // Ensure room scene objects exist
        let roomScene = selectedRoom.sceneObjects;
        if (!roomScene || roomScene.length === 0) {
          roomScene = createArchitecturalScene(selectedRoom.dimensions);
          selectedRoom = { ...selectedRoom, sceneObjects: roomScene };
          updatedRoomsMap[targetProject.id] = targetRooms.map((r) =>
            r.id === selectedRoom!.id ? selectedRoom! : r
          );
        }

        const activeScene = deepClone(roomScene);

        set({
          rooms: updatedRoomsMap,
          currentProject: targetProject,
          currentRoom: selectedRoom,
          objects: activeScene,
          selectedObjectId: null,
          history: [activeScene],
          historyIndex: 0,
          isDirty: false,
        });

        updateUrlParams(targetProject.id, selectedRoom.id);
      },

      switchRoom: (targetRoom) => {
        const { currentProject, currentRoom, objects, rooms } = get();

        if (currentRoom.id === targetRoom.id) return;

        // 1. Save current room scene
        const updatedRoomsMap = { ...rooms };
        const projectRooms = updatedRoomsMap[currentProject.id] || [];

        updatedRoomsMap[currentProject.id] = projectRooms.map((r) =>
          r.id === currentRoom.id ? { ...r, sceneObjects: deepClone(objects) } : r
        );

        // 2. Fetch target room scene
        const updatedTargetRoom =
          updatedRoomsMap[currentProject.id]?.find((r) => r.id === targetRoom.id) || targetRoom;

        let roomScene = updatedTargetRoom.sceneObjects;
        if (!roomScene || roomScene.length === 0) {
          roomScene = createArchitecturalScene(updatedTargetRoom.dimensions);
        }

        const activeScene = deepClone(roomScene);

        set({
          rooms: updatedRoomsMap,
          currentRoom: { ...updatedTargetRoom, sceneObjects: activeScene },
          objects: activeScene,
          selectedObjectId: null,
          history: [activeScene],
          historyIndex: 0,
          isDirty: false,
        });

        updateUrlParams(currentProject.id, targetRoom.id);
      },

      updateRoomDimensions: (dims) => {
        const { currentProject, currentRoom, objects, rooms } = get();

        // Dynamically update floor, 4 walls, and door in 3D scene
        const updatedObjects = updateArchitecturalObjects(objects, dims);

        const updatedRoom: RoomInfo = {
          ...currentRoom,
          dimensions: dims,
          sceneObjects: deepClone(updatedObjects),
          updatedAt: new Date().toISOString(),
        };

        const projectRooms = rooms[currentProject.id] || [];
        const updatedRoomsMap = {
          ...rooms,
          [currentProject.id]: projectRooms.map((r) =>
            r.id === currentRoom.id ? updatedRoom : r
          ),
        };

        set({
          currentRoom: updatedRoom,
          objects: updatedObjects,
          rooms: updatedRoomsMap,
          isDirty: true,
        });
      },

      saveProject: () => {
        const { currentProject, currentRoom, objects, rooms, projects } = get();

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const updatedRoom: RoomInfo = {
          ...currentRoom,
          sceneObjects: deepClone(objects),
          updatedAt: now.toISOString(),
        };

        const projectRooms = rooms[currentProject.id] || [];
        const updatedRoomsMap = {
          ...rooms,
          [currentProject.id]: projectRooms.map((r) =>
            r.id === currentRoom.id ? updatedRoom : r
          ),
        };

        const updatedProject: ProjectInfo = {
          ...currentProject,
          updatedAt: timeString,
        };

        const updatedProjects = projects.map((p) =>
          p.id === currentProject.id ? updatedProject : p
        );

        set({
          projects: updatedProjects,
          rooms: updatedRoomsMap,
          currentProject: updatedProject,
          currentRoom: updatedRoom,
          isDirty: false,
          lastSavedAt: timeString,
        });
      },

      initFromUrl: (urlProjectId, urlRoomId) => {
        const { projects, rooms, currentProject, currentRoom, switchProject } = get();

        if (!urlProjectId) {
          // If no query parameters, ensure current URL has defaults
          updateUrlParams(currentProject.id, currentRoom.id);
          return;
        }

        // Find target project
        const targetProj = projects.find((p) => p.id === urlProjectId);
        if (targetProj) {
          const targetRooms = rooms[targetProj.id] || [];
          const validRoom = targetRooms.find((r) => r.id === urlRoomId);
          switchProject(targetProj, validRoom ? validRoom.id : undefined);
        } else {
          // Fallback to default safe project & sync URL
          updateUrlParams(currentProject.id, currentRoom.id);
        }
      },

      // --- HISTORY & UNDO/REDO ---

      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const nextIndex = historyIndex - 1;
          set({
            objects: deepClone(history[nextIndex]),
            historyIndex: nextIndex,
            isDirty: true,
          });
        }
      },

      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const nextIndex = historyIndex + 1;
          set({
            objects: deepClone(history[nextIndex]),
            historyIndex: nextIndex,
            isDirty: true,
          });
        }
      },
    }),
    {
      name: "avs-site-survey-editor-storage",
      version: 1,
      partialize: (state) => ({
        projects: state.projects,
        rooms: state.rooms,
        currentProject: state.currentProject,
        currentRoom: state.currentRoom,
        objects: state.objects,
        isDirty: state.isDirty,
        lastSavedAt: state.lastSavedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
