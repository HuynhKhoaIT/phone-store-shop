import Link from "next/link";
import {
  BadgeCheck,
  BatteryFull,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { formatVND, slugify } from "@/lib/format";
import { getShopCatalog, getStores, SHOP_CATEGORIES, type ShopModel } from "@/lib/shop";
import { telHref } from "@/lib/stores";
import { getPosts } from "@/lib/news";
import { getPromotions } from "@/lib/promotions";
import { ContactButtons } from "@/components/ContactButtons";
import { SocialButtons, socialLinks } from "@/components/SocialLinks";
import { PostCard } from "@/components/PostCard";
import { PromotionCard } from "@/components/PromotionCard";
import { ProductCard } from "@/components/ProductCard";
import { ProductImage } from "@/components/ProductImage";

export default async function Home() {
  const [{ models, featured, services, maxWarranty }, news, stores, socials, promotions] = await Promise.all([
    getShopCatalog(),
    // Tin tức không bắt buộc: API lỗi thì ẩn mục, không làm hỏng trang chủ
    getPosts({ pageSize: 3 }).catch(() => null),
    getStores(),
    socialLinks(),
    getPromotions(),
  ]);

  // Hero: sản phẩm admin đánh dấu nổi bật đầu tiên; chưa có thì iPhone mới về gần nhất / sản phẩm mới nhất
  const hero = featured[0] ?? models.find((m) => m.category === "IPHONE" && m.hasNew) ?? models[0];
  const picks = featured.filter((m) => m !== hero);
  const latest = models.filter((m) => m !== hero).slice(0, 10);
  const used = models.filter((m) => m.hasUsed && m.category !== "ACCESSORY").slice(0, 4);
  const accessories = models.filter((m) => m.category === "ACCESSORY").slice(0, 8);

  return (
    <>
      <Hero model={hero} />

      {/* Danh mục — ô lớn kiểu Nike */}
      <section className="container-shop mt-3 grid gap-3 sm:grid-cols-3">
        {SHOP_CATEGORIES.map((c, i) => {
          const items = models.filter((m) => m.category === c.value);
          const cover = items.find((m) => m.imageUrl) ?? items[0];
          return (
            <Link
              key={c.key}
              href={`/products?cat=${c.key}`}
              className={`group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl p-7 sm:aspect-[3/4] ${
                ["bg-[#f5f5f7]", "bg-[#eef1f6]", "bg-[#f6f1ea]"][i]
              }`}
            >
              <p className="text-[14px] text-[#6e6e73]">{items.length} dòng sản phẩm</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">{c.label}</h2>
              <span className="mt-3 inline-flex items-center text-[15px] text-accent group-hover:underline">
                Khám phá <ChevronRight size={16} aria-hidden />
              </span>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 transition duration-700 group-hover:scale-105">
                <ProductImage
                  src={cover?.imageUrl ?? null}
                  alt={c.label}
                  name={cover?.name}
                  category={c.value}
                  className="p-6"
                />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Khuyến mãi đang diễn ra (admin tạo ở trang quản trị › Khuyến mãi) */}
      {promotions.length > 0 && (
        <section className="container-shop mt-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Khuyến mãi. <span className="text-[#6e6e73]">Đang diễn ra.</span>
            </h2>
            <Link href="/khuyen-mai" className="inline-flex shrink-0 items-center text-[15px] text-accent hover:underline">
              Xem tất cả <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.slice(0, 3).map((p) => (
              <PromotionCard key={p.id} promo={p} />
            ))}
          </div>
        </section>
      )}

      {picks.length > 0 && (
        <Carousel title="Nổi bật." subtitle="Được chọn riêng cho bạn." href="/products" models={picks} />
      )}

      {latest.length > 0 && (
        <Carousel title="Mới về." subtitle="Hàng vừa lên kệ tại cửa hàng." href="/products" models={latest} />
      )}

      {/* Lý do mua hàng */}
      <section className="container-shop mt-24">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          Vì sao chọn chúng tôi. <span className="text-[#6e6e73]">Yên tâm hơn.</span>
        </h2>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Feature
            icon={ShieldCheck}
            title={maxWarranty > 0 ? `Bảo hành đến ${maxWarranty} tháng` : "Bảo hành tại cửa hàng"}
            text="Tra cứu bảo hành nhanh bằng số điện thoại tại bất kỳ chi nhánh nào."
          />
          <Feature
            icon={BatteryFull}
            title="Máy cũ minh bạch"
            text="Ghi rõ tình trạng và % pin từng máy. Bạn chọn đúng chiếc mình muốn."
          />
          <Feature
            icon={BadgeCheck}
            title="Giá niêm yết rõ ràng"
            text="Giá trên web là giá bán tại quầy, cập nhật theo kho hàng thực tế."
          />
          <Feature
            icon={CreditCard}
            title="Tiền mặt hoặc chuyển khoản"
            text="Thanh toán linh hoạt khi nhận máy tại cửa hàng."
          />
        </div>
      </section>

      {used.length > 0 && (
        <section className="container-shop mt-24">
          <SectionHeader title="Máy cũ. Giá mềm." subtitle="Ghi rõ tình trạng, % pin." href="/products?cond=used" />
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4">
            {used.map((m) => (
              <ProductCard key={m.slug} model={m} />
            ))}
          </div>
        </section>
      )}

      {accessories.length > 0 && (
        <Carousel
          title="Phụ kiện."
          subtitle="Sạc, cáp, tai nghe, ốp lưng…"
          href="/products?cat=accessory"
          models={accessories}
        />
      )}

      {services.length > 0 && (
        <section id="sua-chua" className="mt-24 scroll-mt-14 bg-[#f5f5f7] py-20">
          <div className="container-shop">
            <p className="eyebrow text-accent">Dịch vụ</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-5xl">Sửa chữa điện thoại.</h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.slice(0, 6).map((s) => (
                <Link
                  key={s.service}
                  href={`/sua-chua#${slugify(s.service)}`}
                  className="flex items-center gap-4 rounded-2xl bg-white p-6 transition hover:shadow-md"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f5f5f7]">
                    <Wrench size={20} aria-hidden />
                  </div>
                  <div>
                    <p className="text-[17px] font-semibold">{s.service}</p>
                    <p className="text-[15px] text-[#6e6e73] tabular-nums">
                      {s.minPrice > 0 ? `Từ ${formatVND(s.minPrice)}` : "Liên hệ báo giá"} · {s.devices} dòng máy
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/sua-chua" className="btn-outline">
                Xem bảng giá đầy đủ <ChevronRight size={16} aria-hidden />
              </Link>
              <ContactButtons />
            </div>
          </div>
        </section>
      )}

      {news && news.items.length > 0 && (
        <section className="container-shop mt-24">
          <SectionHeader title="Tin mới." subtitle="Khuyến mãi, mẹo hay." href="/tin-tuc" />
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {news.items.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* Cửa hàng + liên hệ */}
      <section id="cua-hang" className="container-shop mt-24 scroll-mt-14">
        <div className="overflow-hidden rounded-3xl bg-[#111] px-7 py-14 text-white sm:px-14 sm:py-20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/logo-light.png" alt="" width={1736} height={327} className="mb-8 h-9 w-auto sm:h-10" />
          <p className="eyebrow text-accent-bright">Ghé cửa hàng</p>
          <h2 className="mt-2 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
            Cầm máy tận tay. <br className="hidden sm:block" />
            Thử trước khi mua.
          </h2>
          <ul className="mt-10 grid gap-3 md:grid-cols-2">
            {stores.map((st) => (
              <li key={st.id} className="flex flex-col overflow-hidden rounded-2xl bg-white/10">
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[19px] font-semibold tracking-tight">{st.name}</p>
                  {st.address && (
                    <p className="mt-2 flex gap-2 text-[15px] text-white/75">
                      <MapPin size={18} className="mt-0.5 shrink-0 text-accent-bright" aria-hidden />
                      {st.address}
                    </p>
                  )}
                  {st.openingHours && (
                    <p className="mt-1.5 flex gap-2 text-[15px] text-white/75">
                      <Clock size={18} className="mt-0.5 shrink-0 text-accent-bright" aria-hidden />
                      {st.openingHours}
                    </p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {st.phone && (
                      <a href={telHref(st.phone)} className="btn-accent">
                        <Phone size={18} aria-hidden />
                        {st.phone}
                      </a>
                    )}
                    {st.mapUrl && (
                      <a href={st.mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-white">
                        <Navigation size={18} aria-hidden />
                        Chỉ đường
                      </a>
                    )}
                  </div>
                </div>
                {/* Bản đồ nhúng — vị trí admin dán link Google Maps ở trang quản trị */}
                {st.mapEmbedUrl && (
                  <iframe
                    src={st.mapEmbedUrl}
                    title={`Bản đồ ${st.name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-56 w-full border-0 grayscale-[0.2]"
                  />
                )}
              </li>
            ))}
          </ul>
          {socials.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p className="text-[15px] text-white/75">Theo dõi máy mới về, khuyến mãi:</p>
              <SocialButtons dark />
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Hero({ model }: { model: ShopModel | undefined }) {
  return (
    <section className="bg-black text-white">
      <div className="container-shop flex flex-col items-center pt-16 text-center sm:pt-24">
        {model ? (
          <>
            <p className="eyebrow text-accent-bright">{model.featured ? "Nổi bật" : "Mới về"}</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight sm:text-7xl">{model.name}</h1>
            <p className="mt-4 text-xl text-white/70 sm:text-2xl">
              {model.minPrice > 0 ? (
                <>
                  {model.minPrice !== model.maxPrice ? "Chỉ từ " : "Giá "}
                  <span className="text-white tabular-nums">{formatVND(model.minPrice)}</span>
                </>
              ) : (
                "Liên hệ để được báo giá"
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href={`/p/${model.slug}`} className="btn-accent">
                Xem chi tiết
              </Link>
              <Link href="/products" className="btn-outline text-accent-bright">
                Xem tất cả sản phẩm
              </Link>
            </div>
            <div className="relative mt-12 aspect-[16/10] w-full max-w-3xl">
              <div className="absolute inset-x-[15%] bottom-0 h-1/2 rounded-full bg-accent-bright/25 blur-3xl" />
              <div className="relative h-full w-full text-white">
                <ProductImage src={model.imageUrl} alt={model.name} category={model.category} priority />
              </div>
            </div>
          </>
        ) : (
          <div className="pb-24">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">Điện thoại & phụ kiện.</h1>
            <p className="mt-4 text-xl text-white/70">
              Hàng mới đang được cập nhật. Ghé cửa hàng hoặc liên hệ để được tư vấn.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function SectionHeader({ title, subtitle, href }: { title: string; subtitle: string; href: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
        {title} <span className="text-[#6e6e73]">{subtitle}</span>
      </h2>
      <Link
        href={href}
        className="hidden shrink-0 items-center text-[15px] text-accent hover:underline sm:inline-flex"
      >
        Xem tất cả <ChevronRight size={16} aria-hidden />
      </Link>
    </div>
  );
}

/** Hàng sản phẩm cuộn ngang (kiểu Apple Store / Nike "Trending"). */
function Carousel({
  title,
  subtitle,
  href,
  models,
}: {
  title: string;
  subtitle: string;
  href: string;
  models: ShopModel[];
}) {
  return (
    <section className="mt-24">
      <div className="container-shop">
        <SectionHeader title={title} subtitle={subtitle} href={href} />
      </div>
      <div className="no-scrollbar mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-6 sm:px-6 xl:px-[calc((100%-1200px)/2+1.5rem)]">
        {models.map((m) => (
          <ProductCard key={m.slug} model={m} className="w-[70%] shrink-0 snap-start sm:w-[300px]" />
        ))}
      </div>
    </section>
  );
}

function Feature({ icon: Icon, title, text }: { icon: typeof ShieldCheck; title: string; text: string }) {
  return (
    <div className="rounded-3xl bg-[#f5f5f7] p-7">
      <Icon size={30} strokeWidth={1.6} aria-hidden />
      <p className="mt-6 text-[19px] font-semibold tracking-tight">{title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-[#6e6e73]">{text}</p>
    </div>
  );
}
