import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { slugify } from "@/lib/format";
import { getShopCatalog, SHOP_CATEGORIES } from "@/lib/shop";
import { ProductCard } from "@/components/ProductCard";

type Params = { cat?: string; cond?: string; sort?: string; q?: string };

const SORTS = [
  { key: "new", label: "Mới về" },
  { key: "price-asc", label: "Giá thấp → cao" },
  { key: "price-desc", label: "Giá cao → thấp" },
] as const;

export async function generateMetadata({ searchParams }: { searchParams: Promise<Params> }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = SHOP_CATEGORIES.find((c) => c.key === sp.cat);
  return { title: cat?.label ?? (sp.cond === "used" ? "Máy cũ" : "Tất cả sản phẩm") };
}

export default async function Products({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const cat = SHOP_CATEGORIES.find((c) => c.key === sp.cat);
  const cond = sp.cond === "new" || sp.cond === "used" ? sp.cond : "";
  const sort = SORTS.find((s) => s.key === sp.sort)?.key ?? "new";
  const q = sp.q?.trim() ?? "";

  const { models } = await getShopCatalog();
  const words = slugify(q).split("-").filter(Boolean);
  const list = models
    .filter((m) => !cat || m.category === cat.value)
    .filter((m) => !cond || (cond === "used" ? m.hasUsed : m.hasNew))
    .filter((m) => {
      if (!words.length) return true;
      const hay = slugify(`${m.name} ${m.brand ?? ""} ${m.units.map((u) => u.variant ?? "").join(" ")}`);
      return words.every((w) => hay.includes(w));
    })
    .map((m) => {
      // Lọc "Mới" / "Máy cũ" thì giá "Từ ..." và số máy tính theo đúng tình trạng đó
      if (!cond) return m;
      const units = m.units.filter((u) => u.condition === (cond === "used" ? "USED" : "NEW"));
      const prices = units.map((u) => u.price);
      return {
        ...m,
        units,
        count: units.length,
        hasNew: cond === "new",
        hasUsed: cond === "used",
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
      };
    });
  if (sort === "price-asc") list.sort((a, b) => a.minPrice - b.minPrice);
  if (sort === "price-desc") list.sort((a, b) => b.minPrice - a.minPrice);

  const qs = (patch: Partial<Params>) => {
    const next = { cat: cat?.key, cond, sort: sort === "new" ? "" : sort, q, ...patch };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/products?${s}` : "/products";
  };

  const title = cat?.label ?? (cond === "used" ? "Máy cũ" : "Tất cả sản phẩm");

  return (
    <div className="container-shop pt-10 sm:pt-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{title}</h1>

      <form action="/products" className="relative mt-8 max-w-xl">
        {cat && <input type="hidden" name="cat" value={cat.key} />}
        {cond && <input type="hidden" name="cond" value={cond} />}
        {sort !== "new" && <input type="hidden" name="sort" value={sort} />}
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#6e6e73]"
          aria-hidden
        />
        <input
          name="q"
          defaultValue={q}
          type="search"
          aria-label="Tìm sản phẩm"
          placeholder="Tìm iPhone 15, Galaxy, tai nghe…"
          className="h-12 w-full rounded-full bg-[#f5f5f7] pr-4 pl-11 text-[15px] outline-none transition focus:bg-white focus:ring-2 focus:ring-[#0071e3]"
        />
      </form>

      {/* Bộ lọc dạng chip, cuộn ngang trên điện thoại */}
      <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
        <Link href={qs({ cat: "" })} className="chip" aria-current={!cat}>
          Tất cả
        </Link>
        {SHOP_CATEGORIES.map((c) => (
          <Link key={c.key} href={qs({ cat: c.key })} className="chip" aria-current={cat?.key === c.key}>
            {c.label}
          </Link>
        ))}
        <span className="mx-1 w-px shrink-0 bg-[#d2d2d7]" aria-hidden />
        <Link href={qs({ cond: cond === "new" ? "" : "new" })} className="chip" aria-current={cond === "new"}>
          Mới
        </Link>
        <Link href={qs({ cond: cond === "used" ? "" : "used" })} className="chip" aria-current={cond === "used"}>
          Máy cũ
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-[#d2d2d7] pb-3 text-[14px]">
        <p className="text-[#6e6e73]">
          {list.length} sản phẩm{q && <> cho “{q}”</>}
        </p>
        <div className="flex gap-4">
          {SORTS.map((s) => (
            <Link
              key={s.key}
              href={qs({ sort: s.key === "new" ? "" : s.key })}
              className={sort === s.key ? "font-semibold text-[#1d1d1f]" : "text-[#6e6e73] hover:text-[#1d1d1f]"}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      {list.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
          {list.map((m) => (
            <ProductCard key={m.slug} model={m} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-2xl font-semibold tracking-tight">Chưa có sản phẩm phù hợp.</p>
          <p className="mt-2 text-[#6e6e73]">Thử bỏ bớt bộ lọc hoặc tìm với từ khoá khác.</p>
          <Link href="/products" className="btn mt-8">
            Xem tất cả sản phẩm
          </Link>
        </div>
      )}
    </div>
  );
}
