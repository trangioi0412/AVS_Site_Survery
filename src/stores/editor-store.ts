import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  EditorMode,
  SceneObject,
  ViewMode,
  RoomDimensions,
  EditorSnapshot,
  HistoryEntry,
  HistoryTransaction,
} from "@/types/editor";
import { ProjectInfo, ProjectStatus, RoomInfo } from "@/types/equipment";
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

const MAX_HISTORY_ENTRIES = 100;

function createSnapshot(objects: SceneObject[], dimensions: RoomDimensions): EditorSnapshot {
  return {
    objects: deepClone(objects || []),
    dimensions: {
      width: Number(dimensions?.width) || 8,
      length: Number(dimensions?.length) || 10,
      height: Number(dimensions?.height) || 3.2,
    },
  };
}

function isSnapshotEqual(snapA: EditorSnapshot, snapB: EditorSnapshot): boolean {
  if (!snapA || !snapB) return false;
  if (
    snapA.dimensions.width !== snapB.dimensions.width ||
    snapA.dimensions.length !== snapB.dimensions.length ||
    snapA.dimensions.height !== snapB.dimensions.height
  ) {
    return false;
  }
  if (snapA.objects.length !== snapB.objects.length) return false;
  return JSON.stringify(snapA.objects) === JSON.stringify(snapB.objects);
}

function createBaselineHistory(
  objects: SceneObject[],
  dimensions: RoomDimensions
): { history: HistoryEntry[]; historyIndex: number; activeHistoryTransaction: null } {
  const snapshot = createSnapshot(objects, dimensions);
  const baselineEntry: HistoryEntry = {
    id: `baseline-${Date.now()}`,
    label: "Initial Scene",
    timestamp: Date.now(),
    snapshot,
  };
  return {
    history: [baselineEntry],
    historyIndex: 0,
    activeHistoryTransaction: null,
  };
}

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
  surveyDrafts: Record<string, Record<string, unknown>>; // key: roomId -> survey form draft data

  // Settings
  unit: "m" | "mm";
  theme: "dark" | "light";

  // UI State
  selectedObjectId: string | null;
  editorMode: EditorMode;
  viewMode: ViewMode;
  snapEnabled: boolean;
  gridSize: number;
  showGrid: boolean;
  showHelpers: boolean;
  sidebarCollapsed: boolean;
  history: HistoryEntry[];
  historyIndex: number;
  activeHistoryTransaction: HistoryTransaction | null;

  // Actions
  setHydrated: (hydrated: boolean) => void;
  selectObject: (id: string | null) => void;
  addObject: (object: SceneObject) => void;
  updateObject: (id: string, changes: Partial<SceneObject>) => void;
  updateObjectWithHistory: (id: string, changes: Partial<SceneObject>, label: string) => void;
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

  beginHistoryTransaction: (label: string) => void;
  commitHistoryTransaction: () => void;
  cancelHistoryTransaction: (options?: { restore?: boolean }) => void;

  createProject: (data: { name: string; customer?: string; location?: string }) => void;
  addRoomToProject: (
    projectId: string,
    name?: string,
    dimensions?: { width: number; length: number; height: number }
  ) => RoomInfo;
  deleteProject: (projectId: string) => void;
  deleteRoom: (projectId: string, roomId: string) => void;
  switchProject: (project: ProjectInfo, targetRoomId?: string) => void;
  switchRoom: (room: RoomInfo) => void;
  updateProjectStatus: (projectId: string, status: ProjectStatus) => void;
  updateRoomDimensions: (dims: { width: number; length: number; height: number }) => void;
  saveProject: () => void;
  saveSurveyDraft: (roomId: string, data: Record<string, unknown>) => void;
  setSettings: (settings: Partial<{ unit: "m" | "mm"; gridSize: number; snapEnabled: boolean; showGrid: boolean }>) => void;
  resetLocalStorage: () => void;
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

/**
 * Validates and normalizes persisted state to prevent crashes from corrupted or missing data.
 */
