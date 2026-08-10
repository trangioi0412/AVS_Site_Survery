import React from "react";
import {
  LayoutDashboard,
  FolderKanban,
  ClipboardCheck,
  DoorClosed,
  Box,
  Cpu,
  Library,
  FileText,
  Settings,
} from "lucide-react";
import { ProjectInfo, RoomInfo } from "@/types/equipment";

export interface NavigationContext {
  activeProjectId: string | null;
  activeRoomId: string | null;
  isValidProject: boolean;
  isValidRoom: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  disabled: boolean;
  disabledReason?: string;
}

export interface StoreStateContext {
  isHydrated: boolean;
  projects: ProjectInfo[];
  rooms: Record<string, RoomInfo[]>;
  currentProject: ProjectInfo | null;
  currentRoom: RoomInfo | null;
}

/**
 * Resolves project and room context from the current pathname and Zustand store state.
 * Dynamic URL parameters take absolute priority over legacy store state.
 */
export function resolveNavigationContext(
  pathname: string,
  storeState: StoreStateContext
): NavigationContext {
  const { isHydrated, projects, rooms, currentProject, currentRoom } = storeState;

  // 1. Extract projectId from pathname if present (/projects/:projectId...)
  let urlProjectId: string | null = null;
  const projectMatch = pathname.match(/^\/projects\/([^\/]+)/);
  if (projectMatch && projectMatch[1]) {
    urlProjectId = decodeURIComponent(projectMatch[1]);
  }

  // 2. Extract roomId from pathname if present (/projects/:projectId/rooms/:roomId...)
  let urlRoomId: string | null = null;
  const roomMatch = pathname.match(/^\/projects\/[^\/]+\/rooms\/([^\/]+)/);
  if (roomMatch && roomMatch[1]) {
    urlRoomId = decodeURIComponent(roomMatch[1]);
  }

  // 3. Resolve active project ID
  let activeProjectId: string | null = urlProjectId || currentProject?.id || null;
  let isValidProject = false;

  if (isHydrated && projects && projects.length > 0) {
    if (activeProjectId) {
      const foundProject = projects.find((p) => p.id === activeProjectId);
      if (foundProject) {
        isValidProject = true;
      } else {
        // If URL project ID does not exist in store, check currentProject
        if (currentProject && projects.some((p) => p.id === currentProject.id)) {
          activeProjectId = currentProject.id;
          isValidProject = true;
        } else if (projects[0]) {
          activeProjectId = projects[0].id;
          isValidProject = true;
        } else {
          activeProjectId = null;
          isValidProject = false;
        }
      }
    } else if (currentProject && projects.some((p) => p.id === currentProject.id)) {
      activeProjectId = currentProject.id;
      isValidProject = true;
    } else if (projects[0]) {
      activeProjectId = projects[0].id;
      isValidProject = true;
    }
  }

  // 4. Resolve active room ID
  let activeRoomId: string | null = urlRoomId;
  let isValidRoom = false;

  if (isHydrated && isValidProject && activeProjectId) {
    const projectRooms = rooms[activeProjectId] || [];

    if (urlRoomId) {
      const foundRoom = projectRooms.find((r) => r.id === urlRoomId);
      if (foundRoom) {
        activeRoomId = foundRoom.id;
        isValidRoom = true;
      }
    }

    if (!isValidRoom) {
      // Check if store's currentRoom belongs to activeProjectId and exists in rooms
      if (
        currentRoom &&
        currentRoom.projectId === activeProjectId &&
        projectRooms.some((r) => r.id === currentRoom.id)
      ) {
        activeRoomId = currentRoom.id;
        isValidRoom = true;
      } else if (projectRooms.length > 0) {
        activeRoomId = projectRooms[0].id;
        isValidRoom = true;
      }
    }
  }

  return {
    activeProjectId,
    activeRoomId,
    isValidProject,
    isValidRoom,
  };
}

