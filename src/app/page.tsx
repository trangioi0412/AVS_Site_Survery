import { EditorLayout } from "@/components/editor/editor-layout";
import { Toaster } from "sonner";

export default function Home() {
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
