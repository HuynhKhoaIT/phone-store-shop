import "server-only";
import { getJson } from "./shop";

/** Tin tức lấy từ API công khai của trang quản trị (/api/public/posts) — admin viết bài ở Quản lý → Tin tức. */

export type PostSummary = {
  id: number;
  slug: string;
  title: string;
  category: "NEWS" | "PROMOTION" | "GUIDE";
  categoryLabel: string;
  excerpt: string;
  coverImageUrl: string | null;
  featured: boolean;
  author: string | null;
  readingMinutes: number;
  publishedAt: string;
  updatedAt: string;
};

/** contentHtml đã được trang quản trị làm sạch (không có HTML viết tay, chỉ link an toàn) → chèn trực tiếp được */
export type Post = PostSummary & { contentHtml: string };

type PostPage = { items: PostSummary[]; total: number; page: number; pageSize: number; totalPages: number };

/** Chuyên mục trên URL (/tin-tuc?cat=khuyen-mai) ↔ category của API */
export const NEWS_CATEGORIES = [
  { key: "tin-tuc", value: "NEWS", label: "Tin tức" },
  { key: "khuyen-mai", value: "PROMOTION", label: "Khuyến mãi" },
  { key: "meo-hay", value: "GUIDE", label: "Mẹo hay" },
] as const;

const EMPTY: PostPage = { items: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };

/** Danh sách bài đã đăng. Endpoint chưa có (trang quản trị bản cũ) → danh sách rỗng. */
export async function getPosts(opts: { category?: string; q?: string; page?: number; pageSize?: number } = {}) {
  const p = new URLSearchParams();
  if (opts.category) p.set("category", opts.category);
  if (opts.q) p.set("q", opts.q);
  p.set("page", String(opts.page ?? 1));
  p.set("pageSize", String(opts.pageSize ?? 12));
  return (await getJson<PostPage>(`/posts?${p}`, true)) ?? EMPTY;
}

/** Một bài viết + bài liên quan; không có (nháp, chưa tới giờ đăng, sai slug) → null. */
export async function getPost(slug: string) {
  return getJson<{ post: Post; related: PostSummary[] }>(`/posts/${encodeURIComponent(slug)}`, true);
}
