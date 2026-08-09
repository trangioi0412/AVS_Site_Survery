# Walkthrough: TopBar Header Interactivity Enhancements

Toàn bộ các nút bấm và công cụ trên thanh **Header TopBar** của **AV Survey 3D Planner** đã được hoàn thiện chức năng tương tác real-time chi tiết.

## Completed Interactive Header Features

### 1. Multi-Project Selector & New Project Modal
- **Dropdown chọn Dự án**: Hiển thị danh sách các công trình khảo sát (`ABC Building`, `Keangnam Landmark 72`, `Bitexco Financial Tower`, `Vietcombank Tower HQ`).
- **Chuyển đổi Dự án**: Click vào dự án bất kỳ lập tức cập nhật thông tin dự án active và chuyển đổi danh sách phòng họp tương ứng.
- **Modal "Tạo Dự Án Mới"**:
  - Nhập Tên dự án công trình (*Bắt buộc*).
  - Nhập Tên khách hàng & Địa điểm công trình.
  - Sau khi submit, dự án mới được tạo và tự động chuyển sang môi trường làm việc mới với thông báo Toast.

---

### 2. Multi-Room Selector & 3D Room Dimension Customizer
- **Dropdown chọn Phòng**: Hiển thị danh sách các phòng thuộc dự án đang chọn kèm thông số chiều dài x chiều rộng.
- **Modal "Chỉnh kích thước phòng"**:
  - Điều chỉnh **Chiều Rộng (X - m)**, **Chiều Dài (Z - m)**, **Chiều Cao (Y - m)**.
  - Sau khi lưu, mô hình sàn 3D phòng họp (`Floor mesh`) trong React Three Fiber được tự động mở rộng/thu hẹp kích thước trực quan real-time!

---

### 3. Phím Tắt Toàn Cục (Global Keyboard Shortcuts) & Save Indicator
- **Lắng nghe phím tắt toàn hệ thống**:
  - `Ctrl + Z` (hoặc `Cmd + Z` trên Mac): Hoàn tác (Undo).
  - `Ctrl + Y` hoặc `Ctrl + Shift + Z`: Làm lại (Redo).
  - `Ctrl + S`: Lưu thủ công tiến độ khảo sát.
- **Save Status Indicator**:
  - Khi có thay đổi chưa lưu (thêm/xóa/di chuyển vật thể), badge đổi sang màu vàng pulse: `Chưa lưu *`.
  - Khi nhấp vào badge hoặc bấm `Ctrl+S`, hệ thống lưu trạng thái, cập nhật timestamp (`Đã lưu 10:45 AM`) và hiển thị thông báo Toast xanh lá.

---

### 4. Modal Chia Sẻ Dự Án (Share Project Modal)
- Nút **Chia sẻ** mở popup dialog hiện đại:
  - Liên kết dự án trực tuyến (URL với query parameters `?project=...&room=...`).
  - Nút **Sao chép** 1-click tự động copy vào clipboard hệ thống.
  - Lựa chọn phân quyền truy cập: **Cá nhân**, **Nội bộ Team**, **Công khai**.
  - Xem nhanh **Mã QR Khảo Sát Nhanh** dành cho kỹ sư quét bằng máy tính bảng/điện thoại khi đi khảo sát thực địa.

---

### 5. Hệ Thống Xuất Dữ Liệu Chi Tiết (Export System)
- **Xuất Cấu trúc 3D (.JSON)**: Tải xuống file `.json` chứa toàn bộ mảng đối tượng 3D, tọa độ X/Y/Z, thông số kỹ thuật.
- **Xuất Bảng BOM (.CSV / Excel)**:
  - Sử dụng hàm helper `exportBomToCsv` bổ sung ký tự UTF-8 BOM byte order mark.
  - Tải xuống file `.csv` tương thích 100% với Microsoft Excel, chứa bảng tổng hợp danh sách thiết bị AV (STT, Tên, Phân loại, Thương hiệu, Model, Trạng thái, Tọa độ X/Y/Z).
- **Xuất Sơ đồ Mặt bằng 2D (.PNG)**:
  - Tự động chuyển đổi viewport sang góc nhìn Orthographic Top-down 2D.
  - Trích xuất ảnh chụp HTML5 Canvas chất lượng cao và tự động tải xuống file `.png`.

---

### 6. User Profile Dropdown & System Info Modal
- Click vào Avatar góc phải mở menu quản lý:
  - Thông tin người dùng (`Kỹ Sư AV`, `admin@avsurvey.com`, `System Administrator`).
  - Nút đổi nhanh ngôn ngữ hệ thống (**VIE** / **ENG**).
  - Trạng thái giao diện kỹ thuật (**Technical Dark Mode**).
  - Nút **Thông tin hệ thống** mở modal giới thiệu phiên bản `AV Survey 3D Planner v1.0.0` & Tech Stack.
  - Nút **Đăng xuất** giả lập.

---

## Verification
- [x] **TypeScript Check**: `npx tsc --noEmit` đạt 0 lỗi compile.
- [x] **Next.js Dev Server**: Đang chạy ổn định tại [http://localhost:3000](http://localhost:3000).
- [x] **Interactivity**: Tất cả 7 thành phần trên TopBar đã tương tác đầy đủ với Zustand store và modal dialogs.
