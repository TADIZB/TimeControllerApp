# Báo cáo & Hướng dẫn chi tiết TimeControllerApp

## 1. Giới thiệu

**TimeControllerApp** là ứng dụng di động giúp quản lý báo thức, sự kiện và bộ đếm ngược thời gian, hỗ trợ tổ chức công việc, sinh hoạt cá nhân, có tích hợp giao tiếp IoT qua MQTT.

---

## 2. Người thực hiện: 
Trương Anh Đức - 20225814

## 3. Tiến độ phát triển

- **Đã hoàn thành:**
  - Giao diện chính, chuyển tab, layout tổng thể.
  - Quản lý báo thức: thêm, xóa, bật/tắt, lưu trữ cục bộ.
  - Quản lý sự kiện: thêm, xem lịch, lưu trữ cục bộ.
  - Bộ đếm ngược: giao diện, logic đếm, thông báo hoàn thành.
  - Tích hợp MQTT: gửi/nhận tín hiệu khi báo thức hoặc đếm ngược kết thúc.
  - Backend Express (tùy chọn): lưu trữ báo thức, API REST.
  - Hỗ trợ rung, thông báo, theme sáng/tối.
- **Còn có thể mở rộng:**
  - Đồng bộ hóa sự kiện/báo thức qua backend.
  - Thông báo push khi đến giờ sự kiện.
  - Quản lý nhiều người dùng.
  - Lịch sử hoạt động, thống kê.

---

## 4. Cấu trúc thư mục & các thành phần chính

```
Alarm/
  app/
    (tabs)/
      alarm.tsx         # Danh sách báo thức
      add-alarm.tsx     # Thêm báo thức mới
      events.tsx        # Lịch sự kiện
      add-event.tsx     # Thêm sự kiện mới
      countdown.tsx     # Bộ đếm ngược
      index.tsx         # Trang chủ
    _layout.tsx         # Định nghĩa layout cho app
    +not-found.tsx      # Trang lỗi
  assets/
    fonts/              # Font chữ sử dụng
    images/             # Icon, splash, favicon
  backend/
    server.js           # Server Express (nếu dùng backend)
    alarms.json         # Lưu trữ báo thức (nếu dùng backend)
  components/           # Các component dùng lại (AlarmItem, CountdownTimer, ...)
  constants/            # Biến màu sắc, theme
  hooks/                # Custom hooks (AlarmContext, useAlarms, ...)
  scripts/              # Script tiện ích (reset-project.js)
  package.json          # Thông tin và dependencies
  tsconfig.json         # Cấu hình TypeScript
  README.md             # Hướng dẫn sử dụng & báo cáo
```

---

## 5. Cách hoạt động tổng quan

### 5.1. Báo thức

- **Lưu trữ:** Dùng AsyncStorage (local) hoặc backend (Express).
- **Kiểm tra báo thức:** Mỗi phút, app kiểm tra thời gian hiện tại với danh sách báo thức đã bật. Nếu trùng, gửi tín hiệu MQTT và rung thiết bị.
- **MQTT:** Khi đến giờ, gửi tín hiệu lên broker MQTT để các thiết bị IoT nhận biết (ví dụ: bật đèn, còi...).
- **Các hàm chính:**
  - `fetchAlarms`, `addAlarm`, `deleteAlarm`, `toggleAlarm`, `updateAlarm` (trong `hooks/useAlarms.ts`)
  - Kiểm tra báo thức định kỳ: logic trong `app/_layout.tsx`
  - Gửi tín hiệu: `SendToMqtt` (trong `mqtt.ts`)

### 5.2. Sự kiện

- **Lưu trữ:** AsyncStorage (key: 'events').
- **Thêm/Xem sự kiện:** Giao diện thêm sự kiện mới, xem lịch sự kiện theo ngày.
- **Các hàm chính:**
  - Thêm sự kiện: `handleSave` (trong `app/(tabs)/add-event.tsx`)
  - Xem sự kiện: lọc và hiển thị theo ngày trong `app/(tabs)/events.tsx`

