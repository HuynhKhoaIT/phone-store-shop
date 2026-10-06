import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { getPosts, NEWS_CATEGORIES } from "@/lib/news";
import { PostCard, PostCover, PostMeta } from "@/components/PostCard";

type Params = { cat?: string; q?: string; page?: string };

const PAGE_SIZE = 12;

export async function generateMetadata({ searchParams }: { searchParams: Promise<Params> }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = NEWS_CATEGORIES.find((c) => c.key === sp.cat);
  return { title: cat?.label ?? "Tin tức" };
}

export default async function News({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const cat = NEWS_CATEGORIES.find((c) => c.key === sp.cat);
  const q = sp.q?.trim() ?? "";
  const page = Math.max(Number(sp.page) || 1, 1);

  const { items, totalPages, total } = await getPosts({ category: cat?.value, q, page, pageSize: PAGE_SIZE });
  // Trang đầu, không tìm kiếm: bài mới nhất hiện lớn ở trên
  const [lead, ...rest] = page === 1 && !q ? items : [undefined, ...items];

  const qs = (patch: Partial<Params>) => {
    const next = { cat: cat?.key, q, page: "", ...patch };
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(next)) if (v && v !== "1") p.set(k, v);
    const s = p.toString();
    return s ? `/tin-tuc?${s}` : "/tin-tuc";
  };

  return (
    <div className="container-shop pt-10 sm:pt-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">{cat?.label ?? "Tin tức"}</h1>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <Link href={qs({ cat: "" })} className="chip" aria-current={!cat}>
            Tất cả
          </Link>
          {NEWS_CATEGORIES.map((c) => (
            <Link key={c.key} href={qs({ cat: c.key })} className="chip" aria-current={cat?.key === c.key}>
              {c.label}
            </Link>
          ))}
        </div>
        <form action="/tin-tuc" className="relative w-full sm:max-w-xs">
          {cat && <input type="hidden" name="cat" value={cat.key} />}
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#6e6e73]"
            aria-hidden
          />
          <input
            name="q"
            defaultValue={q}
            type="search"
            aria-label="Tìm bài viết"
            placeholder="Tìm bài viết…"
            className="h-10 w-full rounded-full bg-[#f5f5f7] pr-4 pl-10 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-accent"
          />
        </form>
      </div>

      {lead && (
        <Link href={`/tin-tuc/${lead.slug}`} className="group mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="aspect-[16/9] overflow-hidden rounded-3xl bg-[#f5f5f7]">
            <PostCover post={lead} className="transition duration-500 group-hover:scale-[1.02]" />
          </div>
          <div className="space-y-3">
            <PostMeta post={lead} />
            <h2 className="text-3xl leading-tight font-semibold tracking-tight group-hover:underline sm:text-4xl">
              {lead.title}
            </h2>
            <p className="text-[17px] leading-relaxed text-[#6e6e73]">{lead.excerpt}</p>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => p && <PostCard key={p.id} post={p} />)}
        </div>
      )}

      {total === 0 && (
        <div className="py-24 text-center">
          <p className="text-2xl font-semibold tracking-tight">Chưa có bài viết.</p>
          {(q || cat) && (
            <Link href="/tin-tuc" className="btn mt-8">
              Xem tất cả bài viết
            </Link>
          )}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Phân trang" className="mt-16 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={qs({ page: String(n) })}
              aria-current={n === page ? "page" : undefined}
              className={`grid size-10 place-items-center rounded-full text-sm transition ${
                n === page ? "bg-[#1d1d1f] text-white" : "hover:bg-[#f5f5f7]"
              }`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
