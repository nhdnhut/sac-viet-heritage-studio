# Kiến Trúc Hệ Thống: SẮC VIỆT STUDIO

> **SẮC VIỆT STUDIO — "Phối Việt phục theo cách của bạn, hiểu câu chuyện phía sau"**  
> *Đề bài Audition: "Việt phục Remix"*

---

## 1. Tổng Quan Kiến Trúc

SẮC VIỆT STUDIO được kiến tạo theo mô hình **Local-First, Strict Boundary**:
- **Frontend**: Next.js 15 App Router, React 19, Tailwind CSS, Three.js / React Three Fiber / Drei.
- **Backend Boundary**: Node.js 24 API Routes ràng buộc trên `127.0.0.1`, xác thực `Origin/Host` headers.
- **Database**: SQLite 3.53.3 tích hợp sẵn trong Node.js (`node:sqlite`) chạy chế độ WAL mode, không phụ thuộc native binaries bên ngoài.
- **AI Core**: Google GenAI SDK (`@google/genai`) phiên bản chính thức mới nhất kết nối trực tiếp với Gemini 3.8 Flash (Thinking High) và Gemini 3.1 Flash Image.

```
+-----------------------------------------------------------------------------------+
| CLIENT BROWSER (Desktop & Mobile)                                                 |
|   +-------------------+  +-------------------+  +-------------------------------+ |
|   | Studio / Brief UI |  | 3D R3F Viewport   |  | Lookbook / Wardrobe / Compare | |
|   +-------------------+  +-------------------+  +-------------------------------+ |
+------------------------------------------+----------------------------------------+
                                           | HTTP Requests (Same-Origin / 127.0.0.1)
                                           v
+-----------------------------------------------------------------------------------+
| NEXT.JS SERVER BOUNDARY (Node.js 24 Runtime)                                      |
|                                                                                   |
|   +--------------------+  +----------------------+  +-------------------------+   |
|   | /api/session       |  | /api/style           |  | /api/render             |   |
|   | /api/connection    |  | /api/patch (Optimist)|  | /api/looks & /wardrobe  |   |
|   +---------+----------+  +----------+-----------+  +------------+------------+   |
|             |                        |                           |                |
|             v                        v                           v                |
|   [In-Memory Session]     [AI Tool Orchestration]       [SQLite Database]         |
|   - API Key (RAM only)    - 11 Allowlisted Tools        - node:sqlite (WAL Mode)  |
|   - Model & Thinking Lv   - Deterministic Engine        - Looks, Revisions, Jobs  |
|   - Opaque HttpOnly Cookie- Versioned JSON Data         - Wardrobe & Assets       |
+--------------------------------------+--------------------------------------------+
                                       |
                                       v
+-----------------------------------------------------------------------------------+
| GOOGLE GEMINI CLOUD                                                               |
|   - gemini-3.8-flash (Reasoning & Cultural Synthesis with Thinking High)          |
|   - gemini-3.1-flash-image / gemini-3-pro-image (High-Fidelity Garment Portrait)  |
|   - Multimodal Vision QA (Image-to-Spec Verification)                             |
+-----------------------------------------------------------------------------------+
```

---

## 2. Các Thành Phần Cốt Lõi

### 2.1. Quản Lý Phiên & Bảo Mật Khóa API
- Khóa API **tuyệt đối không bao giờ** xuất hiện trong client bundle, localStorage, SQLite, log hay Git commit.
- Cơ chế nhận diện hai tầng:
  1. `process.env.GEMINI_API_KEY` trong `.env.local` (ưu tiên cao nhất).
  2. Khóa nhập tay qua giao diện Settings được mã hóa lưu trong RAM của Node.js tiến trình (In-Memory Map) gắn với cookie `sac_viet_session` (`HttpOnly`, `SameSite=Strict`).
- Khi người dùng gửi yêu cầu, ô nhập tự động xóa trắng; client chỉ nhận cờ trạng thái `hasEnvKey` / `hasSessionKey`.

### 2.2. Kiểm Soát Phiên Bản Lạc Quan (Optimistic Concurrency Control)
- Mọi thao tác tinh chỉnh (patch) bắt buộc phải truyền kèm `baseRevision`.
- Nếu phiên bản hiện tại trong SQLite khác với `baseRevision` của client (do có thay đổi đồng thời hoặc trễ mạng), server lập tức trả về mã lỗi `409 Conflict`, ngăn chặn triệt để tình trạng ghi đè mất dữ liệu.

### 2.3. Không Gian 3D Tham Số Thật (True Parametric Geometry)
- Hai loại y phục được xây dựng bằng hai geometry độc lập:
  1. **Áo ngũ thân tay chẽn**: Khối lập thể cổ đứng (3.5 - 4cm), 5 thân vải xếp lớp, vạt con tả lập bên trong, nẹp hữu nhậm cong chéo, 5 cúc ngọc và tay chẽn thuôn gọn ôm cổ tay. Kiểm tra hoàn thiện cả mặt trước và mặt sau (dorsal view).
  2. **Áo dài hiện đại**: Thân áo ôm eo tôn dáng, 2 tà trước-sau xẻ hông sâu đến thắt lưng, tay raglan mượt mà, quần lụa suông rộng ống đứng.
- Material slots độc lập được clone theo từng instance, loại bỏ hiện tượng đổi màu chéo giữa các bộ phối.

### 2.4. Công Cụ Phối Đồ Hai Tầng (Dual-Engine Styling)
- **Tầng Trực tuyến (Online)**: Gọi Gemini API với cấu hình `thinkingConfig: { thinkingLevel: 'HIGH', thinkingBudget: 8192 }` phân tích sâu mối tương quan giữa bối cảnh, y phục và thẩm mỹ remix.
- **Tầng Bản địa (Offline Fallback)**: Thuật toán xác định (deterministic) bảo đảm hệ thống luôn hoạt động trơn tru 100% ngay cả khi chưa có mạng, chưa nhập API key hoặc tài khoản hết quota.

### 2.5. Vision QA & Đối Soát Thị Giác
- Ảnh do Gemini Image Model tạo ra được lưu cục bộ với mã băm `specHash` và số hiệu `revision`.
- Gemini Multimodal được triệu tập tự động để đối chiếu ảnh vừa tạo với `OutfitSpec`: kiểm tra loại áo, màu sắc, chi tiết cổ áo và ống tay, phát hiện sai lệch trước khi bàn giao cho người dùng.
