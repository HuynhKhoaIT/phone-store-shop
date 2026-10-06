import type { MetadataRoute } from "next";
import { getShopCatalog, SHOP_CATEGORIES } from "@/lib/shop";
import { getPosts, type PostSummary } from "@/lib/news";
import { siteUrl } from "@/lib/site";

// Lấy dữ liệu lúc có request (build không cần gọi API quản trị); API đã cache 60s
export const dynamic = "force-dynamic";

/** Sitemap cho Google: trang chính, từng dòng máy, từng bài viết. API lỗi thì vẫn trả các trang cố định. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const pages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/products`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    ...SHOP_CATEGORIES.map((c) => ({
      url: `${base}/products?cat=${c.key}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    { url: `${base}/products?cond=used`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/sua-chua`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/tin-tuc`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const [catalog, posts] = await Promise.all([getShopCatalog().catch(() => null), getAllPosts().catch(() => [])]);
  for (const m of catalog?.models ?? []) {
    pages.push({
      url: `${base}/p/${m.slug}`,
      lastModified: m.latestAt ? new Date(m.latestAt) : now,
      changeFrequency: "daily",
      priority: 0.8,
      images: m.imageUrl ? [m.imageUrl] : undefined,
    });
  }
  for (const p of posts) {
    pages.push({
      url: `${base}/tin-tuc/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }
  return pages;
}

async function getAllPosts() {
  const all: PostSummary[] = [];
  for (let page = 1; page <= 20; page++) {
    const data = await getPosts({ page, pageSize: 50 });
    all.push(...data.items);
    if (page >= data.totalPages) break;
  }
  return all;
}
