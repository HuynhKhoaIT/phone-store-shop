"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, Smartphone, X } from "lucide-react";

const LINKS = [
  { href: "/products?cat=iphone", label: "iPhone" },
  { href: "/products?cat=android", label: "Android" },
  { href: "/products?cat=accessory", label: "Phụ kiện" },
  { href: "/products?cond=used", label: "Máy cũ" },
  { href: "/#sua-chua", label: "Sửa chữa" },
  { href: "/#cua-hang", label: "Cửa hàng" },
];

/** Thanh điều hướng trên cùng: mờ trong suốt kiểu Apple; trên điện thoại mở menu toàn màn hình. */
export function ShopNav({ shopName }: { shopName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const search = useSearchParams();

  // Đóng menu khi chuyển trang
  useEffect(() => setOpen(false), [pathname, search]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
      <nav className="container-shop flex h-14 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-[17px] font-semibold tracking-tight">
          <Smartphone size={20} strokeWidth={2.2} aria-hidden />
          {shopName}
        </Link>
        <ul className="mx-auto hidden items-center gap-7 text-[13px] text-[#1d1d1f]/80 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition hover:text-[#1d1d1f]">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            href="/products"
            aria-label="Tìm sản phẩm"
            className="grid size-10 place-items-center rounded-full transition hover:bg-black/5"
          >
            <Search size={18} aria-hidden />
          </Link>
          <button
            type="button"
            aria-label={open ? "Đóng menu" : "Mở menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-10 place-items-center rounded-full transition hover:bg-black/5 md:hidden"
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="fixed inset-x-0 top-14 bottom-0 bg-white md:hidden">
          <ul className="container-shop flex flex-col pt-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-3 text-2xl font-semibold tracking-tight">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
