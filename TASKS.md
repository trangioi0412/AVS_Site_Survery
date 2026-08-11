# Danh sách Task — AVS Site Survey 3D Planner

## Roadmap Tổng Thể
- **TASK-001**: Project/Room/Scene isolation (✅ Completed & Verified)
- **TASK-001B**: Hardening & Verification (✅ Completed & Verified)
- **TASK-002**: App Shell, Routing & Management Pages (✅ Completed & Verified)
- **TASK-002B**: Navigation, Editor Route & Scene Switching Integration Audit (✅ Completed & Verified)
- **TASK-002D**: Unified Sidebar, Project/Room Context Navigation, Dynamic Route Resolution & Workflow Integration (✅ Completed & Verified)
- **TASK-003A**: Transactional Undo/Redo Foundation (✅ Completed & Verified by User)
- **TASK-003A.01**: Transactional Undo/Redo Hardening — Corrective Revision (⏳ Pending browser verification)
- **TASK-003B**: Measurement Tool
- **TASK-003C**: Annotation Tool
- **TASK-003D**: Editor Tools & Integration Hardening
- **TASK-004**: GLTF/GLB Asset Loader
- **TASK-005**: PDF/Excel/Snapshot Reporting
- **TASK-006**: Backend, Authentication & Cloud Sharing

---

## [COMPLETED] TASK-001B — Hardening & Nghiệm Thu TASK-001

### Trạng thái: ✅ ĐÃ HOÀN THÀNH

### Các hạng mục đã thực hiện:
1. **Hydration & Migration Safety**:
   - Cấu hình `migrate()` v1 và `normalizePersistedState` trong `src/stores/editor-store.ts`.
   - Fallback an toàn khi `localStorage` rỗng, bị corrupt hoặc thiếu `dimensions`/`sceneObjects`.
2. **Empty Room Scene Initialization**:
   - Tự động sinh 3D scene kiến trúc mới bằng `createArchitecturalScene` cho room trống và lưu ngược ngay vào store map.
3. **Automated Unit Testing**:
   - Cài đặt `vitest` và tạo test suite `tests/store.test.ts` (5 tests pass 100%).
4. **GitHub Actions CI Workflow**:
   - Khởi tạo `.github/workflows/ci.yml` tự động chạy `lint`, `test`, `build`.

---

## [COMPLETED] TASK-002 — App Shell, Routing và Management Pages

### Trạng thái: ✅ ĐÃ HOÀN THÀNH

### Các hạng mục đã thực hiện:
1. **App Shell Dùng Chung**:
   - Xây dựng `AppLayout`, `AppSidebar`, `AppHeader` linh hoạt theo `usePathname()`, hỗ trợ thu gọn sidebar, breadcrumb động và modal tạo dự án nhanh.
2. **Hệ Thống Routing Next.js App Router (11 Routes)**:
   - `/` ➔ Redirect tự động sang `/dashboard` hoặc bọc URL query parameters cũ sang Editor mới.
   - `/dashboard` ➔ Bảng tổng quan KPI, dự án gần đây, quick actions.
   - `/projects` ➔ Danh sách dự án (Search, Filter status, Sort, Create Project modal).
   - `/projects/[projectId]` ➔ Chi tiết dự án, thêm phòng họp mới, khởi chạy khảo sát.
   - `/projects/[projectId]/survey` ➔ Quy trình khảo sát 9 bước (Wizard form, Save draft, Sync kích thước 3D).
   - `/projects/[projectId]/rooms/[roomId]` ➔ Chi tiết phòng, tính diện tích sàn động `width * length m²`, thống kê thiết bị proposed/existing.
   - `/projects/[projectId]/rooms/[roomId]/editor` ➔ Dedicated 3D Editor toàn màn hình cho đúng Project & Room.
   - `/equipment` ➔ Quản lý danh mục thiết bị (Search, Filter category, Add equipment modal).
   - `/library` ➔ Thư viện Asset & Trạng thái 3D Model (`Mesh Procedural` vs `GLTF Loader TASK-004`).
   - `/reports` ➔ Quản lý báo cáo (Xuất BOM CSV & 3D JSON tên file động `<Project>-<Room>-<Type>`, nút PDF/Excel "Sắp có (TASK-005)").
   - `/settings` ➔ Cài đặt đơn vị đo (m/mm), Grid/Snap size, Confirmation modal làm sạch Local Storage.

---

## [COMPLETED] TASK-002B — Navigation, Editor Route và Scene Switching Integration Audit

### Trạng thái: ✅ ĐÃ HOÀN THÀNH

