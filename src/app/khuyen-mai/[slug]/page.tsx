import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, ChevronLeft, MapPin } from "lucide-react";
import { getPromotion, promotionPeriod } from "@/lib/promotions";
import { getShopCatalog } from "@/lib/shop";
import { siteUrl } from "@/lib/site";
import { ContactButtons } from "@/components/ContactButtons";
import { ProductCard } from "@/components/ProductCard";
import { branchText, PromotionBanner } from "@/components/PromotionCard";
import { ShareButtons } from "@/components/ShareButtons";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPromotion((await params).slug);
  if (!data) return { title: "Không tìm thấy chương trình" };
  const { promotion: p } = data;
  const url = `${siteUrl()}/khuyen-mai/${p.slug}`;
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: url },
    // Ảnh / tiêu đề xem trước khi chia sẻ lên Facebook, Zalo...
    openGraph: {
      type: "article",
      url,
      title: p.title,
      description: p.summary,
      images: p.bannerUrl ? [p.bannerUrl] : undefined,
    },
  };
}

export default async function PromotionDetail({ params }: Props) {
  const [data, catalog] = await Promise.all([getPromotion((await params).slug), getShopCatalog()]);
  if (!data) notFound();
  const { promotion: p, productIds } = data;
  // Sản phẩm áp dụng → các dòng máy có ít nhất một máy nằm trong chương trình
  const models = catalog.models.filter((m) => m.units.some((u) => productIds.has(u.id)));
  const where = branchText(p.branches);
  const statusLabel = p.status === "UPCOMING" ? "Sắp diễn ra" : p.status === "ENDED" ? "Đã kết thúc" : p.typeLabel;

  return (
    <>
      <article className="container-shop pt-8 sm:pt-12">
        <div className="mx-auto max-w-[960px]">
          <Link href="/khuyen-mai" className="inline-flex items-center text-[15px] text-accent hover:underline">
            <ChevronLeft size={16} aria-hidden /> Khuyến mãi
          </Link>
          <div className="mt-6 aspect-[16/7] overflow-hidden rounded-3xl bg-[#f5f5f7]">
            <PromotionBanner promo={p} />
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-[720px]">
          <p className="text-[14px] font-semibold text-accent">{statusLabel}</p>
          <h1 className="mt-2 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{p.title}</h1>
          <p className="mt-4 text-xl leading-relaxed text-[#1d1d1f]/85">{p.summary}</p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[15px] text-[#6e6e73]">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={16} aria-hidden />
              {promotionPeriod(p)}
            </span>
            {where && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} aria-hidden />
                {where}
              </span>
            )}
          </p>
          <ShareButtons title={p.title} className="mt-6" />
        </div>

        {/* contentHtml (thể lệ) đã được trang quản trị làm sạch */}
        {p.contentHtml && (
          <div className="prose-shop mx-auto mt-10 max-w-[720px]" dangerouslySetInnerHTML={{ __html: p.contentHtml }} />
        )}

        <div className="mx-auto mt-12 max-w-[720px] rounded-3xl bg-[#f5f5f7] p-7">
          <p className="text-[19px] font-semibold tracking-tight">Cần tư vấn về chương trình này?</p>
          <ContactButtons className="mt-5" />
        </div>
      </article>

      {models.length > 0 && (
        <section className="container-shop mt-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">Sản phẩm áp dụng.</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {models.map((m) => (
              <ProductCard key={m.slug} model={m} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
