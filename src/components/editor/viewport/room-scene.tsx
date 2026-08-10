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
      {/* Balanced Lighting System */}
      <ambientLight intensity={0.5} color="#e2e8f0" />
      <hemisphereLight args={["#f8fafc", "#1e293b", 0.6]} />
      <directionalLight
        position={[10, 16, 10]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={0.5}
        shadow-camera-far={60}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.45} color="#60a5fa" />
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#ffffff" decay={2} />

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
          position={[0, -0.01, 0]}
          args={[30, 30]}
          cellSize={gridSize}
          cellThickness={0.9}
          cellColor="#0284c7"
          sectionSize={gridSize * 4}
          sectionThickness={1.8}
          sectionColor="#38bdf8"
          fadeDistance={36}
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
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0b1320" roughness={1} metalness={0} />
      </mesh>

      {/* All scene objects */}
      {objects.map((obj) => (
        <SceneObjectItem key={obj.id} object={obj} />
      ))}
    </>
  );
};
