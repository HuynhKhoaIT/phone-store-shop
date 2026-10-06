/** Nhãn / định dạng dùng chung server + client. Giữ giống phone-store-manager (src/lib/format.ts, product-labels.ts). */

export function formatVND(n: number) {
  return `${n.toLocaleString("vi-VN")} đ`;
}

/**
 * Giá 0 = "Liên hệ": admin để trống giá (giá sửa chữa) hoặc bật "Web hiện Liên hệ thay giá" (sản phẩm),
 * vì giá thay đổi theo linh kiện / thị trường. API trả price = finalPrice = 0.
 */
export function formatPrice(n: number) {
  return n > 0 ? formatVND(n) : "Liên hệ";
}

/** Giá thấp nhất trong các giá có niêm yết; toàn bộ là giá liên hệ → 0. */
export function lowestPrice(prices: number[]) {
  const listed = prices.filter((n) => n > 0);
  return listed.length ? Math.min(...listed) : 0;
}

/** Khoá sắp xếp theo giá: giá liên hệ xếp cuối. */
export function priceRank(n: number) {
  return n > 0 ? n : Number.POSITIVE_INFINITY;
}

export const CONDITION_LABEL: Record<string, string> = { NEW: "Mới 100%", USED: "Máy cũ" };

export function gbLabel(gb: number) {
  return gb >= 1024 ? `${gb / 1024}TB` : `${gb}GB`;
}

/** "8/256GB", "128GB" hoặc "RAM 8GB" */
export function capacityLabel(p: { ramGb?: number | null; storageGb?: number | null }) {
  if (p.ramGb && p.storageGb) return `${p.ramGb}/${gbLabel(p.storageGb)}`;
  if (p.storageGb) return gbLabel(p.storageGb);
  if (p.ramGb) return `RAM ${p.ramGb}GB`;
  return null;
}

/** Bỏ dấu tiếng Việt → slug dùng cho URL và tìm kiếm */
export function slugify(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const CATEGORY_LABEL: Record<string, string> = { IPHONE: "iPhone", ANDROID: "Android", ACCESSORY: "Phụ kiện" };

/** "05/10/2026" theo giờ Việt Nam */
export function formatDateVN(iso: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

/**
 * Ảnh "giữ chỗ" (placehold.co, dummyimage…) — thường có trong dữ liệu mẫu, chỉ là ô màu có chữ.
 * Coi như không có ảnh để website dùng ảnh mặc định đẹp hơn (public/images/products).
 */
const PLACEHOLDER_HOSTS = /^(https?:)?\/\/([a-z0-9-]+\.)*(placehold\.co|placehold\.it|placeholder\.com|dummyimage\.com|fakeimg\.pl)(\/|$)/i;

export function isRealImage(url: string | null | undefined): url is string {
  return !!url && !PLACEHOLDER_HOSTS.test(url.trim());
}
