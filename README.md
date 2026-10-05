# Phone Store Shop

Trang giới thiệu sản phẩm / marketing công khai cho cửa hàng điện thoại, giao diện theo phong cách Apple / Nike.
Dữ liệu lấy từ **API công khai của trang quản trị** [`phone-store-manager`](../phone-store-manager) (`/api/public/*`). Repo này không kết nối database.

**Không có đặt hàng / thanh toán online.** Khách xem sản phẩm rồi liên hệ qua nút **Zalo / Gọi điện**.

## Trang

| Đường dẫn | Nội dung |
|---|---|
| `/` | Hero (sản phẩm nổi bật), ô danh mục, carousel "Nổi bật" và "Mới về", máy cũ, phụ kiện, dịch vụ sửa chữa, danh sách cửa hàng + nút liên hệ |
| `/products` | Danh sách, lọc theo `cat` (iphone / android / accessory), `cond` (new / used), sắp xếp, tìm kiếm không dấu |
| `/tin-tuc` | Tin tức / Khuyến mãi / Mẹo hay: lọc chuyên mục, tìm kiếm, phân trang |
| `/tin-tuc/[slug]` | Bài viết + bài liên quan (bài khuyến mãi có thêm nút liên hệ) |
| `/p/[slug]` | Chi tiết dòng máy: ảnh, mô tả, chọn Tình trạng → Dung lượng → Màu → (máy cũ) chọn máy theo % pin, giá khuyến mãi, nút liên hệ kèm mã SP |

## Dữ liệu

Toàn bộ nằm trong `src/lib/shop.ts`:

| Endpoint (trang quản trị) | Dùng cho |
|---|---|
| `GET /api/public/products` | Sản phẩm đang bán và bật **hiển thị trên web**. Các sản phẩm cùng loại + cùng tên được gom thành một dòng máy, `slug` = tên bỏ dấu |
| `GET /api/public/branches` | Danh sách cửa hàng (không có thì ẩn mục) |
| `GET /api/public/repair-prices` | Mục "Sửa chữa" (không có thì ẩn mục) |
| `GET /api/public/posts`, `/posts/:slug` | Tin tức (`src/lib/news.ts`); admin viết bài ở Quản lý → Tin tức. Không có thì ẩn mục "Tin mới" |

- Sản phẩm không có ảnh (hoặc link ảnh lỗi) → ảnh mặc định `public/images/placeholder-*.svg`.
- Ảnh, mô tả, giá khuyến mãi, nổi bật / thứ tự, ẩn / hiện trên web: **admin quản lý ở trang quản trị**.
- Response được cache **60 giây**, nên thay đổi bên quản trị sẽ hiện lên web chậm tối đa khoảng 1 phút.
- Giá nhập, IMEI, ghi chú nội bộ không có trong API (trang quản trị lọc ở `src/lib/public-api.ts`).

## Chạy local

```bash
npm install
cp .env.example .env   # ADMIN_API_URL=http://localhost:3000, SHOP_NAME, SHOP_PHONE, SHOP_ZALO, SHOP_FACEBOOK
npm run dev            # http://localhost:3001 — cần trang quản trị đang chạy ở :3000
```

Nút Zalo / Gọi chỉ hiện khi đã đặt `SHOP_PHONE` hoặc `SHOP_ZALO`.

## Deploy (Vercel)

Tạo project Vercel mới từ repo này, đặt các biến `ADMIN_API_URL` (domain trang quản trị) và `SHOP_*`.
Bên trang quản trị, đặt `PUBLIC_API_ORIGINS` gồm domain của trang này nếu muốn giới hạn CORS. Trang này gọi API từ server nên không bị CORS chặn, nhưng nên giới hạn để an toàn.
