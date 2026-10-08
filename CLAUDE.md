# Phone Store Shop (Tài Khoa Mobile — website)

Website công khai giới thiệu sản phẩm của cửa hàng điện thoại, phong cách Apple / Nike. Giao diện **tiếng Việt**, tiền **VND**, giờ **Asia/Ho_Chi_Minh**. **Không có giỏ hàng / thanh toán**: khách xem rồi liên hệ qua Zalo / Gọi điện.

Dữ liệu lấy từ API công khai của trang quản trị **`phone-store-manager`** (repo cạnh bên, `../phone-store-manager`, tài liệu API: `docs/public-api.md` bên đó). Repo này **không có database**. Danh sách trang, endpoint, deploy: xem `README.md`.

## Công nghệ

- **Next.js 15** (App Router, Server Components) + **React 19** + TypeScript strict, alias `@/` → `src/`
- **Tailwind CSS 4**: cấu hình trong `src/app/globals.css` (`@theme`, `@layer components`), không có `tailwind.config`
- Icon: `lucide-react`. Không dùng thư viện UI nào khác
- Deploy: Vercel (region `sin1`)

## Lệnh

```bash
npm run dev          # http://localhost:3001 — cần trang quản trị chạy ở :3002
npx tsc --noEmit     # kiểm tra kiểu — cách kiểm tra mặc định sau khi sửa code
npm run build        # build production
```

- **Không chạy `npm run build` khi `npm run dev` đang chạy.** Cả hai ghi vào `.next`, build sẽ làm dev server mất CSS (trang hiện HTML trơn, `layout.css` 404). Nếu đã lỡ: dừng dev, xoá `.next`, chạy lại `npm run dev`. Muốn build thì hỏi người dùng trước.
- Không có ESLint script hay test.

Biến môi trường: xem `.env.example` (`ADMIN_API_URL` bắt buộc; `SHOP_NAME`, `SHOP_PHONE`, `SHOP_ZALO`, `SHOP_FACEBOOK`, `SHOP_TIKTOK` tuỳ chọn).

## Cấu trúc

| Đường dẫn | Vai trò |
|---|---|
| `src/lib/shop.ts` | Gọi API quản trị (`getJson`, cache 60 giây), gom sản phẩm thành **dòng máy** (`ShopModel`: cùng loại + cùng tên, `slug` = tên bỏ dấu), thông tin liên hệ (`getShopInfo`). Chỉ chạy trên server (`server-only`) |
| `src/lib/news.ts` | Tin tức (`/api/public/posts`) |
| `src/lib/stores.ts` | Địa chỉ, hotline các cơ sở — sửa trực tiếp ở đây. Cơ sở đầu tiên = hotline chính |
| `src/lib/format.ts` | Định dạng dùng chung (`formatVND`, `slugify`, `capacityLabel`, nhãn loại/tình trạng…). Giữ giống `format.ts` bên quản trị |
| `src/components/ProductImage.tsx` | Ảnh sản phẩm; link lỗi hoặc không có ảnh → ảnh mặc định theo loại / từ khoá tên (`public/images/products/*.svg`) |
| `src/components/ShopNav.tsx` | Thanh điều hướng; trên điện thoại là menu thả xuống |
| `src/components/ProductConfigurator.tsx` | Trang chi tiết: chọn Tình trạng → Dung lượng → Màu → (máy cũ) chọn máy |

## Quy ước

- **Không tự đổi shape dữ liệu API.** Trường trả về do `phone-store-manager` quyết định (`src/lib/public-api.ts` bên đó); cần trường mới thì sửa cả hai repo và cập nhật type `ApiProduct` trong `shop.ts`.
- Ảnh do admin nhập từ nhiều nguồn nên dùng `<img>` thường, không dùng `next/image`. Ảnh giữ chỗ (placehold.co…) bị coi như không có ảnh (`isRealImage`).
- Trang là Server Component, gọi `getShopCatalog()` / `news.ts`; chỉ thành phần cần tương tác mới là `"use client"`.
- Comment và chữ trên giao diện viết tiếng Việt, ngắn gọn, giải thích *vì sao*.

## Giao diện

- Nền trắng / đen, chữ `#1d1d1f`, chữ phụ `#6e6e73`, nền xám nhạt `#f5f5f7`, viền `#d2d2d7`.
- **Màu nhấn cam** khai báo một lần trong `@theme` ở `globals.css`. Dùng class token, không viết mã màu trực tiếp:
  - `accent` (`bg-accent`, `text-accent`, `border-accent`, `ring-accent`): nút, link, viền ô đang chọn. Đã chọn sắc đậm để chữ trắng trên nút và chữ cam trên nền trắng đủ tương phản (~4.5:1)
  - `accent-hover`: nút khi rê chuột
  - `accent-bright`: chữ / điểm nhấn cam trên nền đen (hero, khối "Ghé cửa hàng")
- Class có sẵn: `.container-shop`, `.btn`, `.btn-accent`, `.btn-outline`, `.chip`, `.eyebrow`, `.prose-shop` (nội dung bài viết).
- Cỡ chữ nhỏ nhất: 14px cho chữ thường, 13px cho nhãn nổi trên ảnh.
- Header dùng `backdrop-blur`, nên header trở thành containing block cho phần tử `position: fixed` bên trong nó. Lớp phủ / menu `fixed` phải đặt **ngoài** `<header>`.
- Logo: `public/images/logo.png` (nền sáng), `logo-light.png` (nền tối, chữ "Tài Khoa" trắng), nền trong suốt, tỉ lệ 1736×327 — tách nền từ ảnh gốc "Glossy Orange TK Mobile Logo.png" (không lưu trong repo). Favicon `src/app/icon.png`, `apple-icon.png` = ô TK cam.
