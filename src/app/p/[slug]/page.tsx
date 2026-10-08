import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { CATEGORY_LABEL, formatVND } from "@/lib/format";
import { getShopCatalog, getShopInfo, SHOP_CATEGORIES } from "@/lib/shop";
import { siteUrl } from "@/lib/site";
import { ProductCard } from "@/components/ProductCard";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { ProductGallery } from "@/components/ProductGallery";
import { ShareButtons } from "@/components/ShareButtons";
import { PromotionList } from "@/components/PromotionCard";

type Props = { params: Promise<{ slug: string }> };

async function findModel(slug: string) {
  const { models } = await getShopCatalog();
  return { model: models.find((m) => m.slug === slug), models };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model } = await findModel((await params).slug);
  if (!model) return { title: "Không tìm thấy sản phẩm" };
  const description = `${model.name}${model.minPrice > 0 ? ` giá từ ${formatVND(model.minPrice)}` : ", liên hệ để được báo giá"}. Xem các phiên bản đang có tại cửa hàng.`;
  const url = `${siteUrl()}/p/${model.slug}`;
  return {
    title: model.name,
    description,
    alternates: { canonical: url },
    // Ảnh / tiêu đề xem trước khi chia sẻ lên Facebook, Zalo...
    openGraph: {
      type: "website",
      url,
      title: model.name,
      description,
      images: model.imageUrl ? [model.imageUrl] : undefined,
    },
  };
}

export default async function ProductDetail({ params }: Props) {
  const { model, models } = await findModel((await params).slug);
  if (!model) notFound();

  const info = await getShopInfo();
  const cat = SHOP_CATEGORIES.find((c) => c.value === model.category);
  const related = models.filter((m) => m.category === model.category && m.slug !== model.slug).slice(0, 4);

  return (
    <>
      <div className="container-shop pt-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[14px] text-[#6e6e73]">
          <Link href="/products" className="hover:text-[#1d1d1f]">
            Sản phẩm
          </Link>
          <ChevronRight size={14} aria-hidden />
          {cat && (
            <>
              <Link href={`/products?cat=${cat.key}`} className="hover:text-[#1d1d1f]">
                {cat.label}
              </Link>
              <ChevronRight size={14} aria-hidden />
            </>
          )}
          <span className="truncate text-[#1d1d1f]">{model.name}</span>
        </nav>
      </div>

      <div className="container-shop mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        {/* Ảnh dính khi cuộn phần chọn cấu hình (kiểu trang mua iPhone) */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <ProductGallery images={model.images} alt={model.name} category={model.category} />
        </div>

        <div>
          <p className="text-[14px] font-semibold text-accent">
            {model.hasUsed && model.hasNew ? "Mới & máy cũ" : model.hasUsed ? "Máy cũ" : "Mới"}
          </p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">{model.name}</h1>
          <p className="mt-2 text-[17px] text-[#6e6e73]">{model.brand ?? CATEGORY_LABEL[model.category]}</p>
          <ShareButtons title={model.name} className="mt-4" />

          {model.description && (
            <p className="mt-6 text-[17px] leading-relaxed whitespace-pre-line text-[#1d1d1f]/90">{model.description}</p>
          )}

          <PromotionList promotions={model.promotions} className="mt-8" />

          <div className="mt-8">
            <ProductConfigurator
              name={model.name}
              units={model.units}
              isPhone={model.category !== "ACCESSORY"}
              contact={{ phone: info.phone, phoneHref: info.phoneHref, zaloHref: info.zaloHref }}
            />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-shop mt-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">Có thể bạn cũng thích.</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {related.map((m) => (
              <ProductCard key={m.slug} model={m} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
