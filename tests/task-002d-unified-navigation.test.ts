import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "../src/stores/editor-store";
import {
  resolveNavigationContext,
  getNavigationItems,
} from "../src/lib/navigation-utils";
import { MainSidebar } from "../src/components/app-shell/main-sidebar";
import { AppSidebar } from "../src/components/app-shell/app-sidebar";

describe("TASK-002D Unified Sidebar & Context Navigation Tests", () => {
  beforeEach(() => {
    useEditorStore.getState().resetLocalStorage();
  });

  it("Test 1 — Editor sang Phòng: Keeps dynamic route projectId when navigating to Rooms", () => {
    const store = useEditorStore.getState();
    store.setHydrated(true);

    // Dynamic URL is project-a, but store has project-b
    const pathname = "/projects/project-a/rooms/room-a/editor";
    const navContext = resolveNavigationContext(pathname, {
      isHydrated: true,
      projects: [
        { id: "project-a", name: "Project A", customer: "Cust A", location: "Loc A", status: "survey", createdAt: "", updatedAt: "" },
        { id: "project-b", name: "Project B", customer: "Cust B", location: "Loc B", status: "survey", createdAt: "", updatedAt: "" },
      ],
      rooms: {
        "project-a": [
          { id: "room-a", projectId: "project-a", name: "Room A", type: "meeting", dimensions: { width: 8, length: 10, height: 3 }, sceneObjects: [] },
        ],
      },
      currentProject: { id: "project-b", name: "Project B", customer: "Cust B", location: "Loc B", status: "survey", createdAt: "", updatedAt: "" },
      currentRoom: null,
    });

    const items = getNavigationItems(pathname, navContext);
    const roomsItem = items.find((i) => i.id === "rooms");

    expect(roomsItem).toBeDefined();
    expect(roomsItem?.href).toBe("/projects/project-a/rooms");
    expect(roomsItem?.href).not.toContain("project-b");
    expect(roomsItem?.href).not.toContain("project-abc-building");
  });

  it("Test 2 — Rooms active state: /projects/proj-a/rooms and /projects/proj-a/rooms/room-a active 'Phòng' only", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];
    const room = store.rooms[proj.id][0];

    // Route 1: Rooms list
    const pathnameList = `/projects/${proj.id}/rooms`;
    const contextList = resolveNavigationContext(pathnameList, {
      isHydrated: true,
      projects: store.projects,
      rooms: store.rooms,
      currentProject: store.currentProject,
      currentRoom: store.currentRoom,
    });
    const itemsList = getNavigationItems(pathnameList, contextList);

    const roomsItemList = itemsList.find((i) => i.id === "rooms");
    const projectsItemList = itemsList.find((i) => i.id === "projects");
    const editorItemList = itemsList.find((i) => i.id === "editor");

    expect(roomsItemList?.isActive).toBe(true);
    expect(projectsItemList?.isActive).toBe(false);
    expect(editorItemList?.isActive).toBe(false);

    // Route 2: Room detail
    const pathnameDetail = `/projects/${proj.id}/rooms/${room.id}`;
    const contextDetail = resolveNavigationContext(pathnameDetail, {
      isHydrated: true,
      projects: store.projects,
      rooms: store.rooms,
      currentProject: store.currentProject,
      currentRoom: store.currentRoom,
    });
    const itemsDetail = getNavigationItems(pathnameDetail, contextDetail);

    const roomsItemDetail = itemsDetail.find((i) => i.id === "rooms");
    const projectsItemDetail = itemsDetail.find((i) => i.id === "projects");
    const editorItemDetail = itemsDetail.find((i) => i.id === "editor");

    expect(roomsItemDetail?.isActive).toBe(true);
    expect(projectsItemDetail?.isActive).toBe(false);
    expect(editorItemDetail?.isActive).toBe(false);
  });

  it("Test 3 — Editor active state: /projects/proj-a/rooms/room-a/editor active '3D Editor' only", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];
    const room = store.rooms[proj.id][0];

    const pathname = `/projects/${proj.id}/rooms/${room.id}/editor`;
    const context = resolveNavigationContext(pathname, {
      isHydrated: true,
      projects: store.projects,
      rooms: store.rooms,
      currentProject: store.currentProject,
      currentRoom: store.currentRoom,
    });
    const items = getNavigationItems(pathname, context);

    const editorItem = items.find((i) => i.id === "editor");
    const roomsItem = items.find((i) => i.id === "rooms");
    const projectsItem = items.find((i) => i.id === "projects");

    expect(editorItem?.isActive).toBe(true);
    expect(roomsItem?.isActive).toBe(false);
    expect(projectsItem?.isActive).toBe(false);
  });

  it("Test 4 — Dynamic route priority over legacy store state", () => {
    const pathname = "/projects/proj-alpha/rooms/room-alpha/editor";
    const context = resolveNavigationContext(pathname, {
      isHydrated: true,
      projects: [
        { id: "proj-alpha", name: "Alpha", customer: "C", location: "L", status: "survey", createdAt: "", updatedAt: "" },
        { id: "proj-beta", name: "Beta", customer: "C", location: "L", status: "survey", createdAt: "", updatedAt: "" },
      ],
      rooms: {
        "proj-alpha": [
          { id: "room-alpha", projectId: "proj-alpha", name: "Room Alpha", type: "meeting", dimensions: { width: 5, length: 5, height: 3 }, sceneObjects: [] },
        ],
        "proj-beta": [
          { id: "room-beta", projectId: "proj-beta", name: "Room Beta", type: "meeting", dimensions: { width: 5, length: 5, height: 3 }, sceneObjects: [] },
        ],
      },
      currentProject: { id: "proj-beta", name: "Beta", customer: "C", location: "L", status: "survey", createdAt: "", updatedAt: "" },
      currentRoom: { id: "room-beta", projectId: "proj-beta", name: "Room Beta", type: "meeting", dimensions: { width: 5, length: 5, height: 3 }, sceneObjects: [] },
    });

    expect(context.activeProjectId).toBe("proj-alpha");
    expect(context.activeRoomId).toBe("room-alpha");

    const items = getNavigationItems(pathname, context);
    const roomsItem = items.find((i) => i.id === "rooms");
    const editorItem = items.find((i) => i.id === "editor");

    expect(roomsItem?.href).toBe("/projects/proj-alpha/rooms");
    expect(editorItem?.href).toBe("/projects/proj-alpha/rooms/room-alpha/editor");
  });

  it("Test 5 — Room invalid or not belonging to Project handles fallback/disabled safely without mock IDs", () => {
    const pathname = "/projects/proj-x/rooms/room-y/editor";
    const context = resolveNavigationContext(pathname, {
      isHydrated: true,
      projects: [
        { id: "proj-x", name: "Proj X", customer: "C", location: "L", status: "survey", createdAt: "", updatedAt: "" },
      ],
      rooms: {
        "proj-x": [], // No rooms exist in proj-x!
      },
      currentProject: null,
      currentRoom: null,
    });

    expect(context.isValidRoom).toBe(false);
    const items = getNavigationItems(pathname, context);
    const editorItem = items.find((i) => i.id === "editor");

    expect(editorItem?.disabled).toBe(true);
    expect(editorItem?.href).toBe("#");
    expect(editorItem?.href).not.toContain("room-101");
    expect(editorItem?.href).not.toContain("project-abc-building");
  });

  it("Test 6 — Unhydrated state renders safely without fake/mock URLs", () => {
    const pathname = "/dashboard";
    const context = resolveNavigationContext(pathname, {
      isHydrated: false, // Store not hydrated yet!
      projects: [],
      rooms: {},
      currentProject: null,
      currentRoom: null,
    });

    expect(context.isValidProject).toBe(false);
    expect(context.isValidRoom).toBe(false);

    const items = getNavigationItems(pathname, context);
    const surveyItem = items.find((i) => i.id === "survey");
    const roomsItem = items.find((i) => i.id === "rooms");
    const editorItem = items.find((i) => i.id === "editor");

    expect(surveyItem?.disabled).toBe(true);
    expect(roomsItem?.disabled).toBe(true);
    expect(editorItem?.disabled).toBe(true);

    expect(surveyItem?.href).toBe("#");
    expect(roomsItem?.href).toBe("#");
    expect(editorItem?.href).toBe("#");

    expect(surveyItem?.href).not.toContain("project-abc-building");
    expect(roomsItem?.href).not.toContain("project-abc-building");
    expect(editorItem?.href).not.toContain("room-101");
  });

  it("Test 7 — Unified Sidebar: MainSidebar component is aliased to AppSidebar", () => {
    expect(MainSidebar).toBe(AppSidebar);
  });

  it("Test 8 — Persistence integrity: Navigation context resolution does not mutate store state", () => {
    const store = useEditorStore.getState();
    const proj = store.projects[0];
    const initialObjects = [...store.objects];
    const initialStatus = proj.status;

    // Execute navigation resolution across multiple paths
    resolveNavigationContext(`/projects/${proj.id}/rooms`, {
      isHydrated: true,
      projects: store.projects,
      rooms: store.rooms,
      currentProject: store.currentProject,
      currentRoom: store.currentRoom,
    });

    resolveNavigationContext(`/projects/${proj.id}/rooms/room-101/editor`, {
      isHydrated: true,
      projects: store.projects,
      rooms: store.rooms,
      currentProject: store.currentProject,
      currentRoom: store.currentRoom,
    });

    const storeAfter = useEditorStore.getState();
    expect(storeAfter.projects[0].status).toBe(initialStatus);
    expect(storeAfter.objects).toEqual(initialObjects);
  });
});
