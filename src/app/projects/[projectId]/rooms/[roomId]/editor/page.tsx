"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { EditorLayout } from "@/components/editor/editor-layout";
import { useEditorStore } from "@/stores/editor-store";
import { Toaster } from "sonner";

export default function DedicatedEditorPage() {
  const params = useParams();
  const projectId = params?.projectId as string;
  const roomId = params?.roomId as string;

  const { projects, rooms, currentProject, currentRoom, switchProject } = useEditorStore();

  useEffect(() => {
    if (projectId && roomId) {
      if (currentProject?.id !== projectId || currentRoom?.id !== roomId) {
        const targetProj = projects.find((p) => p.id === projectId);
        if (targetProj) {
          switchProject(targetProj, roomId);
        }
      }
    }
  }, [projectId, roomId, currentProject, currentRoom, projects, switchProject]);

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
