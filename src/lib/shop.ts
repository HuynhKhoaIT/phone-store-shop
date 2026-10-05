import "server-only";
import { slugify } from "./format";

/**
 * Dữ liệu trang bán hàng, lấy từ API công khai của trang quản trị (phone-store-manager, /api/public/*).
 * Admin quản lý ảnh, mô tả, giá khuyến mãi, nổi bật, ẩn/hiện trên web ở trang quản trị.
 * Response được cache 60 giây (Next.js Data Cache) → thay đổi bên quản trị hiện lên web chậm tối đa ~1 phút.
 */
const REVALIDATE_SECONDS = 60;

function apiUrl(path: string) {
  const base = process.env.ADMIN_API_URL?.trim().replace(/\/+$/, "");
  if (!base) throw new Error("Thiếu biến môi trường ADMIN_API_URL (địa chỉ trang quản trị, vd https://admin.example.com)");
  return `${base}/api/public${path}`;
}

/** GET JSON từ API quản trị. `optional` = endpoint chưa có (404) thì trả null thay vì lỗi. */
export async function getJson<T>(path: string, optional = false): Promise<T | null> {
  const res = await fetch(apiUrl(path), { next: { revalidate: REVALIDATE_SECONDS } });
  if (optional && res.status === 404) return null;
  if (!res.ok) throw new Error(`API ${path} lỗi ${res.status}`);
  return res.json() as Promise<T>;
}

/** Sản phẩm trả về từ /api/public/products (chỉ các trường trang này dùng — xem PublicProduct bên quản trị). */
type ApiProduct = {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  condition: "NEW" | "USED";
  ramGb: number | null;
  storageGb: number | null;
  color: string | null;
  batteryHealth: number | null;
  warrantyMonths: number;
  price: number;
  finalPrice: number;
  featured: boolean;
  sortOrder: number;
  images: string[];
  description: string | null;
  updatedAt: string;
};
type ApiPage = { items: ApiProduct[]; page: number; totalPages: number };

/** Một sản phẩm cụ thể đang bán (một máy có IMEI, hoặc một dòng phụ kiện). */
export type ShopUnit = {
  id: number;
  condition: string; // NEW | USED
  ramGb: number | null;
  storageGb: number | null;
  variant: string | null;
  batteryHealth: number | null;
  /** Giá thực bán (đã trừ khuyến mãi) */
  price: number;
  /** Giá niêm yết — lớn hơn `price` khi đang khuyến mãi */
  listPrice: number;
  warrantyMonths: number;
};

/** Một dòng máy (gom các sản phẩm cùng tên + loại) — mỗi dòng là một trang chi tiết. */
export type ShopModel = {
  slug: string;
  category: string; // IPHONE | ANDROID | ACCESSORY
  name: string;
  brand: string | null;
  /** Ảnh đại diện = ảnh đầu tiên của `images` */
  imageUrl: string | null;
  images: string[];
  description: string | null;
  featured: boolean;
  sortOrder: number;
  minPrice: number;
  maxPrice: number;
  /** % giảm lớn nhất trong các máy của dòng (0 = không khuyến mãi) */
  maxDiscount: number;
  hasNew: boolean;
  hasUsed: boolean;
  /** Số sản phẩm đang bán (với điện thoại = số máy) */
  count: number;
  /** Thời điểm cập nhật gần nhất (ms) để sắp xếp "Mới về" */
  latestAt: number;
  units: ShopUnit[];
};

export type ShopService = { service: string; minPrice: number; devices: number };
export type ShopBranch = { id: number; name: string };

/** Danh mục trên URL (/products?cat=iphone) ↔ category trong DB */
export const SHOP_CATEGORIES = [
  { key: "iphone", value: "IPHONE", label: "iPhone" },
  { key: "android", value: "ANDROID", label: "Android" },
  { key: "accessory", value: "ACCESSORY", label: "Phụ kiện" },
] as const;

/** Toàn bộ sản phẩm đang bán (API phân trang tối đa 100 / trang). */
async function fetchAllProducts() {
  const items: ApiProduct[] = [];
  for (let page = 1; ; page++) {
    const data = (await getJson<ApiPage>(`/products?pageSize=100&page=${page}&sort=featured`))!;
    items.push(...data.items);
    if (page >= data.totalPages) return items;
  }
}

