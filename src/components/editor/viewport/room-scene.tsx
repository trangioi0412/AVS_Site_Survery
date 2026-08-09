"use client";

import React, { useRef, useCallback } from "react";
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
  Grid,
  Environment,
} from "@react-three/drei";
import { useEditorStore } from "@/stores/editor-store";
import { SceneObjectItem } from "./scene-object-item";

export const RoomScene: React.FC = () => {
  const {
    objects,
    selectedObjectId,
    selectObject,
    viewMode,
    showGrid,
    gridSize,
  } = useEditorStore();

  const orbitRef = useRef<any>(null);

  // Click on ground plane to deselect
  const handleMissedClick = useCallback(() => {
    selectObject(null);
  }, [selectObject]);

  return (
    <>
      {/* Ambient + Directional Lights */}
      <ambientLight intensity={0.6} color="#b0c4de" />
      <directionalLight
        position={[8, 14, 8]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <directionalLight position={[-8, 8, -8]} intensity={0.35} color="#4080ff" />
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#ffffff" decay={2} />

      {/* Camera: Perspective for 3D, Orthographic top-down for 2D */}
      {viewMode === "3d" ? (
        <PerspectiveCamera
          makeDefault
          position={[11, 9, 13]}
          fov={42}
          near={0.1}
          far={500}
        />
      ) : (
        <OrthographicCamera
          makeDefault
          position={[0, 22, 0.001]}
          zoom={42}
          near={0.1}
          far={500}
        />
      )}

      {/* Orbit Controls */}
      <OrbitControls
        ref={orbitRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enableRotate={viewMode === "3d"}
        enablePan
        panSpeed={1.2}
        zoomSpeed={1.2}
        minDistance={2}
        maxDistance={40}
        maxPolarAngle={viewMode === "3d" ? Math.PI / 2 - 0.04 : 0.001}
        target={[0, 0, 0]}
      />

      {/* Ground reference grid */}
      {showGrid && (
        <Grid
          position={[0, -0.02, 0]}
          args={[24, 24]}
          cellSize={gridSize}
          cellThickness={0.6}
          cellColor="#1e3050"
          sectionSize={gridSize * 4}
          sectionThickness={1.2}
          sectionColor="#2a4a7f"
          fadeDistance={28}
          fadeStrength={1.2}
          infiniteGrid
        />
      )}

      {/* Invisible ground plane for click-to-deselect */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        onPointerDown={handleMissedClick}
        receiveShadow
      >
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#080d16" roughness={1} metalness={0} />
      </mesh>

      {/* All scene objects */}
      {objects.map((obj) => (
        <SceneObjectItem key={obj.id} object={obj} />
      ))}
    </>
  );
};
