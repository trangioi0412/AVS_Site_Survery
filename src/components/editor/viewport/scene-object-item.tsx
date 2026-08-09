"use client";

import React, { useRef, useCallback } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { SceneObject } from "@/types/editor";
import { useEditorStore } from "@/stores/editor-store";

interface SceneObjectItemProps {
  object: SceneObject;
}

// Get display color based on object type and status
function getObjectColor(object: SceneObject, isSelected: boolean): string {
  if (isSelected) return "#3b82f6";

  // Architecture - dark neutral
  if (object.category === "architecture") {
    if (object.type === "Floor") return "#111827";
    if (object.type === "Wall") return "#1e293b";
    if (object.type === "Door") return "#334155";
    if (object.type === "Ceiling") return "#0f172a";
    return "#1e293b";
  }

  // Furniture - slate
  if (object.category === "furniture") {
    if (object.type === "Table") return "#2d3f55";
    if (object.type === "Chair") return "#374151";
    return "#374151";
  }

  // Equipment - status-based colors
  if (object.status === "existing") return "#16a34a";   // green
  if (object.status === "proposed") return "#7c3aed";   // purple
  if (object.status === "remove") return "#dc2626";     // red
  return object.color || "#475569";
}

function getEmissiveColor(object: SceneObject, isSelected: boolean): string {
  if (isSelected) return "#1d4ed8";
  if (object.status === "proposed") return "#4c1d95";
  if (object.status === "existing") return "#14532d";
  return "#000000";
}

export const SceneObjectItem: React.FC<SceneObjectItemProps> = ({ object }) => {
  const {
    selectedObjectId,
    selectObject,
    editorMode,
    updateObject,
    snapEnabled,
    gridSize,
  } = useEditorStore();

  const isSelected = selectedObjectId === object.id;
  const groupRef = useRef<any>(null);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      selectObject(object.id);
    },
    [object.id, selectObject]
  );

  if (!object.visible) return null;

  const dim = object.dimensions || { width: 1, height: 1, depth: 1 };
  const baseColor = getObjectColor(object, isSelected);
  const emissiveColor = getEmissiveColor(object, isSelected);

  const isArchitecture = object.category === "architecture";
  const isMetal = object.category === "rack" || object.type?.includes("Rack");
  const isFloor = object.type === "Floor";

  const isTransformableMode =
    editorMode === "translate" || editorMode === "rotate" || editorMode === "scale";
  const showTransformControls =
    isSelected && !object.locked && isTransformableMode && !isFloor;

  const meshContent = (
    <group
      ref={groupRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
    >
      {/* Main mesh */}
      <mesh
        castShadow={!isFloor && !isArchitecture}
        receiveShadow
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[dim.width, dim.height, dim.depth]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={
            isSelected ? 0.35 : object.status === "proposed" ? 0.12 : 0.04
          }
          roughness={isMetal ? 0.2 : 0.7}
          metalness={isMetal ? 0.8 : 0.05}
          transparent={isArchitecture && object.type === "Wall"}
          opacity={isArchitecture && object.type === "Wall" ? 0.85 : 1}
        />
      </mesh>

      {/* Selection outline: wireframe highlight box */}
      {isSelected && (
        <mesh>
          <boxGeometry
            args={[dim.width + 0.06, dim.height + 0.06, dim.depth + 0.06]}
          />
          <meshBasicMaterial
            color="#60a5fa"
            wireframe
            transparent
            opacity={0.7}
          />
        </mesh>
      )}

      {/* Edge highlight ring for proposed equipment */}
      {object.status === "proposed" && !isSelected && (
        <mesh>
          <boxGeometry
            args={[dim.width + 0.04, dim.height + 0.04, dim.depth + 0.04]}
          />
          <meshBasicMaterial
            color="#8b5cf6"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );

  if (showTransformControls) {
    return (
      <TransformControls
        mode={editorMode}
        size={0.75}
        translationSnap={snapEnabled ? gridSize : undefined}
        rotationSnap={snapEnabled ? Math.PI / 12 : undefined}
        onObjectChange={() => {
          if (groupRef.current) {
            const target = groupRef.current;
            updateObject(object.id, {
              position: [
                Number(target.position.x.toFixed(2)),
                Number(target.position.y.toFixed(2)),
                Number(target.position.z.toFixed(2)),
              ],
              rotation: [
                Number(target.rotation.x.toFixed(2)),
                Number(target.rotation.y.toFixed(2)),
                Number(target.rotation.z.toFixed(2)),
              ],
              scale: [
                Number(target.scale.x.toFixed(2)),
                Number(target.scale.y.toFixed(2)),
                Number(target.scale.z.toFixed(2)),
              ],
            });
          }
        }}
      >
        {meshContent}
      </TransformControls>
    );
  }

  return meshContent;
};

