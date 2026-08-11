"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { ThreeEvent } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import { SceneObject } from "@/types/editor";
import { useEditorStore } from "@/stores/editor-store";

interface SceneObjectItemProps {
  object: SceneObject;
}

// Get display color based on object type, category, and status
function getObjectColor(object: SceneObject, isSelected: boolean): string {
  if (isSelected) return "#38bdf8"; // Vibrant sky blue selection

  // Architecture - distinct floor vs wall contrast
  if (object.category === "architecture") {
    if (object.type === "Floor") return "#334155"; // Clear slate floor plane
    if (object.type === "Wall") return "#cbd5e1";  // Light crisp wall tone
    if (object.type === "Door") return "#f59e0b";  // Warm wood/amber door
    if (object.type === "Ceiling") return "#1e293b";
    return "#64748b";
  }

  // Furniture - distinct wood/dark slate tones
  if (object.category === "furniture") {
    if (object.type === "Table") return "#475569";
    if (object.type === "Chair") return "#1e293b";
    return "#334155";
  }

  // Category-specific equipment color coding
  if (object.category === "display") return "#0284c7";       // Cyan Display
  if (object.category === "camera") return "#10b981";        // Emerald Camera
  if (object.category === "audio") return "#a855f7";         // Purple Audio
  if (object.category === "microphone") return "#f59e0b";    // Amber Mic
  if (object.category === "rack") return "#3b82f6";          // Royal Rack
  if (object.category === "infrastructure") return "#f97316"; // Orange Infrastructure

  // Status-based fallback colors
  if (object.status === "existing") return "#16a34a";   // green
  if (object.status === "proposed") return "#8b5cf6";   // purple
  if (object.status === "remove") return "#ef4444";     // red
  return object.color || "#38bdf8";
}

function getEmissiveColor(object: SceneObject, isSelected: boolean, isHovered: boolean): string {
  if (isSelected) return "#0284c7";
  if (isHovered) return "#2563eb";
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
    beginHistoryTransaction,
    commitHistoryTransaction,
    snapEnabled,
    gridSize,
  } = useEditorStore();

  const [isHovered, setIsHovered] = useState(false);
  const isSelected = selectedObjectId === object.id;
  const groupRef = useRef<any>(null);
  const isDraggingRef = useRef(false);

  // Cleanup interaction on unmount or when controls hide
  useEffect(() => {
    return () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        commitHistoryTransaction();
      }
    };
  }, [commitHistoryTransaction]);

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
  const emissiveColor = getEmissiveColor(object, isSelected, isHovered);

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
          setIsHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setIsHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[dim.width, dim.height, dim.depth]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={emissiveColor}
          emissiveIntensity={
            isSelected ? 0.45 : isHovered ? 0.25 : object.status === "proposed" ? 0.15 : 0.05
          }
          roughness={isFloor ? 0.9 : isMetal ? 0.2 : 0.6}
          metalness={isMetal ? 0.85 : 0.05}
          transparent={isArchitecture && object.type === "Wall"}
          opacity={isArchitecture && object.type === "Wall" ? 0.8 : 1}
        />
      </mesh>

      {/* Selection outline: wireframe highlight box */}
      {isSelected && (
        <mesh>
          <boxGeometry
            args={[dim.width + 0.06, dim.height + 0.06, dim.depth + 0.06]}
          />
          <meshBasicMaterial
            color="#38bdf8"
            wireframe
            transparent
            opacity={0.85}
          />
        </mesh>
      )}

      {/* Hover outline highlight */}
      {isHovered && !isSelected && (
        <mesh>
          <boxGeometry
            args={[dim.width + 0.04, dim.height + 0.04, dim.depth + 0.04]}
          />
          <meshBasicMaterial
            color="#60a5fa"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );

  if (showTransformControls) {
    const labelPrefix =
      editorMode === "translate"
        ? "Move"
        : editorMode === "rotate"
        ? "Rotate"
        : "Scale";

    return (
      <TransformControls
        mode={editorMode}
        size={0.75}
        translationSnap={snapEnabled ? gridSize : undefined}
        rotationSnap={snapEnabled ? Math.PI / 12 : undefined}
        onMouseDown={() => {
          isDraggingRef.current = true;
          beginHistoryTransaction(`${labelPrefix} object: ${object.name}`);
        }}
        onMouseUp={() => {
          if (isDraggingRef.current) {
            isDraggingRef.current = false;
            commitHistoryTransaction();
          }
        }}
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