### 5.3. Bộ đếm ngược

- **Chức năng:** Đặt thời gian đếm ngược, bắt đầu/tạm dừng/đặt lại, khi hết giờ gửi tín hiệu MQTT.
- **Các hàm chính:**
  - Logic đếm ngược: `CountdownTimer` (trong `components/CountdownTimer.tsx`)
  - Giao diện điều khiển: `app/(tabs)/countdown.tsx`
  - Khi hết giờ: gọi `SendToMqtt` và callback `onComplete`

### 5.4. MQTT

- **Kết nối:** Sử dụng broker công cộng MQTTBox
- **Các hàm chính:**
  - `CheckMqttConnection`: Kết nối và log trạng thái.
  - `SendToMqtt`: Gửi tín hiệu (payload 'X') lên topic.
  - `ReceiveFromMqtt`: Lắng nghe tín hiệu, callback khi nhận được.
  - `DisconnectMqtt`: Ngắt kết nối khi không dùng nữa.

### 5.5. Backend (tùy chọn)

- **API:** Express server, lưu báo thức vào file (node-localstorage).
- **Các route:** 
  - `GET /alarms`: Lấy danh sách báo thức.
  - `POST /alarms`: Thêm báo thức mới.
- **Các hàm chính:** `readAlarms`, `writeAlarms` trong `backend/server.js`.

---

## 6. Mô tả chi tiết các hàm tiêu biểu

### hooks/useAlarms.ts

- `fetchAlarms`: Lấy danh sách báo thức từ AsyncStorage.
- `saveAlarms`: Lưu danh sách báo thức vào AsyncStorage.
- `addAlarm`: Thêm báo thức mới.
- `deleteAlarm`: Xóa báo thức.
- `toggleAlarm`: Bật/tắt báo thức.
- `updateAlarm`: Cập nhật thông tin báo thức.

### mqtt.ts

- `CheckMqttConnection`: Kết nối và kiểm tra trạng thái MQTT.
- `SendToMqtt`: Gửi tín hiệu lên topic.
- `ReceiveFromMqtt(callback)`: Đăng ký nhận tín hiệu, gọi callback khi có dữ liệu.
- `DisconnectMqtt`: Ngắt kết nối.

### components/CountdownTimer.tsx

- Đếm ngược thời gian, cập nhật UI, khi hết giờ gọi `SendToMqtt` và callback `onComplete`.

### app/_layout.tsx

- Khởi tạo MQTT, kiểm tra báo thức mỗi phút, rung khi nhận tín hiệu từ MQTT.

### backend/server.js

- `readAlarms`, `writeAlarms`: Đọc/ghi báo thức từ file.
- API RESTful cho báo thức.

---

## 7. Hướng dẫn cài đặt & sử dụng

1. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

2. **Chạy ứng dụng:**
   ```bash
   npm start
   ```
   - Mở trên thiết bị thật (Expo Go) hoặc giả lập.


3. **Cấu hình MQTT:** Sửa thông tin broker trong `mqtt.ts` nếu cần.
Ứng dụng chạy có kết nối với MQTTBox

---

## 8. Đánh giá & Đề xuất phát triển

- Ứng dụng đã hoàn thiện các chức năng cơ bản, hoạt động ổn định trên thiết bị thật.
- Có thể mở rộng thêm các tính năng như đồng bộ cloud, thông báo push, quản lý nhiều người dùng, tích hợp thêm thiết bị IoT.
- Code đã tách biệt rõ ràng giữa UI, logic, backend, dễ bảo trì và phát triển tiếp.

---

## 9. Đóng góp & phát triển

- Fork repo, tạo branch mới, commit và gửi pull request.
- Đảm bảo kiểm tra kỹ chức năng trước khi gửi PR.

---