### Các hạng mục đã thực hiện:
1. **Sửa Sidebar Navigation**:
   - Thay thế toàn bộ thẻ `<button>` tĩnh trong `MainSidebar` (`src/components/app-shell/main-sidebar.tsx`) bằng thẻ `<Link>` Next.js thực sự.
   - Active state được tính toán động dựa theo `usePathname()`, không hard-code `active: true`.
2. **Chuẩn hóa Single Source of Truth cho 3D Editor**:
   - Dynamic route `/projects/[projectId]/rooms/[roomId]/editor` là nguồn chuẩn duy nhất cho Project và Room context trong Editor.
   - Gỡ bỏ `useEffect` đọc `window.location.search` (`initFromUrl`) trong `EditorLayout`, triệt tiêu hoàn toàn race condition và xung đột 2 nguồn state.
3. **Phân Tách Router & Zustand Store**:
   - Tách biệt hoàn toàn trách nhiệm giữa Next.js Router và Zustand Store.
   - Dropdown chọn Project và Room trong `TopBar` sử dụng `router.push('/projects/${targetProjId}/rooms/${targetRoomId}/editor')` để trình duyệt đổi route chuẩn.
4. **Automated Integration Testing**:
   - Xây dựng test suite `tests/navigation-integration.test.ts` kiểm thử chuyển Project/Room, scene isolation, route fallback và store hydration.


---

## [COMPLETED] TASK-002D — Hoàn thiện Project/Room Workflow và Editor UI Integration

### Trạng thái: ✅ ĐÃ HOÀN THÀNH

### Các hạng mục đã thực hiện:
1. **Sửa Điều Hướng Sidebar "Phòng"**:
   - Khởi tạo trang quản lý danh sách phòng họp theo dự án `/projects/[projectId]/rooms/page.tsx`.
   - Cập nhật link "Phòng" trên `MainSidebar` trỏ tới `/projects/${projId}/rooms`, giữ trạng thái active mượt mà khi người dùng làm việc trong dự án.
2. **Chuẩn Hóa & Edit Project Status Workflow**:
   - Định nghĩa union type `ProjectStatus`: `"survey" | "drafting" | "pending_approval" | "approved" | "completed"`.
   - Bổ sung action `updateProjectStatus(projectId, status)` trong `editor-store.ts` và tự động normalize giá trị legacy (`"surveying"`, `"planning"`).
   - Thêm dropdown selector chọn trạng thái dự án thực sự tương tác tại thẻ danh sách dự án (`/projects`), trang chi tiết (`/projects/[projectId]`) và `TopBar`.
3. **Làm Rõ Chức Năng Export Scene JSON Payload**:
   - Chuẩn hóa payload `SceneExportPayload` gồm thông tin dự án, thông tin phòng họp (kèm chiều rộng, chiều dài, chiều cao), mảng `sceneObjects` sạch và ISO timestamp.
   - Chuẩn hóa tên file xuất theo định dạng `<project-name>_<room-name>_scene_<date>.json` với hàm `sanitizeFilename`.
   - Cập nhật nhãn UI "Xuất dữ liệu Scene (.json)" và chú thích rõ ràng đây không phải file mô hình 3D GLB/GLTF.
4. **Cải Thiện Khả Năng Quan Sát 3D Scene Visual Contrast & Grid**:
   - Đổi tone màu nền Canvas thành Slate tối `#0b1320`.
   - Cân bằng hệ thống chiếu sáng với `hemisphereLight`, `ambientLight`, `directionalLight` chính 1.5 castShadow bias `-0.0001` và `directionalLight` phụ `#60a5fa`.
   - Grid cyan `#0284c7` kết hợp section lines `#38bdf8`, độ dày nét chuẩn và bề mặt sàn `#334155` tương phản nổi bật tường `#cbd5e1` (opacity 0.8).
   - Phân loại màu sắc thiết bị chuẩn theo nhóm (Display cyan `#0284c7`, Camera emerald `#10b981`, Audio purple `#a855f7`, Mic amber `#f59e0b`, Rack blue `#3b82f6`, Infra orange `#f97316`).
   - Wireframe selection highlight xanh cyan `#38bdf8` và hover emission effect `#2563eb`.
5. **Modal Viewport Overlay Độc Lập bằng PortalModal**:
   - Xây dựng component `PortalModal` sử dụng `React.createPortal(..., document.body)` thoát khỏi stacking context của TopBar/AppShell.
   - Hỗ trợ full viewport fixed backdrop `z-[9999]`, scroll locking `document.body.style.overflow = "hidden"`, gõ phím `Escape` đóng modal và `e.stopPropagation()`.
   - Áp dụng `PortalModal` đồng bộ cho toàn bộ modal trong `TopBar`, `EquipmentPage`, `ProjectsPage`, `ProjectDetailPage` và `RoomsPage`.
