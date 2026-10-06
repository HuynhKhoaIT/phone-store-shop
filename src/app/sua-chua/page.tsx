import type { Metadata } from "next";
import Link from "next/link";
import { Search, ShieldCheck, Wrench } from "lucide-react";
import { formatPrice, slugify } from "@/lib/format";
import { getRepairPrices } from "@/lib/shop";
import { ContactButtons } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Sửa chữa điện thoại",
  description: "Bảng giá thay pin, thay màn hình, sửa chữa iPhone và Android, bảo hành tại cửa hàng.",
};

export default async function Repair({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = (await searchParams).q?.trim() ?? "";
  const all = await getRepairPrices();

  // Tìm không dấu theo dòng máy hoặc tên dịch vụ ("13 pro" → iPhone 13 Pro, "pin" → Thay pin)
  const words = slugify(q).split("-").filter(Boolean);
  const groups = all
    .map((g) => ({
      ...g,
      items: g.items.filter((r) => {
        const hay = slugify(`${r.service} ${r.device}`);
        return words.every((w) => hay.includes(w));
      }),
    }))
    .filter((g) => g.items.length > 0);
  const count = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="container-shop pt-10 sm:pt-14">
      <p className="eyebrow text-accent">Dịch vụ</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-6xl">Sửa chữa điện thoại.</h1>
      <p className="mt-4 max-w-2xl text-[17px] text-[#6e6e73]">
        Giá tham khảo; dịch vụ ghi &quot;Liên hệ&quot; có giá thay đổi theo linh kiện. Kỹ thuật viên kiểm tra máy và
        báo giá chính xác trước khi sửa.
      </p>

      {all.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-2xl font-semibold tracking-tight">Bảng giá đang được cập nhật.</p>
          <p className="mt-2 text-[#6e6e73]">Liên hệ cửa hàng để được báo giá sửa chữa.</p>
          <ContactButtons className="mt-8 justify-center" />
        </div>
      ) : (
        <>
          <form action="/sua-chua" className="relative mt-8 max-w-xl">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[#6e6e73]"
              aria-hidden
            />
            <input
              name="q"
              defaultValue={q}
              type="search"
              aria-label="Tìm dòng máy"
              placeholder="Tìm dòng máy: iPhone 13, Galaxy A54…"
              className="h-12 w-full rounded-full bg-[#f5f5f7] pr-4 pl-11 text-[15px] outline-none transition focus:bg-white focus:ring-2 focus:ring-accent"
            />
          </form>

          {/* Nhảy nhanh tới từng dịch vụ, cuộn ngang trên điện thoại */}
          {groups.length > 1 && (
            <div className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
              {groups.map((g) => (
                <a key={g.slug} href={`#${g.slug}`} className="chip">
                  {g.service}
                </a>
              ))}
            </div>
          )}

          {q && (
            <p className="mt-6 text-[14px] text-[#6e6e73]">
              {count} kết quả cho “{q}” ·{" "}
              <Link href="/sua-chua" className="text-accent hover:underline">
                Xem tất cả
              </Link>
            </p>
          )}

          {groups.length > 0 ? (
            <div className="mt-10 space-y-14">
              {groups.map((g) => (
                <section key={g.slug} id={g.slug} className="scroll-mt-20">
                  <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f5f5f7]">
                      <Wrench size={18} aria-hidden />
                    </span>
                    {g.service}
                  </h2>
                  <ul className="mt-5 divide-y divide-[#d2d2d7] border-y border-[#d2d2d7]">
                    {g.items.map((r) => (
                      <li key={r.device} className="flex items-center justify-between gap-4 py-4">
                        <div className="min-w-0">
                          <p className="text-[17px] font-medium">{r.device}</p>
                          {r.warranty && (
                            <p className="mt-0.5 flex items-center gap-1.5 text-[14px] text-[#6e6e73]">
                              <ShieldCheck size={15} aria-hidden /> Bảo hành {r.warranty}
                            </p>
                          )}
                        </div>
                        <p
                          className={`shrink-0 text-[17px] font-semibold tabular-nums ${r.price > 0 ? "" : "text-accent"}`}
                        >
                          {formatPrice(r.price)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-2xl font-semibold tracking-tight">Chưa có giá cho “{q}”.</p>
              <p className="mt-2 text-[#6e6e73]">Liên hệ cửa hàng, kỹ thuật viên sẽ báo giá cho máy của bạn.</p>
            </div>
          )}

          <div className="mt-16 rounded-3xl bg-[#f5f5f7] p-7 sm:p-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Không thấy máy của bạn?</h2>
            <p className="mt-2 text-[17px] text-[#6e6e73]">Nhắn Zalo hoặc gọi, gửi tên máy và tình trạng để được báo giá.</p>
            <ContactButtons className="mt-6" />
          </div>
        </>
      )}
    </div>
  );
}
