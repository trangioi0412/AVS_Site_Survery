# Implementation Plan: AV Survey 3D Planner (Interactive UI Prototype)

Building a modern enterprise 3D web application prototype for Audio Visual (AV) system site survey, room planning, infrastructure tracking, equipment layout, and 3D room editing.

## User Review Required

> [!NOTE]
> The prototype uses client-side Three.js & React Three Fiber with primitive box/cylinder geometries for high performance and zero external asset dependencies during Phase 1. 

## Proposed Architecture & Structure

```
d:\AVS_Site_Survey\
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── types/
│   │   ├── editor.ts
│   │   ├── equipment.ts
│   │   ├── infrastructure.ts
│   │   └── project.ts
│   ├── data/
│   │   ├── mock-project.ts
│   │   ├── mock-equipment.ts
│   │   ├── mock-scene.ts
│   │   └── mock-infrastructure.ts
│   ├── stores/
│   │   └── editor-store.ts
│   ├── lib/
│   │   ├── utils.ts
│   │   └── export-helpers.ts
│   └── components/
│       ├── app-shell/
│       │   ├── top-bar.tsx
│       │   ├── main-sidebar.tsx
│       │   └── bottom-toolbar.tsx
│       ├── editor/
│       │   ├── editor-layout.tsx
│       │   ├── viewport/
│       │   │   ├── three-viewport.tsx
│       │   │   ├── room-scene.tsx
│       │   │   ├── primitive-shapes.tsx
│       │   │   └── viewport-controls.tsx
│       │   ├── equipment-library/
│       │   │   └── equipment-library-panel.tsx
│       │   ├── layers-panel/
│       │   │   └── layers-panel.tsx
│       │   ├── properties-panel/
│       │   │   └── properties-panel.tsx
│       │   ├── survey-panel/
│       │   │   ├── infrastructure-table.tsx
│       │   │   ├── preview-panel.tsx
│       │   │   └── output-panel.tsx
│       │   └── viewport-toolbar/
│       │       └── viewport-floating-toolbar.tsx
│       └── ui/
│           ├── button.tsx
│           ├── input.tsx
│           ├── tabs.tsx
│           ├── badge.tsx
│           ├── card.tsx
│           ├── tooltip.tsx
│           └── sheet.tsx
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── next.config.js
```

## Key Modules & Responsibilities

1. **State Management (`stores/editor-store.ts`)**:
   - `objects`: SceneObject list (architecture, furniture, AV equipment, infrastructure)
   - `selectedObjectId`: active selected object
   - `editorMode`: `'select' | 'translate' | 'rotate' | 'scale' | 'measure' | 'note'`
   - `viewMode`: `'2d' | '3d'`
   - `snapEnabled`, `gridSize`, `showGrid`, `showHelpers`
   - Actions: `selectObject`, `addObject`, `updateObject`, `removeObject`, `toggleVisibility`, `toggleLock`, `setEditorMode`, `setViewMode`, `undo`, `redo`.

2. **3D Viewport (`components/editor/viewport/*`)**:
   - Dynamic client-only rendering with SSR loading fallback
   - React Three Fiber Canvas with custom camera controls (`PerspectiveCamera` for 3D, top-down view for 2D)
   - Ground plane reference, room shell (walls, floor, door frame)
   - Render primitive objects with status color coding:
     - `existing`: #22c55e (Green)
     - `proposed`: #8b5cf6 (Purple)
     - `remove`: #ef4444 (Red)
   - Interactive Raycasting click selection
   - TransformControls (Translate/Rotate/Scale) bound to selected object & store sync

3. **Top Navigation Bar (`components/app-shell/top-bar.tsx`)**:
   - Logo `AV Survey`
   - Project (`ABC Building`) & Room (`Meeting Room 501`) Selectors
   - Undo/Redo quick actions, Save Status (`Đã lưu 10:30`)
   - Share & Export options dropdown
   - User profile badge (`Admin`)

4. **Main Sidebar (`components/app-shell/main-sidebar.tsx`)**:
   - Collapsible panel (64px collapsed, 140px expanded)
   - Navigation links (Projects active, Survey, Rooms, Equipment, Library, Reports, Settings)

5. **Equipment Library Panel (`components/editor/equipment-library/*`)**:
   - Search & category filter tabs (All, AV, IT Network, Furniture)
   - Subcategories (Displays, Cameras, Speakers, Microphones, Racks, Network/Power Outlets)
   - Click to add equipment instance into 3D scene grid center

6. **Layers / Structure Panel (`components/editor/layers-panel/*`)**:
   - Tree view grouped by Architecture, Furniture, AV Equipment, Infrastructure
   - Visibility toggle (Eye icon), lock toggle, selection highlight, status badges

7. **Properties Panel (`components/editor/properties-panel/*`)**:
   - Info tab: Name, Model, Brand, Category, Installation position, Status selector
   - Position tab: Position X/Y/Z, Rotation X/Y/Z, Scale X/Y/Z, Mounting Height (2-decimal rounded)
   - Advanced tab: Specs (Resolution, PoE, Network IP, FOV, Power) based on object type

8. **Survey Data & Output Section (`components/editor/survey-panel/*`)**:
   - Existing Infrastructure Table (LAN, PWR, HDMI, Audio plates) with bidirectional scene selection
   - Viewport Preview & Screenshot snapshot generator (`canvas.toDataURL()`)
   - Output/Export actions (BOM list, Survey Report, 2D layout, 3D model)

9. **Bottom Toolbar (`components/app-shell/bottom-toolbar.tsx`)**:
   - Tool selection buttons, Snap toggle, Grid size adjustment (1.0m +/-), Toggle grid/helpers, Fit view.

## Verification Plan

### Automated Checks
- Run TypeScript compiler (`npx tsc --noEmit`) to verify 0 TS errors.
- Run `npm run build` or Next.js dev server verification.

### Manual Verification
- Test 3D interaction: Rotate camera, pan, zoom, click object to select.
- Test TransformControls: Drag object, verify Properties Panel position inputs update in real time.
- Test Property Edits: Change X/Y/Z inputs, status badge, or name, verify 3D scene updates immediately.
- Test Equipment Library: Click an AV item (e.g., PTZ Camera), verify object appears in 3D scene and Layers tree.
- Test Infrastructure Table: Click "LAN-01" row, verify object gets selected in 3D viewport.
- Test 2D/3D View Toggle: Switch between 3D perspective and 2D top-down view.
