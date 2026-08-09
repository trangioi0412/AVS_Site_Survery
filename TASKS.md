# Danh sách Task — AVS Site Survey 3D Planner

## Roadmap Tổng Thể
- **TASK-001**: Project/Room/Scene isolation (✅ Completed & Verified)
- **TASK-001B**: Hardening & Verification (✅ Completed & Verified)
- **TASK-002**: App Shell, Routing & Management Pages (✅ Completed & Verified)
- **TASK-003**: Undo/Redo & Editor Measurement Tools
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
5. **Clean Links**:
   - Chuẩn hóa toàn bộ đường dẫn Markdown relative.

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
3. **Kiểm Thử & Build Production**:
   - `npm run lint` pass 100% (0 errors, 0 warnings).
   - `npm test` (Vitest) pass 100% (5/5 tests passed).
   - `npm run build` thành công 100% (11/11 static routes generated).