function normalizePersistedState(state: any): Partial<EditorState> {
  const initialProjects = getInitialProjects();
  const initialRoomsMap = getInitialRoomsMap();

  let projects = Array.isArray(state?.projects) && state.projects.length > 0
    ? state.projects
    : initialProjects;

  // Normalize project statuses
  const normalizeStatus = (st?: string): ProjectStatus => {
    if (st === "surveying" || st === "survey") return "survey";
    if (st === "planning" || st === "drafting") return "drafting";
    if (st === "pending_approval") return "pending_approval";
    if (st === "approved") return "approved";
    if (st === "completed") return "completed";
    return "survey";
  };

  projects = projects.map((p: any) => ({
    ...p,
    status: normalizeStatus(p?.status),
  }));

  let roomsMap = state?.rooms && typeof state.rooms === "object"
    ? state.rooms
    : initialRoomsMap;

  // Validate every room in roomsMap
  const validatedRoomsMap: Record<string, RoomInfo[]> = {};
  for (const projId of Object.keys(roomsMap)) {
    const roomList = Array.isArray(roomsMap[projId]) ? roomsMap[projId] : [];
    validatedRoomsMap[projId] = roomList.map((r: any) => {
      const safeDims = {
        width: Math.max(2, Number(r?.dimensions?.width) || 8),
        length: Math.max(2, Number(r?.dimensions?.length) || 10),
        height: Math.max(2, Number(r?.dimensions?.height) || 3.2),
      };
      const safeScene = Array.isArray(r?.sceneObjects) && r.sceneObjects.length > 0
        ? r.sceneObjects
        : createArchitecturalScene(safeDims);

      return {
        ...r,
        id: r?.id || `room-${Date.now()}`,
        projectId: r?.projectId || projId,
        name: r?.name || "Phòng họp",
        type: r?.type || "meeting-room",
        dimensions: safeDims,
        sceneObjects: safeScene,
      };
    });
  }

  // Ensure every project in projects list has at least one room
  projects.forEach((proj: ProjectInfo) => {
    if (!validatedRoomsMap[proj.id] || validatedRoomsMap[proj.id].length === 0) {
      validatedRoomsMap[proj.id] = [createDefaultRoom(proj.id)];
    }
  });

  // Resolve current project & current room
  let currentProject = projects.find((p: ProjectInfo) => p.id === state?.currentProject?.id) || projects[0];
  let projectRooms = validatedRoomsMap[currentProject.id] || [createDefaultRoom(currentProject.id)];
  let currentRoom = projectRooms.find((r: RoomInfo) => r.id === state?.currentRoom?.id) || projectRooms[0];
  let objects = Array.isArray(state?.objects) && state.objects.length > 0
    ? state.objects
    : deepClone(currentRoom.sceneObjects || createArchitecturalScene(currentRoom.dimensions));

  return {
    projects,
    rooms: validatedRoomsMap,
    currentProject,
    currentRoom,
    objects,
    isDirty: false,
    lastSavedAt: state?.lastSavedAt || "10:30 AM",
    surveyDrafts: state?.surveyDrafts || {},
    unit: state?.unit === "mm" ? "mm" : "m",
    theme: "dark",
  };
}

