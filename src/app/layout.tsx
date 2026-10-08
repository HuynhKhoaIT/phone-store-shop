import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getShopInfo, SHOP_CATEGORIES } from "@/lib/shop";
import { STORES, mapHref, telHref } from "@/lib/stores";
import { ShopNav } from "@/components/ShopNav";
import { MobileContactBar } from "@/components/MobileContactBar";
import { SocialList } from "@/components/SocialLinks";
import "./globals.css";

// Render theo request (không cần DB lúc build); dữ liệu đã được cache 60s trong lib/shop.ts
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { name } = getShopInfo();
  return {
    title: { default: `${name} — Điện thoại & phụ kiện`, template: `%s | ${name}` },
    description: `${name}: iPhone, Android, phụ kiện và máy cũ giá tốt, bảo hành tại cửa hàng.`,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const info = getShopInfo();

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] antialiased md:pb-0">
        <Suspense fallback={<div className="h-14 border-b border-black/5" />}>
          <ShopNav shopName={info.name} />
        </Suspense>
        <main className="flex-1">{children}</main>
        <footer className="mt-24 bg-[#f5f5f7] text-[14px] text-[#6e6e73]">
          <div className="container-shop pt-12">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt={info.name} width={1736} height={327} className="h-9 w-auto" />
            </Link>
          </div>
          <div className="container-shop grid gap-8 pt-8 pb-12 sm:grid-cols-3">
            <div>
              <p className="font-semibold text-[#1d1d1f]">Sản phẩm</p>
              <ul className="mt-3 space-y-2">
                {SHOP_CATEGORIES.map((c) => (
                  <li key={c.key}>
                    <Link href={`/products?cat=${c.key}`} className="hover:underline">
                      {c.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/products?cond=used" className="hover:underline">
                    Máy cũ giá tốt
                  </Link>
                </li>
                <li>
                  <Link href="/sua-chua" className="hover:underline">
                    Sửa chữa điện thoại
                  </Link>
                </li>
                <li>
                  <Link href="/tin-tuc" className="hover:underline">
                    Tin tức & khuyến mãi
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f]">Hệ thống cửa hàng</p>
              <ul className="mt-3 space-y-4">
                {STORES.map((s) => (
                  <li key={s.name}>
                    <p className="text-[#1d1d1f]">{s.name}</p>
                    <a href={mapHref(s.address)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {s.address}
                    </a>
                    <p>
                      Hotline:{" "}
                      <a href={telHref(s.phone)} className="text-[#1d1d1f] hover:underline">
                        {s.phone}
                      </a>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-[#1d1d1f]">Liên hệ</p>
              <ul className="mt-3 space-y-2">
                {info.phone && info.phoneHref && (
                  <li>
                    Hotline:{" "}
                    <a href={info.phoneHref} className="text-[#1d1d1f] hover:underline">
                      {info.phone}
                    </a>
                  </li>
                )}
                {info.zaloHref && (
                  <li>
                    <a href={info.zaloHref} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Zalo
                    </a>
                  </li>
                )}
                <SocialList />
              </ul>
            </div>
          </div>
          <div className="container-shop border-t border-black/10 py-5">
            © {new Date().getFullYear()} {info.name}. Giá có thể thay đổi theo thời điểm, vui lòng liên hệ cửa hàng
            để được báo giá chính xác.
          </div>
        </footer>
        <MobileContactBar />
      </body>
    </html>
  );
}
