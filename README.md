# AV Survey 3D Planner

Ứng dụng web nội bộ dành cho kỹ sư Audio Visual (AV) dùng để khảo sát công trình, quản lý phòng họp, bố trí thiết bị AV và dựng mô hình 3D không gian phòng họp.

## Mục tiêu sản phẩm

- Quản lý dự án khảo sát công trình AV
- Tổng hợp dữ liệu khảo sát theo từng phòng
- Ghi nhận kích thước phòng, vị trí mạng, điện và hạ tầng AV
- Dựng mô hình 3D phòng họp, kéo thả và bố trí thiết bị AV
- Phân biệt trạng thái thiết bị: Hiện có (Existing) vs. Đề xuất (Proposed)
- Xuất báo cáo khảo sát, BOM thiết bị và ảnh bố trí mặt bằng

---

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Framework | Next.js 14 (App Router) |
| Ngôn ngữ | TypeScript |
| UI Styling | Tailwind CSS (Dark Enterprise Theme) |
| State Management | Zustand |
| 3D Engine | Three.js + React Three Fiber + @react-three/drei |
| Icon Library | Lucide React |
| Toast Notification | Sonner |
| Form Validation | React Hook Form + Zod |

---

## Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm >= 9.0.0

### Bước 1: Cài đặt dependency

```bash
npm install --legacy-peer-deps
```

### Bước 2: Khởi chạy máy chủ phát triển

```bash
npm run dev
```

Ứng dụng sẽ khởi chạy tại: **http://localhost:3000**

### Build production (nếu cần)

```bash
npm run build
npm run start
```

---

## Cấu trúc thư mục

```
src/
├── app/
│   ├── layout.tsx          # Root layout (dark theme, SEO metadata)
│   ├── page.tsx            # Home page
│   └── globals.css         # CSS design tokens (màu sắc, scrollbar, font)
│
├── types/
│   ├── editor.ts           # SceneObject, EditorMode, ViewMode, ObjectStatus
│   ├── equipment.ts        # EquipmentItem, InfrastructureItem, Project, Room
│   └── three-jsx.d.ts      # Type declarations cho React Three Fiber JSX elements
│
├── data/
│   ├── mock-project.ts     # Thông tin dự án mẫu (ABC Building, Meeting Room 501)
│   ├── mock-equipment.ts   # Thư viện thiết bị AV (12+ loại thiết bị)
│   ├── mock-scene.ts       # Các đối tượng 3D ban đầu trong phòng mẫu
│   └── mock-infrastructure.ts # Bảng hạ tầng mạng/điện/AV hiện có
│
├── stores/
│   └── editor-store.ts     # Zustand central editor state store
│
├── lib/
│   ├── utils.ts            # Helper class merge, number formatting
│   └── export-helpers.ts   # Xuất file JSON, tổng hợp BOM
│
└── components/
    ├── app-shell/
    │   ├── top-bar.tsx         # Top navigation bar (56px)
    │   ├── main-sidebar.tsx    # Main sidebar navigation (collapsible)
    │   └── bottom-toolbar.tsx  # Bottom tools, grid & snap controls
    │
    └── editor/
        ├── editor-layout.tsx   # Full page layout assembly
        ├── equipment-library/
        │   └── equipment-library-panel.tsx  # AV equipment library & click-to-add
        ├── layers-panel/
        │   └── layers-panel.tsx             # Scene hierarchy tree view
        ├── properties-panel/
        │   └── properties-panel.tsx         # Object properties (Info/Position/Advanced tabs)
        ├── survey-panel/
        │   ├── infrastructure-table.tsx     # Infrastructure survey data table
        │   ├── preview-panel.tsx            # 3D canvas snapshot & download
        │   └── output-panel.tsx             # Report export actions
        ├── viewport-toolbar/
        │   └── viewport-floating-toolbar.tsx # 2D/3D switcher & transform tools
        └── viewport/
            ├── three-viewport.tsx        # Client-side Three.js Canvas container
            ├── room-scene.tsx            # R3F scene: camera, lights, controls, objects
            └── scene-object-item.tsx     # Primitive box mesh object renderer
```

---

## Các tính năng đã hoàn thành (Phase 1)

### App Shell
- [x] Top navigation bar với Project/Room selector, Undo/Redo, Save status, Export dropdown, User profile
- [x] Main sidebar điều hướng thu gọn/mở rộng (64px ↔ 140px)
- [x] Bottom toolbar với tool selector, snap toggle, grid size controls, fit view

### 3D Room Editor
- [x] Dựng phòng họp mẫu Meeting Room 501 (8m × 12m × 3.2m) bằng primitive geometry
- [x] Ánh sáng ambient + directional với bóng đổ
- [x] OrbitControls: xoay, zoom, pan góc nhìn 3D
- [x] Click chọn đối tượng qua raycasting, bỏ chọn khi click vùng trống
- [x] Highlight đối tượng đang được chọn (viền wireframe xanh)
- [x] PivotControls di chuyển đối tượng bằng chuột
- [x] Chuyển đổi góc nhìn 3D Perspective ↔ 2D Orthographic top-down
- [x] Floor Grid tham chiếu với kích thước có thể điều chỉnh

