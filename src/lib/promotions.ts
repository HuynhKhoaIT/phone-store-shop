import "server-only";
import { isRealImage } from "./format";
import { getJson } from "./shop";

/**
 * Chương trình khuyến mãi — admin tạo ở trang quản trị (Quản lý › Khuyến mãi), lấy qua /api/public/promotions.
 * Giảm giá (DISCOUNT) đã được trừ sẵn vào giá sản phẩm (finalPrice) bên API; ở đây chỉ hiện thông tin chương trình.
 */

export type PromotionStatus = "RUNNING" | "UPCOMING" | "ENDED";

export type PromotionSummary = {
  id: number;
  slug: string;
  title: string;
  type: string; // DISCOUNT | GIFT | INSTALLMENT | TRADE_IN | OTHER
  typeLabel: string;
  summary: string;
  bannerUrl: string | null;
  startDate: string; // YYYY-MM-DD
  endDate: string | null;
  status: PromotionStatus;
  featured: boolean;
  /** Tên chi nhánh áp dụng; rỗng = mọi cửa hàng */
  branches: string[];
  productCount: number;
};

/** contentHtml đã được trang quản trị làm sạch (như bài viết) → chèn trực tiếp được */
export type Promotion = PromotionSummary & { contentHtml: string };

/** Ưu đãi gắn trên từng sản phẩm (PublicProduct.promotions) */
export type PromotionBadge = {
  slug: string;
  title: string;
  type: string;
  typeLabel: string;
  summary: string;
  discountAmount: number;
  endDate: string | null;
  branches: string[];
};

function cleanBanner<T extends { bannerUrl: string | null }>(p: T): T {
  return { ...p, bannerUrl: p.bannerUrl && isRealImage(p.bannerUrl) ? p.bannerUrl : null };
}

/** Chương trình đang diễn ra (kèm sắp diễn ra nếu `includeUpcoming`). Endpoint chưa có / lỗi → rỗng. */
export async function getPromotions(includeUpcoming = false): Promise<PromotionSummary[]> {
  try {
    const data = await getJson<{ items: PromotionSummary[] }>(
      `/promotions${includeUpcoming ? "?includeUpcoming=1" : ""}`,
      true,
    );
    return (data?.items ?? []).map(cleanBanner);
  } catch (e) {
    console.error(e);
    return [];
  }
}

/** Một chương trình + id các sản phẩm áp dụng; không có → null. */
export async function getPromotion(slug: string) {
  const data = await getJson<{ promotion: Promotion; products: { id: number }[] }>(
    `/promotions/${encodeURIComponent(slug)}`,
    true,
  );
  if (!data) return null;
  return { promotion: cleanBanner(data.promotion), productIds: new Set(data.products.map((p) => p.id)) };
}

/** "Đến hết 31/10" / "Không thời hạn" */
export function promotionPeriod(p: { startDate: string; endDate: string | null; status?: PromotionStatus }) {
  const d = (s: string) => s.split("-").reverse().slice(0, 2).join("/");
  if (p.status === "UPCOMING") return `Bắt đầu ${d(p.startDate)}${p.endDate ? ` – ${d(p.endDate)}` : ""}`;
  return p.endDate ? `Đến hết ${d(p.endDate)}` : "Không thời hạn";
}
