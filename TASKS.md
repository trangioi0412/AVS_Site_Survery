# Danh sách Task — AVS Site Survey 3D Planner

## [COMPLETED] TASK-001 — Hoàn thiện tạo dự án, chuyển dự án/phòng và đồng bộ Scene 3D

### Trạng thái: ✅ ĐÃ HOÀN THÀNH

### Các hạng mục đã thực hiện
1. **Thiết kế lại Data Architecture**:
   - Cập nhật `RoomInfo` trong `src/types/equipment.ts` với `projectId`, `sceneObjects`, `createdAt`, `updatedAt`.
   - Tạo `src/lib/scene-factory.ts` xử lý deep clone, khởi tạo 3D scene kiến trúc cơ bản (Sàn, 4 Tường, Cửa chính), tự động căn chỉnh 4 bức tường theo kích thước phòng mới, và factory khởi tạo Room/Project độc lập.

2. **Hoàn thiện Tạo Dự Án Mới**:
   - Viết action `createProject` trong `editor-store.ts` tạo project mới đi kèm 1 room mặc định với scene 3D kiến trúc sạch (không copy bàn ghế hay thiết bị dự án mẫu).
   - Tự động đặt làm project/room hiện tại, reset object selection và history stack.
   - Đồng bộ state vào Zustand persistence và cập nhật URL `?project=<id>&room=<id>`.

3. **Đồng bộ Chuyển Dự Án & Chuyển Phòng**:
   - Khi chuyển Project hoặc Room, hệ thống tự động lưu `objects` hiện tại vào room cũ trong store/persistence.
   - Nạp đúng `sceneObjects` và `dimensions` của room mới mà không làm giữ lại các object của room cũ.
   - Reset `selectedObjectId: null`, reset history stack về trạng thái ban đầu của room mới.

4. **Đồng bộ Kích thước Phòng 3D (Dimensions)**:
   - Khi thay đổi chiều rộng (`X`), chiều dài (`Z`) hay chiều cao (`Y`), hàm `updateArchitecturalObjects` tự động cập nhật vị trí và kích thước của Sàn (`Floor`), 4 Tường (`Wall`) và Cửa chính (`Door`).
   - Không sinh ra các bức tường trùng lặp và không làm mất thiết bị 3D người dùng đã thêm vào.

5. **Persistence & URL Navigation**:
   - Tích hợp Zustand `persist` middleware với schema versioning (v1), partialize lọc bỏ state UI tạm thời.
   - Viết logic `initFromUrl` trong store và `useEffect` trong `editor-layout.tsx` để đọc query parameters `?project=...&room=...` khi ứng dụng load, nạp đúng Project & Room tương ứng hoặc fallback an toàn.

---

### Các file chính đã thay đổi
- [src/types/equipment.ts](file:///d:/AVS_Site_Survey/src/types/equipment.ts): Bổ sung `projectId` & `sceneObjects` vào interface `RoomInfo`.
- [src/lib/scene-factory.ts](file:///d:/AVS_Site_Survey/src/lib/scene-factory.ts): **[NEW]** Helper khởi tạo Scene, deep clone, cập nhật 4 tường 3D và tạo project/room mới.
- [src/data/mock-project.ts](file:///d:/AVS_Site_Survey/src/data/mock-project.ts): Chuẩn hóa mock rooms và scenes độc lập.
- [src/stores/editor-store.ts](file:///d:/AVS_Site_Survey/src/stores/editor-store.ts): Tích hợp Zustand `persist`, viết lại các action quản lý project, room, sync scene và URL.
- [src/components/app-shell/top-bar.tsx](file:///d:/AVS_Site_Survey/src/components/app-shell/top-bar.tsx): Kết nối UI dropdowns và modal tạo project với Zustand store.
- [src/components/editor/editor-layout.tsx](file:///d:/AVS_Site_Survey/src/components/editor/editor-layout.tsx): Đọc và đồng bộ URL query params khi load trang.

---

### Checklist kiểm thử (Verification Checklist)
- [x] **Test 1 - Tạo dự án mới**: Tạo thành công Project mới có room mặc định, scene không dính thiết bị mẫu. Sau reload dữ liệu giữ nguyên.
- [x] **Test 2 - Chuyển qua lại giữa hai dự án**: Thêm thiết bị ở Project A và B, chuyển qua lại A -> B -> A, mỗi project hiển thị đúng thiết bị riêng.
- [x] **Test 3 - Scene độc lập giữa các phòng**: Các phòng trong cùng dự án duy trì danh sách thiết bị và kiến trúc riêng.
- [x] **Test 4 - Thay đổi kích thước phòng**: Đổi width/length/height tự động điều chỉnh sàn và 4 tường khớp kích thước, không trùng lặp tường.
- [x] **Test 5 & 6 - URL trực tiếp và Fallback**: Mở trực tiếp URL có query `project` và `room` nạp đúng dữ liệu; URL lỗi fallback an toàn không crash.
- [x] **Test 7 - Reset state Editor**: Selection và transform gizmo reset sạch khi chuyển Scene.
- [x] **Test 8 - Persistence migration**: Hydration hoạt động mượt mà, reload trang không mất dữ liệu.
- [x] **Automated Checks**: `npm run lint` pass 100%, `npm run build` thành công xuất sắc.

---

### Hạn chế còn lại
- Hệ thống Undo/Redo hiện tại đã reset theo từng phòng nhưng chưa hỗ trợ lưu lịch sử Undo/Redo riêng biệt cho từng phòng sau khi chuyển đổi qua lại. Hạng mục này thuộc phạm vi giải quyết của TASK-002.

---

## [NEXT] TASK-002 — Ổn định Undo/Redo và hoàn thiện hệ thống quản lý history của Editor
- **Mục tiêu**: Quản lý history stack riêng cho từng room hoặc lưu trữ snapshots lịch sử thao tác người dùng ổn định hơn.