### Equipment Library
- [x] 12 loại thiết bị AV/IT/Nội thất với icon Lucide
- [x] Tìm kiếm theo tên, brand, model
- [x] Tabs lọc: Tất cả, AV, IT Network, Nội thất
- [x] Click thiết bị → thêm object mới vào scene 3D với toast xác nhận

### Scene Layers Panel
- [x] Cấu trúc cây: Architecture / Furniture / AV Equipment / Infrastructure
- [x] Expand/collapse từng nhóm
- [x] Badge trạng thái màu Existing (xanh lá) / Proposed (tím) / Remove (đỏ)
- [x] Nút ẩn/hiện đối tượng (Eye icon)
- [x] Nút khóa vị trí (Lock icon)
- [x] Click chọn object từ danh sách, đồng bộ viewport

### Properties Panel
- [x] **Tab Thông tin**: Tên, Brand, Model, Vị trí lắp đặt, Ghi chú khảo sát, Trạng thái thiết bị (4 loại)
- [x] **Tab Vị trí**: Position X/Y/Z (m), Rotation X/Y/Z (°), Scale X/Y/Z, Chiều cao so với sàn
- [x] Thay đổi giá trị Position → object di chuyển tức thì trên viewport
- [x] **Tab Nâng cao**: Độ phân giải, Công suất, IP Address, Chuẩn kết nối

### Survey Data
- [x] Bảng hạ tầng hiện có (LAN, PWR, HDMI, Audio) với tabs lọc
- [x] Click dòng trong bảng → chọn object tương ứng trong 3D viewport
- [x] Preview panel: chụp ảnh Canvas 3D, tải ảnh PNG
- [x] Output panel: nút xuất BOM, JSON, báo cáo PDF (với toast thông báo WIP)

### Zustand Editor Store
- [x] SceneObject type đầy đủ (id, name, category, status, position, rotation, scale, metadata...)
- [x] Undo/Redo với history stack
- [x] Actions: selectObject, addObject, updateObject, removeObject, toggleVisibility, toggleLock
- [x] View controls: setViewMode, setEditorMode, toggleSnap, setGridSize, toggleGrid, toggleHelpers

---

## Trạng thái dữ liệu

| Tính năng | Trạng thái |
|---|---|
| Thông tin dự án (project, room) | Mock data |
| Thư viện thiết bị AV | Mock data |
| Đối tượng trong phòng 3D | Mock data |
| Bảng hạ tầng khảo sát | Mock data |
| Xuất JSON scene | ✅ Hoạt động |
| Xuất BOM PDF/Excel | Placeholder (WIP) |
| Backend API | Chưa tích hợp |
| Authentication | Chưa tích hợp |

---

## Hạn chế giai đoạn đầu (Phase 1)

1. **Geometry**: Tất cả đối tượng 3D dùng hình hộp BoxGeometry. Chưa load model GLTF/GLB thực tế.
2. **TransformControls**: Sử dụng PivotControls từ `@react-three/drei` cho phép di chuyển, nhưng kéo chuột chưa tối ưu 100% với OrbitControls đồng thời.
3. **Mobile**: Giao diện editor được tối ưu cho màn hình desktop ≥ 1366px. Trên mobile hiển thị thông báo.
4. **Backend**: Chưa kết nối API hoặc database thật. Toàn bộ dữ liệu là mock data trong RAM.
5. **Xuất file**: JSON scene có thể tải về. PDF/Excel/GLB là placeholder hiển thị toast "đang phát triển".

---

## Bước phát triển tiếp theo (Phase 2)

1. **GLTF Model Loader**: Tích hợp `GLTFLoader` để render mô hình 3D thực tế cho từng loại thiết bị AV
2. **Cable Routing**: Vẽ đường dây cáp kết nối giữa thiết bị và điểm hạ tầng
3. **Backend API**: Node.js/Express + PostgreSQL để lưu trữ dự án, phòng và thiết bị
4. **Authentication**: Đăng nhập theo vai trò (Admin / Kỹ sư khảo sát / Người xem)
5. **Xuất báo cáo thật**: Tích hợp thư viện tạo PDF, Excel và xuất file GLTF/GLB

---

## Giao diện màu sắc (Dark Engineering Theme)

```css
--background:    #080d16   /* Nền chính */
--surface-1:     #0d1420   /* Panel nền */
--surface-2:     #111b2a   /* Panel lớp 2 */
--surface-3:     #162234   /* Panel lớp 3 */
--border:        #24344b   /* Viền phân cách */
--primary:       #3b82f6   /* Màu chủ đạo (xanh kỹ thuật) */
--existing:      #22c55e   /* Màu thiết bị Hiện có */
--proposed:      #8b5cf6   /* Màu thiết bị Đề xuất */
```
