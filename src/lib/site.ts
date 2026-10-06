/**
 * Địa chỉ gốc của trang (cho sitemap, robots). Ưu tiên SITE_URL (domain chính thức);
 * chưa đặt thì dùng domain production Vercel tự cấp, chạy local thì localhost.
 */
export function siteUrl() {
  const explicit = process.env.SITE_URL?.trim().replace(/\/+$/, "");
  if (explicit) return explicit;
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3001";
}
