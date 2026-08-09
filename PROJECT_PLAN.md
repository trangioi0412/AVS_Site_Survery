# Kế Hoạch Dự Án — AVS Site Survey 3D Planner

## 1. Mục Tiêu Dự Án
Xây dựng ứng dụng web 3D Editor & Lập kế hoạch thiết kế hệ thống Audio Visual (Audio-Visual Site Survey & Planning) chuyên nghiệp trên nền tảng **Next.js 14 App Router**, **React Three Fiber / Three.js**, **Tailwind CSS**, **Zustand**, và **TypeScript**.

---

## 2. Các Phase Triển Khai (Roadmap)

### Phase 1: Core 3D Data Architecture
- **TASK-001** (✅ **HOÀN THÀNH**): Project/Room/Scene isolation.
- **TASK-001B** (✅ **HOÀN THÀNH**): Hardening dữ liệu, hydration safety, schema migration, Vitest suite & GitHub Actions CI.

### Phase 2: App Shell & Routing
- **TASK-002** (✅ **HOÀN THÀNH**): App Shell dùng chung, điều hướng Next.js App Router, Dashboard và 10 trang quản lý khảo sát/dự án/thiết bị/báo cáo.

### Phase 3: History & Tools
- **TASK-003** (⏳ **TIẾP THEO**): Undo/Redo nâng cao & Editor measurement/annotation tools.

### Phase 4: Asset Management
- **TASK-004**: GLTF/GLB Asset Loader cho mô hình 3D thực tế.

### Phase 5: Export & Reporting
- **TASK-005**: Xuất báo cáo PDF, Excel BOM & Snapshots.

### Phase 6: Cloud & Backend
- **TASK-006**: Backend API, Authentication & Realtime Collaboration.

---

## 3. Trạng Thái Hiện Tại
- **TASK-001 & TASK-001B**: ✅ **HOÀN THÀNH & NGHIỆM THU** (Automated Tests pass, CI ready, Build pass 100%).
- **TASK-002**: ✅ **HOÀN THÀNH & NGHIỆM THU** (11/11 Routes generated, Pass 100% Lint/Build/Tests).
- **TASK-003**: 🔄 Chuẩn bị triển khai.
