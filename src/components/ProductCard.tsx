import Link from "next/link";
import { CATEGORY_LABEL, formatPrice } from "@/lib/format";
import type { ShopModel } from "@/lib/shop";
import { ProductImage } from "./ProductImage";

/** Thẻ sản phẩm kiểu Nike: ảnh vuông nền xám, tên đậm, dòng phụ xám, giá. */
export function ProductCard({ model, className = "" }: { model: ShopModel; className?: string }) {
  const isPhone = model.category !== "ACCESSORY";
  const tag = model.hasUsed && !model.hasNew ? "Máy cũ" : model.hasUsed ? "Mới & cũ" : isPhone ? "Mới" : null;
  const options = optionSummary(model);

  return (
    <Link href={`/p/${model.slug}`} className={`group block ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f5f7]">
        <ProductImage
          src={model.imageUrl}
          alt={model.name}
          category={model.category}
          className="p-8 transition duration-500 group-hover:scale-[1.04]"
        />
        {tag && (
          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[13px] font-medium backdrop-blur">
            {tag}
          </span>
        )}
        {model.maxDiscount > 0 && (
          <span className="absolute top-3 right-3 rounded-full bg-[#1d1d1f] px-2.5 py-1 text-[13px] font-semibold text-white">
            -{model.maxDiscount}%
          </span>
        )}
      </div>
      <div className="mt-3 space-y-0.5 px-0.5">
        <p className="text-[14px] text-[#6e6e73]">{model.brand ?? CATEGORY_LABEL[model.category]}</p>
        <h3 className="text-[17px] leading-snug font-semibold tracking-tight group-hover:underline">{model.name}</h3>
        {options && <p className="text-[14px] text-[#6e6e73]">{options}</p>}
        <p className="pt-1 text-[15px] font-medium tabular-nums">
          {model.minPrice > 0 && model.minPrice !== model.maxPrice && (
            <span className="font-normal text-[#6e6e73]">Từ </span>
          )}
          {formatPrice(model.minPrice)}
        </p>
      </div>
    </Link>
  );
}

function optionSummary(m: ShopModel) {
  const colors = new Set(m.units.map((u) => u.variant).filter(Boolean)).size;
  const caps = new Set(m.units.map((u) => u.storageGb).filter(Boolean)).size;
  const parts: string[] = [];
  if (caps > 1) parts.push(`${caps} dung lượng`);
  if (colors > 1) parts.push(`${colors} màu`);
  if (m.category !== "ACCESSORY" && m.count > 1) parts.push(`Còn ${m.count} máy`);
  return parts.join(" · ");
}
