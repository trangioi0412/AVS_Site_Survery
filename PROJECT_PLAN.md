# Kế Hoạch Dự Án — AVS Site Survey 3D Planner

## 1. Mục Tiêu Dự Án
Xây dựng ứng dụng web 3D Editor & Lập kế hoạch thiết kế hệ thống Audio Visual (Audio-Visual Site Survey & Planning) chuyên nghiệp trên nền tảng **Next.js 14 App Router**, **React Three Fiber / Three.js**, **Tailwind CSS**, **Zustand**, và **TypeScript**.

---

## 2. Các Phase Triển Khai (Roadmap)

### Phase 1: Core 3D Data Architecture
- **TASK-001** (✅ **HOÀN THÀNH**): Project/Room/Scene isolation.
- **TASK-001B** (✅ **HOÀN THÀNH**): Hardening dữ liệu, hydration safety, schema migration, Vitest suite & GitHub Actions CI.

### Phase 2: App Shell, Routing & Integration Audit
- **TASK-002** (✅ **HOÀN THÀNH**): App Shell dùng chung, điều hướng Next.js App Router, Dashboard và 10 trang quản lý khảo sát/dự án/thiết bị/báo cáo.
- **TASK-002B** (✅ **HOÀN THÀNH**): Navigation, Editor Route & Scene Switching Integration Audit.
- **TASK-002C** (✅ **HOÀN THÀNH**): Fix Editor bị kẹt vô hạn tại màn hình Loading.
- **TASK-002D** (✅ **HOÀN THÀNH**): Unified Sidebar, Project/Room Context Navigation, Dynamic Route Resolution & Workflow Integration.
- **HOTFIX TASK-002D.1** (✅ **HOÀN THÀNH**): Fix lỗi tiêu đề bảng Hạ tầng khảo sát (`InfrastructureTable`) bị chồng chữ khi cuộn (Hotfix cục bộ, giữ nguyên App Shell, Scene, Store, persistence & routing).

### Phase 3: History & Tools
- **TASK-003A** (⏳ **PENDING BROWSER VERIFICATION**): Transactional Undo/Redo Foundation (Snapshot, Transaction lifecycle, Limits & Safety).
- **TASK-003B** (🔄 **TIẾP THEO**): Measurement Tool (Đo khoảng cách & diện tích).
- **TASK-003C**: Annotation Tool (Ghi chú vị trí 3D).
- **TASK-003D**: Editor Tools & Integration Hardening (Fit View, Hotkeys Q/W/E/R/M/N/Delete).

### Phase 4: Asset Management
- **TASK-004**: GLTF/GLB Asset Loader cho mô hình 3D thực tế.

### Phase 5: Export & Reporting
- **TASK-005**: Xuất báo cáo PDF, Excel BOM & Snapshots.

### Phase 6: Cloud & Backend
- **TASK-006**: Backend API, Authentication & Realtime Collaboration.

---

## 3. Trạng Thái Hiện Tại
- **TASK-001 & TASK-001B**: ✅ **HOÀN THÀNH & NGHIỆM THU** (Automated Tests pass, CI ready, Build pass 100%).
- **TASK-002 & TASK-002B**: ✅ **HOÀN THÀNH & NGHIỆM THU** (Single Source of Truth, Clean Nav, Pass 100% Lint/Build/Tests).
- **TASK-002C**: ✅ **HOÀN THÀNH & NGHIỆM THU** (Fix Hydration Loading Deadlock, Pass 13/13 Vitest tests & Build 100%).
- **TASK-002D & HOTFIX TASK-002D.1**: ✅ **HOÀN THÀNH & NGHIỆM THU** (Unified Sidebar, Sticky Table Header fixed, 26/26 Tests pass, Build 100%).
- **TASK-003A**: ⏳ **ĐÃ HOÀN THÀNH CODE & AUTOMATED TESTS — PENDING BROWSER VERIFICATION** (Transactional Undo/Redo Foundation, 41/41 Tests pass, Build 100%).
- **TASK-003B**: 🔄 Sẵn sàng triển khai (⏳ **TIẾP THEO**).