7. **Unified App Shell, Sidebar & Project/Room Context Navigation Integration**:
   - Tái cấu trúc kiến trúc `EditorLayout` thống nhất với `AppLayout`: `AppSidebar` nằm ở cột bên trái ngoài cùng (chiều cao 100vh), `TopBar` nằm trong cột nội dung bên phải sidebar.
   - Loại bỏ logo `AV Survey 3D` và nút toggle lặp lại khỏi `TopBar`, đảm bảo chỉ xuất hiện duy nhất **1 Logo Brand** ở đỉnh của `AppSidebar`.
   - Hợp nhất hai sidebar `AppSidebar` và `MainSidebar` thành một `AppSidebar` duy nhất cho toàn bộ hệ thống.
   - Xây dựng `src/lib/navigation-utils.ts` với `resolveNavigationContext` và `getNavigationItems` ưu tiên Dynamic Route URL parameters (`/projects/:projectId/rooms/:roomId/editor`) hơn store state legacy.
   - Loại bỏ toàn bộ các fallback mock IDs (`project-abc-building`, `room-101`) trong giao diện navigation.
   - Sửa triệt để active state cho mục "Phòng" (`/projects/[projectId]/rooms`) và "3D Editor" (`/projects/[projectId]/rooms/[roomId]/editor`), loại bỏ hoàn toàn lỗi nhận nhầm thành "Dự án".
   - Tự động xử lý an toàn trạng thái `disabled` kèm lý do rõ ràng khi dữ liệu chưa hydration hoặc chưa chọn Project/Room hợp lệ.
8. **Automated Testing & Build Verification**:
   - Tạo test suite `tests/task-002d-unified-navigation.test.ts` (8 tests) kiểm tra toàn bộ 8 kịch bản điều hướng, active state, dynamic route priority, hydration safety và persistence integrity.
   - `npm test`: Pass 100% (26/26 Vitest tests passed trong 5 test files).
   - `npx tsc --noEmit`: Pass 100% (0 errors).
   - `npm run lint`: Pass 100% (0 warnings, 0 errors).
   - `npm run build`: Build thành công 100% (13 static/dynamic routes generated).

---

### HOTFIX TASK-002D.1 — Infrastructure Table Sticky Header

* **Trạng thái**: ✅ Complete (Nghiệm thu thành công)
* **Nguyên nhân gốc**:
  * Header dùng nền bán trong suốt (`bg-surface-2/80`).
  * Sticky đặt trên `<thead>`.
  * Scroll container thiếu ràng buộc flex cần thiết (`shrink-0`, `min-h-0`, `relative`).
* **Cách sửa**:
  * Thêm `shrink-0` cho header/filter.
  * Thêm `relative`, `min-h-0` và `overscroll-contain` cho scroll container.
  * Chuyển `sticky` xuống từng `<th>`.
  * Sử dụng nền `bg-surface-2` đặc.
* **Browser test**: PASS — người dùng đã xác nhận.
* **Verification**:
  * `npm run lint`: Pass 100%
  * `npm test`: Pass 100% (26/26 Vitest tests passed)
  * `npx tsc --noEmit`: Pass 100% (0 errors)
  * `npm run build`: Pass 100%
  * `git diff --check`: Pass 100%

---

## TASK-003A — Transactional Undo/Redo Foundation

* **Trạng thái**: ✅ PASS — Người dùng đã xác nhận kiểm thử trình duyệt
* **Nguyên nhân gốc**:
  * Prior history chỉ lưu `SceneObject[][]`, thiếu `dimensions` và metadata thao tác.
  * Chỉ `addObject` và `removeObject` ghi history snapshot; `updateObject`, `toggleVisibility`, `toggleLock`, `updateRoomDimensions` không có history.
  * `TransformControls` và `PropertiesPanel` gọi `updateObject()` liên tục trên từng frame/keystroke gây spam history nếu không dùng transaction.
  * Hydration, project/room switching và `resetLocalStorage` chưa tạo baseline history mới độc lập.
  * Selection không an toàn khi Undo/Redo làm mất object.
  * Phím tắt `Ctrl+Z`/`Ctrl+Y` can thiệp vào input/textarea/modal.
* **Kiến trúc dữ liệu**:
  * `EditorSnapshot`: Lưu cả `objects: SceneObject[]` và `dimensions: RoomDimensions`.
  * `HistoryEntry`: Lưu `id`, `label`, `timestamp` và `snapshot`.
  * `HistoryTransaction`: Lưu `label`, `before` snapshot và `wasDirty` state.
