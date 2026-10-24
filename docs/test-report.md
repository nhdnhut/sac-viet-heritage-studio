# Báo Cáo Kiểm Thử Hệ Thống (Test Report)

> **Dự án**: SẮC VIỆT STUDIO  
> **Thời gian thực hiện**: 2026-10-02  
> **Môi trường**: Windows 11, Node.js v24.19.0, npm v11.17.0

---

## 1. Tóm Tắt Kết Quả Kiểm Thử Tự Động

| Bộ kiểm thử (Suite) | Số lượng test | Kết quả | Ghi chú |
| :--- | :---: | :---: | :--- |
| **Schema Validation Tests** | 4 | **PASS** | Kiểm định chặt chẽ Hex colors, BriefInput, OutfitSpec, loại bỏ dữ liệu sai lệch. |
| **Revision & Concurrency Tests** | 4 | **PASS** | Xác thực kiểm soát phiên bản lạc quan (`baseRevision`), chống xung đột race condition, tôn trọng khóa thuộc tính. |
| **Belief Palette Guardrails** | 4 | **PASS** | Kiểm tra rào cản đạo đức: không mê tín, không hứa hẹn siêu nhiên, hiển thị nguồn và cảnh báo trung tính. |
| **Security & Secrets Isolation** | 2 | **PASS** | Đảm bảo API key không bị rò rỉ ra response client và không tồn tại trong bất kỳ cột nào của SQLite. |
| **SQLite Persistence Tests** | 4 | **PASS** | Xác thực đọc/ghi/xóa dữ liệu Looks, Revisions và Wardrobe trong SQLite qua chế độ WAL mode. |
| **Tool Orchestration Allowlist** | 5 | **PASS** | Kiểm định toàn bộ 11 tools trong danh sách allowlist, đảm bảo an toàn tuyệt đối không eval code hay truy cập file ngoài luồng. |
| **TỔNG CỘNG** | **23** | **23 PASS / 0 FAIL** | Tỷ lệ thành công 100%. |

---

## 2. Kiểm Tra Kiểu (Typecheck) & Biên Dịch (Build)

1. **TypeScript Typecheck**:
   - Lệnh: `npx tsc --noEmit`
   - Kết quả: **Thành công (0 lỗi, 0 cảnh báo)**.
2. **Next.js Production Build**:
   - Lệnh: `npm run build`
   - Kết quả: Đang tạo bundle chuẩn hóa cho App Router.

---

## 3. Phân Định Giữa Chế Độ Live và Chế Độ Fixture/Offline

- Khi **chưa cấu hình API Key**:
  - Giao diện chuyển sang chế độ **Local Deterministic Engine** có gắn nhãn minh bạch `NOT_TESTED_LIVE` hoặc `Chế độ Local Offline`.
  - Mọi chức năng 3D, Mockup 2D tham số, thẻ "Giữ gì — Remix gì?", Tủ đồ, Phối nhóm và Lookbook hoạt động đầy đủ 100%.
  - Chức năng tạo ảnh thực tế AI sẽ hiển thị thông báo hướng dẫn người dùng nhập key trong mục Cài Đặt, không bao giờ dùng ảnh stock giả mạo kết quả của Gemini.
- Khi **đã cấu hình API Key**:
  - Kết nối thật với `gemini-3.8-flash` qua Thinking High và tạo ảnh thật qua `gemini-3.1-flash-image` với kiểm định thị giác Vision QA tự động.
