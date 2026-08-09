"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditorStore } from "@/stores/editor-store";
import { Loader2 } from "lucide-react";

function HomeRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentProject, currentRoom } = useEditorStore();

  useEffect(() => {
    const proj = searchParams.get("project");
    const room = searchParams.get("room");

    if (proj && room) {
      router.replace(`/projects/${proj}/rooms/${room}/editor`);
    } else {
      router.replace("/dashboard");
    }
  }, [router, searchParams, currentProject, currentRoom]);

  return <HomeLoader />;
}

function HomeLoader() {
  return (
    <main className="w-screen h-screen flex flex-col items-center justify-center bg-[#080d16] text-white select-none">
      <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
      <p className="text-xs text-text-secondary font-mono">Đang chuyển hướng AVS Site Survey Planner...</p>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoader />}>
      <HomeRedirectContent />
    </Suspense>
  );
}