/**
 * Returns unified navigation menu items with accurate hrefs, active states, and disabled flags.
 */
export function getNavigationItems(
  pathname: string,
  context: NavigationContext
): NavigationItem[] {
  const { activeProjectId, activeRoomId, isValidProject, isValidRoom } = context;

  // Hrefs
  const surveyHref = isValidProject && activeProjectId ? `/projects/${activeProjectId}/survey` : "#";
  const roomsHref = isValidProject && activeProjectId ? `/projects/${activeProjectId}/rooms` : "#";
  const editorHref =
    isValidProject && isValidRoom && activeProjectId && activeRoomId
      ? `/projects/${activeProjectId}/rooms/${activeRoomId}/editor`
      : "#";

  // Active state calculations:
  // 1. Dashboard: exactly "/dashboard"
  const isDashboardActive = pathname === "/dashboard";

  // 2. Projects: "/projects" or "/projects/[projectId]", but NOT rooms, survey, or editor subroutes
  const isProjectsActive =
    pathname === "/projects" ||
    (pathname.startsWith("/projects/") &&
      !pathname.includes("/rooms") &&
      !pathname.endsWith("/survey") &&
      !pathname.endsWith("/editor"));

  // 3. Survey: ends with "/survey"
  const isSurveyActive = pathname.endsWith("/survey");

  // 4. Rooms: includes "/rooms" AND does NOT end with "/editor"
  const isRoomsActive = pathname.includes("/rooms") && !pathname.endsWith("/editor");

  // 5. 3D Editor: ends with "/editor"
  const isEditorActive = pathname.endsWith("/editor");

  // 6. Equipment
  const isEquipmentActive = pathname.startsWith("/equipment");

  // 7. Library
  const isLibraryActive = pathname.startsWith("/library");

  // 8. Reports
  const isReportsActive = pathname.startsWith("/reports");

  // 9. Settings
  const isSettingsActive = pathname.startsWith("/settings");

  return [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      isActive: isDashboardActive,
      disabled: false,
    },
    {
      id: "projects",
      label: "Dự án",
      href: "/projects",
      icon: FolderKanban,
      isActive: isProjectsActive,
      disabled: false,
    },
    {
      id: "survey",
      label: "Khảo sát",
      href: surveyHref,
      icon: ClipboardCheck,
      isActive: isSurveyActive,
      disabled: !isValidProject,
      disabledReason: !isValidProject ? "Vui lòng chọn hoặc tạo dự án để bắt đầu khảo sát" : undefined,
    },
    {
      id: "rooms",
      label: "Phòng",
      href: roomsHref,
      icon: DoorClosed,
      isActive: isRoomsActive,
      disabled: !isValidProject,
      disabledReason: !isValidProject ? "Vui lòng chọn dự án để xem danh sách phòng" : undefined,
    },
    {
      id: "editor",
      label: "3D Editor",
      href: editorHref,
      icon: Box,
      isActive: isEditorActive,
      disabled: !isValidProject || !isValidRoom,
      disabledReason: !isValidProject
        ? "Vui lòng chọn dự án"
        : !isValidRoom
        ? "Vui lòng chọn phòng họp để mở 3D Editor"
        : undefined,
    },
    {
      id: "equipment",
      label: "Thiết bị",
      href: "/equipment",
      icon: Cpu,
      isActive: isEquipmentActive,
      disabled: false,
    },
    {
      id: "library",
      label: "Thư viện",
      href: "/library",
      icon: Library,
      isActive: isLibraryActive,
      disabled: false,
    },
    {
      id: "reports",
      label: "Báo cáo",
      href: "/reports",
      icon: FileText,
      isActive: isReportsActive,
      disabled: false,
    },
    {
      id: "settings",
      label: "Cài đặt",
      href: "/settings",
      icon: Settings,
      isActive: isSettingsActive,
      disabled: false,
    },
  ];
}
