import { MessageCircle, Phone } from "lucide-react";
import { getShopInfo } from "@/lib/shop";

/**
 * Thanh Zalo / Gọi dính đáy màn hình, chỉ trên điện thoại: khách xem máy bằng điện thoại là chủ yếu,
 * không phải cuộn tìm nút liên hệ. Layout chừa padding đáy cho body để thanh không che footer.
 */
export async function MobileContactBar() {
  const info = await getShopInfo();
  if (!info.phoneHref && !info.zaloHref) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/85 px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-xl backdrop-saturate-150 md:hidden">
      <div className="flex gap-2.5">
        {info.zaloHref && (
          <a href={info.zaloHref} target="_blank" rel="noopener noreferrer" className="btn-accent flex-1 px-3">
            <MessageCircle size={18} aria-hidden />
            Nhắn Zalo
          </a>
        )}
        {info.phoneHref && (
          <a href={info.phoneHref} className="btn flex-1 px-3">
            <Phone size={18} aria-hidden />
            Gọi ngay
          </a>
        )}
      </div>
    </div>
  );
}
