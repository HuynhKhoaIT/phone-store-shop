"use client";

import { useEffect, useRef, useState } from "react";

/** Ảnh mặc định (public/images) khi sản phẩm chưa có ảnh hoặc link ảnh admin nhập bị lỗi. */
export function placeholderImage(category: string) {
  return category === "ACCESSORY" ? "/images/placeholder-accessory.svg" : "/images/placeholder-phone.svg";
}

/**
 * Ảnh sản phẩm (nền do khung bên ngoài quyết định). Dùng <img> thường vì link ảnh do admin nhập từ nhiều nguồn
 * (không phải cấu hình domain cho next/image).
 */
export function ProductImage({
  src,
  alt,
  category,
  className = "",
  priority = false,
}: {
  src: string | null;
  alt: string;
  category: string;
  className?: string;
  priority?: boolean;
}) {
  // Link ảnh lỗi (404, bị chặn…) → chuyển sang ảnh mặc định
  const [failed, setFailed] = useState<string | null>(null);
  const url = src && src !== failed ? src : placeholderImage(category);
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
