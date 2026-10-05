"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/format";

/**
 * Phụ kiện: chọn ảnh mặc định theo từ khoá trong tên (đã bỏ dấu). Thứ tự quan trọng:
 * "sạc dự phòng" phải khớp powerbank trước khi khớp "sạc" → củ sạc; "cáp sạc" khớp cáp trước củ sạc.
 */
const ACCESSORY_KEYWORDS: [string, string[]][] = [
  ["watch", ["dong-ho", "watch", "smartwatch", "vong-deo"]],
  ["glass", ["cuong-luc", "kinh", "dan-man", "mieng-dan", "ppf"]],
  ["case", ["op", "op-lung", "bao-da", "case"]],
  ["powerbank", ["du-phong", "powerbank", "pin-sac"]],
  ["cable", ["cap", "cable", "day-sac", "lightning"]],
  ["earbuds", ["tai-nghe", "airpods", "earbuds", "buds", "headphone", "earphone"]],
  ["charger", ["sac", "cu-sac", "adapter", "charger"]],
];

/** Ảnh mặc định (public/images/products) khi sản phẩm chưa có ảnh hoặc link ảnh admin nhập bị lỗi. */
export function placeholderImage(category: string, name = "") {
  if (category === "IPHONE") return "/images/products/iphone.svg";
  if (category === "ANDROID") return "/images/products/android.svg";
  // So khớp nguyên cụm từ: "-op-" không khớp nhầm "hop" / "top"
  const s = `-${slugify(name)}-`;
  const hit = ACCESSORY_KEYWORDS.find(([, words]) => words.some((w) => s.includes(`-${w}-`)));
  return `/images/products/${hit?.[0] ?? "accessory"}.svg`;
}

/**
 * Ảnh sản phẩm (nền do khung bên ngoài quyết định). Dùng <img> thường vì link ảnh do admin nhập từ nhiều nguồn
 * (không phải cấu hình domain cho next/image).
 */
export function ProductImage({
  src,
  alt,
  name = alt,
  category,
  className = "",
  priority = false,
}: {
  src: string | null;
  alt: string;
  /** Tên sản phẩm để chọn ảnh mặc định (mặc định = alt) */
  name?: string;
  category: string;
  className?: string;
  priority?: boolean;
}) {
  // Link ảnh lỗi (404, bị chặn…) → chuyển sang ảnh mặc định
  const [failed, setFailed] = useState<string | null>(null);
  const url = src && src !== failed ? src : placeholderImage(category, name);
  const ref = useRef<HTMLImageElement>(null);

  // Ảnh lỗi trước khi React hydrate thì onError không chạy → kiểm tra lại sau khi mount
  useEffect(() => {
    const img = ref.current;
    if (src && img?.complete && img.naturalWidth === 0) setFailed(src);
  }, [src]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={url}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      onError={() => src && setFailed(src)}
      className={`h-full w-full object-contain ${className}`}
    />
  );
}
