"use client";

import React, { useState, useEffect, Suspense, Component, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { RoomScene } from "./room-scene";
import { ViewportFloatingToolbar } from "../viewport-toolbar/viewport-floating-toolbar";
import { Box, Loader2 } from "lucide-react";

// Error boundary as class component (React built-in, no extra package)
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}
class ViewportErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full bg-[#080d16] flex flex-col items-center justify-center text-center p-6 select-none">
          <Box className="w-12 h-12 mb-4" style={{ color: "#ef4444", opacity: 0.6 }} />
          <h3 className="text-sm font-semibold mb-2" style={{ color: "#f8fafc" }}>
            Không thể khởi tạo 3D Viewport
          </h3>
          <p className="text-xs max-w-sm leading-relaxed mb-3" style={{ color: "#94a3b8" }}>
            Trình duyệt có thể không hỗ trợ WebGL. Vui lòng dùng Chrome/Edge mới nhất và bật
            hardware acceleration.
          </p>
          {this.state.error && (
            <code
              className="text-[10px] font-mono px-2 py-1 rounded border max-w-xs truncate block"
              style={{ color: "#ef4444", background: "#111b2a", borderColor: "#24344b" }}
            >
              {this.state.error.message}
            </code>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Loading state before client mounts
function ViewportLoader() {
  return (
    <div className="w-full h-full bg-[#080d16] flex flex-col items-center justify-center select-none">
      <Loader2 className="w-10 h-10 animate-spin mb-3" style={{ color: "#3b82f6" }} />
      <span className="text-xs font-medium" style={{ color: "#f8fafc" }}>
        Đang khởi tạo 3D Viewport...
      </span>
      <span className="text-[11px] mt-1" style={{ color: "#94a3b8", opacity: 0.7 }}>
        React Three Fiber + Three.js WebGL Engine
      </span>
    </div>
  );
}

export const ThreeViewport: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <ViewportLoader />;
  }

  return (
    <div className="relative w-full h-full bg-[#080d16] overflow-hidden select-none">
      {/* Floating toolbar overlay */}
      <ViewportFloatingToolbar />

      {/* R3F Canvas with error boundary */}
      <ViewportErrorBoundary>
        <Canvas
          shadows
          gl={{
            preserveDrawingBuffer: true,
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
          }}
          dpr={[1, 1.5]}
          style={{ width: "100%", height: "100%", cursor: "default" }}
        >
          <Suspense fallback={null}>
            <RoomScene />
          </Suspense>
        </Canvas>
      </ViewportErrorBoundary>
    </div>
  );
};
