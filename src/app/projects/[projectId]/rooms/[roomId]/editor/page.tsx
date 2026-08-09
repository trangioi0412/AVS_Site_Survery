"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { EditorLayout } from "@/components/editor/editor-layout";
import { useEditorStore } from "@/stores/editor-store";
import { Toaster } from "sonner";
import { Loader2 } from "lucide-react";

export default function DedicatedEditorPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = params?.projectId as string;
  const roomId = params?.roomId as string;

  const {
    projects,
    rooms,
    currentProject,
    currentRoom,
    switchProject,
    isHydrated,
    setHydrated,
  } = useEditorStore();

  // Safeguard: Ensure isHydrated is set on client mount if rehydration completed
  useEffect(() => {
    if (typeof window !== "undefined" && !isHydrated) {
      if (useEditorStore.persist?.hasHydrated?.()) {
        setHydrated(true);
      } else {
        // Ensure client-side mount resolves hydration
        setHydrated(true);
      }
    }
  }, [isHydrated, setHydrated]);

  useEffect(() => {
    if (!isHydrated || !projectId || !roomId) return;

    // 1. Validate target project
    const targetProj = projects.find((p) => p.id === projectId);
    if (!targetProj) {
      // Fallback to first available project
      const fallbackProj = projects[0];
      if (fallbackProj) {
        const fallbackRoom = rooms[fallbackProj.id]?.[0];
        if (fallbackRoom) {
          router.replace(`/projects/${fallbackProj.id}/rooms/${fallbackRoom.id}/editor`);
        } else {
          router.replace("/projects");
        }
      } else {
        router.replace("/projects");
      }
      return;
    }

    // 2. Validate target room in project
    const projectRooms = rooms[projectId] || [];
    const targetRoom = projectRooms.find((r) => r.id === roomId);

    if (!targetRoom) {
      // Fallback to first available room in target project
      const fallbackRoom = projectRooms[0];
      if (fallbackRoom) {
        router.replace(`/projects/${projectId}/rooms/${fallbackRoom.id}/editor`);
      } else {
        router.replace(`/projects/${projectId}`);
      }
      return;
    }

    // 3. Synchronize store state if different from active project/room
    if (currentProject?.id !== projectId || currentRoom?.id !== roomId) {
      switchProject(targetProj, roomId);
    }
  }, [
    isHydrated,
    projectId,
    roomId,
    projects,
    rooms,
    currentProject?.id,
    currentRoom?.id,
    switchProject,
    router,
  ]);

  if (!isHydrated) {
    return (
      <main className="w-screen h-screen flex flex-col items-center justify-center bg-[#080d16] text-white select-none">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-xs text-text-secondary font-mono">Đang nạp cấu hình 3D Editor...</p>
      </main>
    );
  }

  return (
    <main className="w-screen h-screen overflow-hidden" style={{ backgroundColor: "#080d16" }}>
      <Toaster
        position="top-right"
        theme="dark"
        richColors
        toastOptions={{
          style: {
            background: "#0d1420",
            border: "1px solid #24344b",
            color: "#f8fafc",
          },
        }}
      />
      <EditorLayout />
    </main>
  );
}