const initialSceneObjects = deepClone(MOCK_ROOM.sceneObjects || []);
const initialBaseline = createBaselineHistory(initialSceneObjects, MOCK_ROOM.dimensions);

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      // Default Initial States
      projects: getInitialProjects(),
      rooms: getInitialRoomsMap(),
      currentProject: MOCK_PROJECT,
      currentRoom: MOCK_ROOM,
      objects: initialSceneObjects,
      isDirty: false,
      lastSavedAt: "10:30 AM",
      isHydrated: false,
      surveyDrafts: {},

      // Settings
      unit: "m",
      theme: "dark",

      // UI States
      selectedObjectId: null,
      editorMode: "translate",
      viewMode: "3d",
      snapEnabled: true,
      gridSize: 1.0,
      showGrid: true,
      showHelpers: true,
      sidebarCollapsed: false,
      ...initialBaseline,

      setHydrated: (hydrated) => set({ isHydrated: hydrated }),

      selectObject: (id) => set({ selectedObjectId: id }),

      beginHistoryTransaction: (label) => {
        const currentActive = get().activeHistoryTransaction;
        if (currentActive) {
          const currentSnap = createSnapshot(get().objects, get().currentRoom.dimensions);
          if (!isSnapshotEqual(currentActive.before, currentSnap)) {
            get().commitHistoryTransaction();
          } else {
            get().cancelHistoryTransaction({ restore: false });
          }
        }

        const currentState = get();
        set({
          activeHistoryTransaction: {
            label,
            before: createSnapshot(currentState.objects, currentState.currentRoom.dimensions),
            wasDirty: currentState.isDirty,
          },
        });
      },

      commitHistoryTransaction: () => {
        const { activeHistoryTransaction, objects, currentRoom, history, historyIndex } = get();
        if (!activeHistoryTransaction) return;

        const currentSnap = createSnapshot(objects, currentRoom.dimensions);
        if (isSnapshotEqual(activeHistoryTransaction.before, currentSnap)) {
          set({ activeHistoryTransaction: null });
          return;
        }

        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: activeHistoryTransaction.label,
          timestamp: Date.now(),
          snapshot: currentSnap,
        });

        if (newHistory.length > MAX_HISTORY_ENTRIES) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES);
        }

        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
          activeHistoryTransaction: null,
          isDirty: true,
        });
      },

      cancelHistoryTransaction: (options) => {
        const {
          activeHistoryTransaction,
          currentRoom,
          currentProject,
          rooms,
          selectedObjectId,
        } = get();

        if (!activeHistoryTransaction) return;

        if (options?.restore) {
          const restoredObjects = deepClone(activeHistoryTransaction.before.objects);
          const restoredDims = deepClone(activeHistoryTransaction.before.dimensions);
          const updatedRoom: RoomInfo = {
            ...currentRoom,
            dimensions: restoredDims,
            sceneObjects: deepClone(restoredObjects),
            updatedAt: new Date().toISOString(),
          };

          const projectRooms = rooms[currentProject.id] || [];
          const updatedRoomsMap = {
            ...rooms,
            [currentProject.id]: projectRooms.map((r) =>
              r.id === currentRoom.id ? updatedRoom : r
            ),
          };

          const isSelectedStillValid = restoredObjects.some((o) => o.id === selectedObjectId);

          set({
            objects: restoredObjects,
            currentRoom: updatedRoom,
            rooms: updatedRoomsMap,
            selectedObjectId: isSelectedStillValid ? selectedObjectId : null,
            isDirty: activeHistoryTransaction.wasDirty,
            activeHistoryTransaction: null,
          });
        } else {
          set({ activeHistoryTransaction: null });
        }
      },

      addObject: (newObj) => {
        const { objects, history, historyIndex, currentRoom } = get();
        const updated = [...objects, newObj];
        const snapshot = createSnapshot(updated, currentRoom.dimensions);
        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: `Add object: ${newObj.name || newObj.type}`,
          timestamp: Date.now(),
          snapshot,
        });

        if (newHistory.length > MAX_HISTORY_ENTRIES) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES);
        }

        set({
          objects: updated,
          selectedObjectId: newObj.id,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          activeHistoryTransaction: null,
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

      updateObjectWithHistory: (id, changes, label) => {
        const { objects, history, historyIndex, currentRoom } = get();
        const targetObj = objects.find((o) => o.id === id);
        if (!targetObj) return;

        const updated = objects.map((obj) =>
          obj.id === id ? { ...obj, ...changes } : obj
        );
        const snapshot = createSnapshot(updated, currentRoom.dimensions);
        if (isSnapshotEqual(createSnapshot(objects, currentRoom.dimensions), snapshot)) {
          return;
        }

        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label,
          timestamp: Date.now(),
          snapshot,
        });

        if (newHistory.length > MAX_HISTORY_ENTRIES) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES);
        }

        set({
          objects: updated,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          activeHistoryTransaction: null,
          isDirty: true,
        });
      },

      removeObject: (id) => {
        const { objects, history, historyIndex, selectedObjectId, currentRoom } = get();
        const targetObj = objects.find((o) => o.id === id);
        if (!targetObj) return;

        const updated = objects.filter((obj) => obj.id !== id);
        const snapshot = createSnapshot(updated, currentRoom.dimensions);
        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: `Delete object: ${targetObj.name}`,
          timestamp: Date.now(),
          snapshot,
        });

        if (newHistory.length > MAX_HISTORY_ENTRIES) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES);
        }

        set({
          objects: updated,
          selectedObjectId: selectedObjectId === id ? null : selectedObjectId,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          activeHistoryTransaction: null,
          isDirty: true,
        });
      },

      setEditorMode: (mode) => set({ editorMode: mode }),

      setViewMode: (mode) => set({ viewMode: mode }),

      toggleVisibility: (id) => {
        const { objects, history, historyIndex, currentRoom } = get();
        const targetObj = objects.find((o) => o.id === id);
        if (!targetObj) return;

        const updated = objects.map((obj) =>
          obj.id === id ? { ...obj, visible: !obj.visible } : obj
        );
        const snapshot = createSnapshot(updated, currentRoom.dimensions);
        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: `Toggle visibility: ${targetObj.name}`,
          timestamp: Date.now(),
          snapshot,
        });

        if (newHistory.length > MAX_HISTORY_ENTRIES) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES);
        }

        set({
          objects: updated,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          activeHistoryTransaction: null,
          isDirty: true,
        });
      },

      toggleLock: (id) => {
        const { objects, history, historyIndex, currentRoom } = get();
        const targetObj = objects.find((o) => o.id === id);
        if (!targetObj) return;

        const updated = objects.map((obj) =>
          obj.id === id ? { ...obj, locked: !obj.locked } : obj
        );
        const snapshot = createSnapshot(updated, currentRoom.dimensions);
        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: `Toggle lock: ${targetObj.name}`,
          timestamp: Date.now(),
          snapshot,
        });

        if (newHistory.length > MAX_HISTORY_ENTRIES) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES);
        }

        set({
          objects: updated,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          activeHistoryTransaction: null,
          isDirty: true,
        });
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
        saveProject();

        const { project, room } = createNewProject(data);
        const updatedProjects = [...projects, project];
        const updatedRoomsMap = {
          ...rooms,
          [project.id]: [room],
        };

        const roomScene = deepClone(room.sceneObjects || []);
        const baseline = createBaselineHistory(roomScene, room.dimensions);

        set({
          projects: updatedProjects,
          rooms: updatedRoomsMap,
          currentProject: project,
          currentRoom: room,
          objects: roomScene,
          selectedObjectId: null,
          ...baseline,
          isDirty: false,
        });

        updateUrlParams(project.id, room.id);
      },

      addRoomToProject: (projectId, name = "Phòng mới", dimensions = { width: 8, length: 10, height: 3.2 }) => {
        const { rooms } = get();
        const newRoom = createDefaultRoom(projectId, name, dimensions);
        const projectRooms = rooms[projectId] || [];
        const updatedRooms = [...projectRooms, newRoom];

        set({
          rooms: {
            ...rooms,
            [projectId]: updatedRooms,
          },
        });

        return newRoom;
      },

      deleteProject: (projectId) => {
        const { projects, rooms, currentProject, switchProject } = get();
        if (projects.length <= 1) return; // Don't delete last remaining project

        const updatedProjects = projects.filter((p) => p.id !== projectId);
        const updatedRoomsMap = { ...rooms };
        delete updatedRoomsMap[projectId];

        set({
          projects: updatedProjects,
          rooms: updatedRoomsMap,
        });

        if (currentProject.id === projectId) {
          switchProject(updatedProjects[0]);
        }
      },

      deleteRoom: (projectId, roomId) => {
        const { rooms, currentRoom, switchRoom } = get();
        const projectRooms = rooms[projectId] || [];
        if (projectRooms.length <= 1) return; // Don't delete last remaining room in project

        const updatedRooms = projectRooms.filter((r) => r.id !== roomId);
        const updatedRoomsMap = {
          ...rooms,
          [projectId]: updatedRooms,
        };

        set({ rooms: updatedRoomsMap });

        if (currentRoom.id === roomId) {
          switchRoom(updatedRooms[0]);
        }
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
        const baseline = createBaselineHistory(activeScene, selectedRoom.dimensions);

        set({
          rooms: updatedRoomsMap,
          currentProject: targetProject,
          currentRoom: selectedRoom,
          objects: activeScene,
          selectedObjectId: null,
          ...baseline,
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
        const rawTargetRoom =
          updatedRoomsMap[currentProject.id]?.find((r) => r.id === targetRoom.id) || targetRoom;

        const safeDims = {
          width: Math.max(2, Number(rawTargetRoom.dimensions?.width) || 8),
          length: Math.max(2, Number(rawTargetRoom.dimensions?.length) || 10),
          height: Math.max(2, Number(rawTargetRoom.dimensions?.height) || 3.2),
        };

        const updatedTargetRoom: RoomInfo = {
          ...rawTargetRoom,
          dimensions: safeDims,
        };

        let roomScene = updatedTargetRoom.sceneObjects;
        if (!roomScene || roomScene.length === 0) {
          roomScene = createArchitecturalScene(safeDims);
        }

        const activeScene = deepClone(roomScene);
        const finalTargetRoom: RoomInfo = { ...updatedTargetRoom, sceneObjects: activeScene };

        const currentProjRooms = updatedRoomsMap[currentProject.id] || [];
        const roomExists = currentProjRooms.some((r) => r.id === targetRoom.id);

        if (roomExists) {
          updatedRoomsMap[currentProject.id] = currentProjRooms.map((r) =>
            r.id === targetRoom.id ? finalTargetRoom : r
          );
        } else {
          updatedRoomsMap[currentProject.id] = [...currentProjRooms, finalTargetRoom];
        }

        const baseline = createBaselineHistory(activeScene, finalTargetRoom.dimensions);

        set({
          rooms: updatedRoomsMap,
          currentRoom: finalTargetRoom,
          objects: activeScene,
          selectedObjectId: null,
          ...baseline,
          isDirty: false,
        });
      },

      updateProjectStatus: (projectId, status) => {
        const { projects, currentProject } = get();
        const updatedProjects = projects.map((p) =>
          p.id === projectId ? { ...p, status } : p
        );

        const isCurrent = currentProject.id === projectId;
        set({
          projects: updatedProjects,
          currentProject: isCurrent ? { ...currentProject, status } : currentProject,
        });
      },

      updateRoomDimensions: (dims) => {
        const { currentProject, currentRoom, objects, rooms, history, historyIndex } = get();

        if (
          currentRoom.dimensions.width === dims.width &&
          currentRoom.dimensions.length === dims.length &&
          currentRoom.dimensions.height === dims.height
        ) {
          return;
        }

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

        const snapshot = createSnapshot(updatedObjects, dims);
        let newHistory = history.slice(0, historyIndex + 1);
        newHistory.push({
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          label: "Update room dimensions",
          timestamp: Date.now(),
          snapshot,
        });

        if (newHistory.length > MAX_HISTORY_ENTRIES) {
          newHistory = newHistory.slice(newHistory.length - MAX_HISTORY_ENTRIES);
        }

        set({
          currentRoom: updatedRoom,
          objects: updatedObjects,
          rooms: updatedRoomsMap,
          history: newHistory,
          historyIndex: newHistory.length - 1,
          activeHistoryTransaction: null,
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

      saveSurveyDraft: (roomId, surveyData) => {
        const { surveyDrafts } = get();
        set({
          surveyDrafts: {
            ...surveyDrafts,
            [roomId]: surveyData,
          },
        });
      },

      setSettings: (settings) => {
        set((state) => ({
          unit: settings.unit || state.unit,
          gridSize: settings.gridSize !== undefined ? settings.gridSize : state.gridSize,
          snapEnabled: settings.snapEnabled !== undefined ? settings.snapEnabled : state.snapEnabled,
          showGrid: settings.showGrid !== undefined ? settings.showGrid : state.showGrid,
        }));
      },

      resetLocalStorage: () => {
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("avs-site-survey-editor-storage");
        }
        const initialProjects = getInitialProjects();
        const initialRoomsMap = getInitialRoomsMap();
        const firstProj = initialProjects[0];
        const firstRoom = initialRoomsMap[firstProj.id][0];
        const initialScene = deepClone(firstRoom.sceneObjects || []);
        const baseline = createBaselineHistory(initialScene, firstRoom.dimensions);

        set({
          projects: initialProjects,
          rooms: initialRoomsMap,
          currentProject: firstProj,
          currentRoom: firstRoom,
          objects: initialScene,
          isDirty: false,
          lastSavedAt: "Vừa xong",
          surveyDrafts: {},
          unit: "m",
          theme: "dark",
          selectedObjectId: null,
          ...baseline,
        });
      },

      initFromUrl: (urlProjectId, urlRoomId) => {
        const { projects, rooms, currentProject, currentRoom, switchProject } = get();

        if (!urlProjectId) {
          updateUrlParams(currentProject.id, currentRoom.id);
          return;
        }

        const targetProj = projects.find((p) => p.id === urlProjectId);
        if (targetProj) {
          const targetRooms = rooms[targetProj.id] || [];
          const validRoom = targetRooms.find((r) => r.id === urlRoomId);
          switchProject(targetProj, validRoom ? validRoom.id : undefined);
        } else {
          updateUrlParams(currentProject.id, currentRoom.id);
        }
      },

      // --- HISTORY & UNDO/REDO ---

      undo: () => {
        const {
          history,
          historyIndex,
          selectedObjectId,
          currentRoom,
          currentProject,
          rooms,
          activeHistoryTransaction,
        } = get();

        if (activeHistoryTransaction) {
          set({ activeHistoryTransaction: null });
        }

        if (historyIndex > 0) {
          const nextIndex = historyIndex - 1;
          const targetSnap = history[nextIndex].snapshot;
          const restoredObjects = deepClone(targetSnap.objects);
          const restoredDims = targetSnap.dimensions;

          const updatedRoom: RoomInfo = {
            ...currentRoom,
            dimensions: restoredDims,
            sceneObjects: deepClone(restoredObjects),
            updatedAt: new Date().toISOString(),
          };

          const projectRooms = rooms[currentProject.id] || [];
          const updatedRoomsMap = {
            ...rooms,
            [currentProject.id]: projectRooms.map((r) =>
              r.id === currentRoom.id ? updatedRoom : r
            ),
          };

          const isSelectedStillValid = restoredObjects.some((o) => o.id === selectedObjectId);

          set({
            objects: restoredObjects,
            currentRoom: updatedRoom,
            rooms: updatedRoomsMap,
            selectedObjectId: isSelectedStillValid ? selectedObjectId : null,
            historyIndex: nextIndex,
            activeHistoryTransaction: null,
            isDirty: true,
          });
        }
      },

      redo: () => {
        const {
          history,
          historyIndex,
          selectedObjectId,
          currentRoom,
          currentProject,
          rooms,
          activeHistoryTransaction,
        } = get();

        if (activeHistoryTransaction) {
          set({ activeHistoryTransaction: null });
        }

        if (historyIndex < history.length - 1) {
          const nextIndex = historyIndex + 1;
          const targetSnap = history[nextIndex].snapshot;
          const restoredObjects = deepClone(targetSnap.objects);
          const restoredDims = targetSnap.dimensions;

          const updatedRoom: RoomInfo = {
            ...currentRoom,
            dimensions: restoredDims,
            sceneObjects: deepClone(restoredObjects),
            updatedAt: new Date().toISOString(),
          };

          const projectRooms = rooms[currentProject.id] || [];
          const updatedRoomsMap = {
            ...rooms,
            [currentProject.id]: projectRooms.map((r) =>
              r.id === currentRoom.id ? updatedRoom : r
            ),
          };

          const isSelectedStillValid = restoredObjects.some((o) => o.id === selectedObjectId);

          set({
            objects: restoredObjects,
            currentRoom: updatedRoom,
            rooms: updatedRoomsMap,
            selectedObjectId: isSelectedStillValid ? selectedObjectId : null,
            historyIndex: nextIndex,
            activeHistoryTransaction: null,
            isDirty: true,
          });
        }
      },
    }),
    {
      name: "avs-site-survey-editor-storage",
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0 || !persistedState) {
          return normalizePersistedState({});
        }
        return normalizePersistedState(persistedState);
      },
      partialize: (state) => ({
        projects: state.projects,
        rooms: state.rooms,
        currentProject: state.currentProject,
        currentRoom: state.currentRoom,
        objects: state.objects,
        isDirty: state.isDirty,
        lastSavedAt: state.lastSavedAt,
        surveyDrafts: state.surveyDrafts,
        unit: state.unit,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("[Zustand Persist] Rehydration error:", error);
        }
        const rawState = state || {};
        const normalized = normalizePersistedState(rawState);
        const baseline = createBaselineHistory(
          normalized.objects || [],
          normalized.currentRoom?.dimensions || { width: 8, length: 10, height: 3.2 }
        );
        useEditorStore.setState({
          ...normalized,
          ...baseline,
          selectedObjectId: null,
          isHydrated: true,
        });
      },
    }
  )
);
