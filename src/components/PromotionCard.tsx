import Link from "next/link";
import { ArrowLeftRight, BadgePercent, CalendarDays, CreditCard, Gift, MapPin, Sparkles, type LucideIcon } from "lucide-react";
import { promotionPeriod, type PromotionBadge, type PromotionSummary } from "@/lib/promotions";

const TYPE_STYLE: Record<string, { icon: LucideIcon; bg: string }> = {
  DISCOUNT: { icon: BadgePercent, bg: "from-orange-200 to-rose-200" },
  GIFT: { icon: Gift, bg: "from-rose-200 to-pink-200" },
  INSTALLMENT: { icon: CreditCard, bg: "from-fuchsia-200 to-violet-200" },
  TRADE_IN: { icon: ArrowLeftRight, bg: "from-amber-200 to-yellow-100" },
  OTHER: { icon: Sparkles, bg: "from-sky-200 to-indigo-200" },
};
const styleOf = (type: string) => TYPE_STYLE[type] ?? TYPE_STYLE.OTHER;

/** Ảnh banner chương trình; chưa có ảnh thì khối màu + icon theo loại ưu đãi. */
export function PromotionBanner({ promo, className = "" }: { promo: PromotionSummary; className?: string }) {
  if (promo.bannerUrl)
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={promo.bannerUrl} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  const { icon: Icon, bg } = styleOf(promo.type);
  return (
    <div className={`grid h-full w-full place-items-center bg-gradient-to-br ${bg} ${className}`}>
      <Icon size={56} strokeWidth={1.2} className="text-[#1d1d1f]/50" aria-hidden />
    </div>
  );
}

/** "Áp dụng tại Cơ sở Tân Hy" — rỗng = mọi cửa hàng nên không ghi */
export function branchText(branches: string[]) {
  return branches.length ? `Áp dụng tại ${branches.join(", ")}` : null;
}

export function PromotionCard({ promo }: { promo: PromotionSummary }) {
  const where = branchText(promo.branches);
  return (
    <Link href={`/khuyen-mai/${promo.slug}`} className="group block">
      <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-[#f5f5f7]">
        <PromotionBanner promo={promo} className="transition duration-500 group-hover:scale-[1.03]" />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[13px] font-semibold text-accent backdrop-blur">
          {promo.status === "UPCOMING" ? "Sắp diễn ra" : promo.typeLabel}
        </span>
      </div>
      <div className="mt-4 space-y-1.5">
        <h3 className="text-[19px] leading-snug font-semibold tracking-tight group-hover:underline">{promo.title}</h3>
        <p className="line-clamp-2 text-[15px] text-[#1d1d1f]/85">{promo.summary}</p>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-[#6e6e73]">
          <span className="inline-flex items-center gap-1">
            <CalendarDays size={14} aria-hidden />
            {promotionPeriod(promo)}
          </span>
          {where && (
            <span className="inline-flex items-center gap-1">
              <MapPin size={14} aria-hidden />
              {where}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

/** Khối "Ưu đãi" ở trang chi tiết sản phẩm: các chương trình đang áp dụng cho dòng máy. */
export function PromotionList({ promotions, className = "" }: { promotions: PromotionBadge[]; className?: string }) {
  if (promotions.length === 0) return null;
  return (
    <section className={`rounded-2xl border border-accent/30 bg-accent/5 p-5 ${className}`}>
      <p className="flex items-center gap-2 text-[17px] font-semibold">
        <Gift size={18} className="text-accent" aria-hidden /> Ưu đãi
      </p>
      <ul className="mt-3 space-y-3">
        {promotions.map((p) => {
          const { icon: Icon } = styleOf(p.type);
          const meta = [promotionPeriod({ startDate: "", endDate: p.endDate }), branchText(p.branches)].filter(Boolean);
          return (
            <li key={p.slug} className="flex gap-3">
              <Icon size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div className="text-[15px]">
                <p>{p.summary || p.title}</p>
                <p className="text-[14px] text-[#6e6e73]">
                  {meta.join(" · ")} ·{" "}
                  <Link href={`/khuyen-mai/${p.slug}`} className="text-accent hover:underline">
                    Chi tiết
                  </Link>
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