export async function getShopCatalog() {
  const [products, repairs] = await Promise.all([
    fetchAllProducts(),
    getJson<{ items: { service: string; price: number }[] }>("/repair-prices", true),
  ]);

  const byKey = new Map<string, ShopModel>();
  for (const p of products) {
    const key = `${p.category}|${p.name.trim().toLowerCase()}`;
    let m = byKey.get(key);
    if (!m) {
      m = {
        slug: slugify(p.name) || String(p.id),
        category: p.category,
        name: p.name.trim(),
        brand: p.brand,
        imageUrl: null,
        images: [],
        description: null,
        featured: false,
        sortOrder: p.sortOrder,
        minPrice: p.finalPrice,
        maxPrice: p.finalPrice,
        maxDiscount: 0,
        hasNew: false,
        hasUsed: false,
        count: 0,
        latestAt: 0,
        units: [],
      };
      byKey.set(key, m);
    }
    m.brand ??= p.brand;
    m.description ??= p.description;
    for (const img of p.images) if (!m.images.includes(img)) m.images.push(img);
    m.featured ||= p.featured;
    m.sortOrder = Math.min(m.sortOrder, p.sortOrder);
    m.minPrice = Math.min(m.minPrice, p.finalPrice);
    m.maxPrice = Math.max(m.maxPrice, p.finalPrice);
    if (p.finalPrice < p.price) m.maxDiscount = Math.max(m.maxDiscount, Math.round((1 - p.finalPrice / p.price) * 100));
    if (p.condition === "USED") m.hasUsed = true;
    else m.hasNew = true;
    m.count++;
    m.latestAt = Math.max(m.latestAt, Date.parse(p.updatedAt) || 0);
    m.units.push({
      id: p.id,
      condition: p.condition,
      ramGb: p.ramGb,
      storageGb: p.storageGb,
      variant: p.color,
      batteryHealth: p.batteryHealth,
      price: p.finalPrice,
      listPrice: p.price,
      warrantyMonths: p.warrantyMonths,
    });
  }

  // Cùng tên ở hai loại khác nhau → thêm hậu tố để slug không trùng
  const models = [...byKey.values()];
  const seen = new Set<string>();
  for (const m of models) {
    if (seen.has(m.slug)) m.slug = `${m.slug}-${m.category.toLowerCase()}`;
    seen.add(m.slug);
    m.imageUrl = m.images[0] ?? null;
    m.units.sort((a, b) => a.price - b.price);
  }
  models.sort((a, b) => b.latestAt - a.latestAt);

  const services = new Map<string, ShopService>();
  for (const r of repairs?.items ?? []) {
    const s = services.get(r.service);
    if (s) {
      s.minPrice = Math.min(s.minPrice, r.price);
      s.devices++;
    } else services.set(r.service, { service: r.service, minPrice: r.price, devices: 1 });
  }

  return {
    models,
    /** Sản phẩm admin đánh dấu nổi bật, theo thứ tự admin sắp */
    featured: models.filter((m) => m.featured).sort((a, b) => a.sortOrder - b.sortOrder),
    services: [...services.values()].sort((a, b) => b.devices - a.devices),
    maxWarranty: products.reduce((max, p) => Math.max(max, p.warrantyMonths), 0),
  };
}

/** Chi nhánh đang hoạt động — endpoint /api/public/branches chưa có thì trả mảng rỗng (ẩn mục cửa hàng). */
export async function getBranches(): Promise<ShopBranch[]> {
  const data = await getJson<{ items: ShopBranch[] }>("/branches", true).catch(() => null);
  return data?.items ?? [];
}

/** Thông tin liên hệ hiển thị trên trang (biến môi trường SHOP_*). */
export function getShopInfo() {
  const phone = process.env.SHOP_PHONE?.trim() || null;
  const zalo = process.env.SHOP_ZALO?.trim() || phone;
  return {
    name: process.env.SHOP_NAME?.trim() || "Tài Khoa Mobile",
    phone,
    phoneHref: phone ? `tel:${phone.replace(/[^\d+]/g, "")}` : null,
    zaloHref: zalo ? `https://zalo.me/${zalo.replace(/\D/g, "")}` : null,
    facebookHref: process.env.SHOP_FACEBOOK?.trim() || null,
  };
}