* **Vòng đời Transaction & Baseline**:
  * Transaction API: `beginHistoryTransaction(label)`, `commitHistoryTransaction()`, `cancelHistoryTransaction({ restore })`.
  * Single-step actions: `addObject`, `removeObject`, `toggleVisibility`, `toggleLock`, `updateRoomDimensions`, `updateObjectWithHistory`.
  * Baseline lifecycle: Tự động reset 1 entry baseline tại `historyIndex = 0` khi khởi tạo, hydration, switch room, switch project, create project, reset localStorage.
  * Redo branch truncation: Xóa branch redo khi có thao tác mới sau Undo.
  * History Limit: Khống chế tối đa `MAX_HISTORY_ENTRIES = 100`.
  * Shortcut Safety: Ngăn chặn Editor Undo/Redo shortcut khi focus đang nằm trong `input`, `textarea`, `select`, `[contenteditable]` hoặc modal.
* **Kết quả test thực tế**:
  * `npm run lint`: Pass 100% (0 errors, 0 warnings).
  * `npm test`: Pass 100% (41/41 Vitest tests passed trong 6 test files).
  * `npx tsc --noEmit`: Pass 100% (0 errors).
  * `npm run build`: Pass 100% (13 static/dynamic routes generated).
  * `git diff --check`: Pass 100%.

---

## TASK-003A.01 — Transactional Undo/Redo Hardening — Corrective Revision

* **Trạng thái**: ⏳ Pending browser verification
* **Nguyên nhân hotfix ban đầu (Pre-corrective)**:
  * `TransformControls` khi mất khả dụng đột ngột (deselection, lock, unmount, scene switch) có thể để transaction bị treo trong store.
  * Nested transaction trong `beginHistoryTransaction` capture giá trị `isDirty` từ biến đã lưu trước khi `commitHistoryTransaction` chạy, làm sai trạng thái `wasDirty`.
  * `cancelHistoryTransaction({ restore: true })` chưa đồng bộ lại Room tương ứng trong `rooms[currentProject.id]`.
* **Vấn đề phát hiện trong corrective review**:
  * Transaction API không có token ownership: bất kỳ caller nào cũng có thể commit/cancel transaction của caller khác.
  * Single-step actions như `addObject`, `removeObject` gọi `set({ activeHistoryTransaction: null })` trực tiếp thay vì resolve qua token.
  * No-op commit chỉ set `activeHistoryTransaction: null` mà không restore `isDirty` về `wasDirty`, gây sai trạng thái dirty.
  * `cancelHistoryTransaction({ restore: true })` tạo `updatedRoom` và sử dụng cùng object reference cho cả `currentRoom` lẫn room map entry — vi phạm reference independence.
  * `useEffect` cleanup trong `scene-object-item.tsx` không có cơ chế phát hiện gizmo bị ẩn (deselect/mode switch khi đang drag).
* **Các điểm gia cố corrective**:
  * **Token Ownership**: `HistoryTransaction` thêm `id` (unique token), `projectId`, `roomId`. `beginHistoryTransaction` trả về token. `commitHistoryTransaction(token)` và `cancelHistoryTransaction(token, options)` yêu cầu token hợp lệ — mismatch bị bỏ qua.
  * **Cross-Scene Safety**: `commitHistoryTransaction` kiểm tra `projectId`/`roomId` trước khi chấp nhận, loại bỏ cross-scene stale cleanup.
  * **No-op isDirty Fix**: Cả commit và cancel đều restore `isDirty = activeHistoryTransaction.wasDirty` khi no-op, không còn reset sai.
  * **Reference Independence**: `cancelHistoryTransaction({ restore: true })` tạo 2 clone độc lập: một cho `currentRoom.sceneObjects`, một cho room map entry.
  * **showTransformControls Cleanup Effect**: Thêm `useEffect` thứ hai theo dõi `showTransformControls` — khi gizmo bị ẩn (deselect hoặc mode switch khi đang drag), transaction được commit với đúng token.
  * **PropertiesPanel**: Thêm `txnTokenRef` để lưu token giữa `handleInputFocus` và `handleInputBlur`.
  * **Token Tests**: Mở rộng test suite lên 23 tests (thêm 7.5 → 7.8 kiểm tra stale token, no-op isDirty, token uniqueness).
* **Kết quả kiểm thử thực tế**:
  * `npm run lint`: Pass 100% (0 errors, 0 warnings).
  * `npm test`: Pass 100% (49/49 Vitest tests passed trong 6 test files).
  * `npx tsc --noEmit`: Pass 100% (0 errors).
  * `npm run build`: Pass 100% (13 static/dynamic routes generated).
  * `git diff --check`: Pass 100%.
