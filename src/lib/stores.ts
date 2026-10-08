/**
 * Cửa hàng hiển thị trên website — admin nhập ở trang quản trị (Chi nhánh › Hiển thị trên web),
 * lấy qua /api/public/branches (getStores trong shop.ts). Cửa hàng đầu tiên = hotline / Zalo chính.
 */
export type Store = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  zaloUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  openingHours: string | null;
  /** Link "Chỉ đường" (Google Maps) */
  mapUrl: string | null;
  /** Link bản đồ nhúng cho <iframe> */
  mapEmbedUrl: string | null;
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
