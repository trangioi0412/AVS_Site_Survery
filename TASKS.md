# Danh sách Task — AVS Site Survey 3D Planner

## Roadmap Tổng Thể
- **TASK-001**: Project/Room/Scene isolation (✅ Completed & Verified)
- **TASK-001B**: Hardening & Verification (✅ Completed & Verified)
- **TASK-002**: App Shell, Routing & Management Pages (✅ Completed & Verified)
- **TASK-002B**: Navigation, Editor Route & Scene Switching Integration Audit (✅ Completed & Verified)
- **TASK-003**: Undo/Redo, Measurement, Annotation & Editor Tools
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
   - Dropdown chọn Project và Room trong `TopBar` sử dụng `router.push('/projects/${targetProjId}/rooms/${targetRoomId}/editor')` để trình duyệt đổi route chuẩn, sau đó `DedicatedEditorPage` đồng bộ vào store sau khi `isHydrated === true`.
4. **Hydration & Fallback Safe Route Validation**:
   - Trong `DedicatedEditorPage`, hệ thống chờ `isHydrated === true` trước khi validate `projectId` và `roomId`.
   - Nếu `projectId` hoặc `roomId` không tồn tại hoặc sai lệch, hệ thống tự động thực hiện controlled fallback redirect về project/room hợp lệ gần nhất mà không gây crash hay lặp vô hạn.
5. **Lưu Trữ Fallback Scene Ngược Vào Persistence**:
   - Khi chuyển sang phòng trống chưa có `sceneObjects`, 3D scene kiến trúc mới được khởi tạo và lưu ngay ngược lại vào mảng `rooms[projectId]`, ngăn chặn việc tái sinh scene hoặc trùng lặp tường.
6. **Audit Toolbars & Dynamic Metrics**:
   - Tính toán diện tích sàn phòng họp động `${width * length} m² (${width}m x ${length}m)` trong `BottomToolbar`.
   - Gắn nhãn minh bạch "(Sắp có - TASK-003)" cho nút Fit View, Đo khoảng cách, Ghi chú chưa thuộc phạm vi TASK-002B.
7. **Automated Integration Testing**:
   - Xây dựng test suite mới `tests/navigation-integration.test.ts` kiểm thử chuyển Project/Room, scene isolation, route fallback và store hydration (10/10 tests PASSED 100%).
8. **Kiểm Thử & Build Production**:
   - `npm run lint`: Pass 100% (0 errors, 0 warnings).
   - `npm test`: Pass 100% (10/10 Vitest tests passed).
   - `npm run build`: Build thành công 100% (11 static/dynamic routes generated).
