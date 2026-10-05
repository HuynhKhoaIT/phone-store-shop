"use client";

import { useState } from "react";
import { ProductImage } from "./ProductImage";

/** Ảnh lớn + dãy ảnh nhỏ để chuyển (ảnh do admin thêm ở trang quản trị). */
export function ProductGallery({ images, alt, category }: { images: string[]; alt: string; category: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0] ?? null;

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-3xl bg-[#f5f5f7]">
        <ProductImage src={current} alt={alt} category={category} className="p-10" priority />
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Ảnh ${i + 1}`}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
              className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 bg-[#f5f5f7] transition ${
                i === index ? "border-[#0071e3]" : "border-transparent hover:border-[#d2d2d7]"
              }`}
            >
              <ProductImage src={src} alt="" name={alt} category={category} className="p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
