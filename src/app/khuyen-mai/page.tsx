import type { Metadata } from "next";
import { getPromotions } from "@/lib/promotions";
import { PromotionCard } from "@/components/PromotionCard";
import { ContactButtons } from "@/components/ContactButtons";

export const metadata: Metadata = {
  title: "Khuyến mãi",
  description: "Chương trình khuyến mãi đang diễn ra: giảm giá, quà tặng, trả góp 0%, thu cũ đổi mới.",
};

export default async function Promotions() {
  const all = await getPromotions(true);
  const running = all.filter((p) => p.status === "RUNNING");
  const upcoming = all.filter((p) => p.status === "UPCOMING");

  return (
    <div className="container-shop pt-10 sm:pt-14">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">Khuyến mãi.</h1>
      <p className="mt-3 text-xl text-[#6e6e73]">Ưu đãi đang diễn ra tại cửa hàng. Giá trên web đã trừ giảm giá.</p>

      {running.length > 0 ? (
        <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {running.map((p) => (
            <PromotionCard key={p.id} promo={p} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl bg-[#f5f5f7] p-8">
          <p className="text-[19px] font-semibold">Hiện chưa có chương trình khuyến mãi.</p>
          <p className="mt-1 text-[15px] text-[#6e6e73]">Nhắn Zalo để được báo khi có ưu đãi mới.</p>
          <ContactButtons className="mt-5" />
        </div>
      )}

      {upcoming.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">Sắp diễn ra.</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((p) => (
              <PromotionCard key={p.id} promo={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
