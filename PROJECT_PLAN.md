# Kế Hoạch Dự Án — AVS Site Survey 3D Planner

## 1. Mục Tiêu Dự Án
Xây dựng ứng dụng web 3D Editor khảo sát mặt bằng và thiết kế hạ tầng AV (Audio-Visual Site Survey & Planning) hiện đại, sử dụng **Next.js 14**, **React Three Fiber / Three.js**, **Zustand**, và **TypeScript**. Ứng dụng giúp kỹ sư AV dựng mô hình 3D phòng họp, sắp xếp thiết bị, kiểm tra tầm nhìn camera/loa, và xuất báo cáo BOM/mặt bằng 2D.

---

## 2. Các Phase Triển Khai

### Phase 1: Quản lý Dự Án, Phòng & Độc Lập Scene 3D (Đang thực hiện)
- **TASK-001** (✅ **HOÀN THÀNH**):
  - Thiết kế lại Data Architecture (Project -> Room -> Scene Objects).
  - Hoàn thiện luồng Tạo Dự Án Mới và Phòng Mặc Định.
  - Chuyển Project / Room lưu và nạp đúng Scene 3D tương ứng.
  - Tự động hóa cập nhật Sàn và 4 Tường 3D theo kích thước phòng.
  - Zustand Persistence (`localStorage`) giữ nguyên dữ liệu sau reload.
  - Đọc và đồng bộ URL query (`?project=<id>&room=<id>`).

### Phase 2: Hệ Thống History & Editor State
- **TASK-002** (⏳ **TIẾP THEO**):
  - Ổn định Undo / Redo cho từng Room.
  - Hoàn thiện history stack và state snapshot management.

### Phase 3: Mô Hình 3D & Asset Loader
- **TASK-003**:
  - Tích hợp GLTF / GLB Model Loader cho thiết bị AV thực tế (Camera, Soundbar, Display, Table, Rack).
  - Tùy chỉnh vật liệu và phân vùng thuộc tính thiết bị.

---

## 3. Trạng Thái Hiện Tại
- **TASK-001**: ✅ **HOÀN THÀNH** (Lint pass, Production Build 100% thành công).
- **TASK-002**: 🔄 Chuẩn bị triển khai.
- **TASK-003**: 📅 Lên kế hoạch.
