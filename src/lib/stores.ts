/**
 * Hệ thống cửa hàng hiển thị trên website (địa chỉ, hotline, chỉ đường).
 * Cơ sở đầu tiên là cơ sở chính: hotline của nó là hotline mặc định của nút Gọi / Zalo
 * (ghi đè bằng biến môi trường SHOP_PHONE / SHOP_ZALO nếu cần).
 */
export type Store = { name: string; address: string; phone: string };

export const STORES: Store[] = [
  {
    name: "Cơ sở Tân Hy",
    address: "Thôn Tân Hy, Xã Vạn Tường, Tỉnh Quảng Ngãi",
    phone: "0869 950 090",
  },
  {
    name: "Cơ sở Đông Lỗ",
    address: "Thôn Đông Lỗ, Xã Vạn Tường, Tỉnh Quảng Ngãi",
    phone: "0964 824 588",
  },
];

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function mapHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
