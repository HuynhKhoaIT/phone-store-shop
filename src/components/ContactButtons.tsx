import { MessageCircle, Phone } from "lucide-react";
import { getShopInfo } from "@/lib/shop";

/** Nút liên hệ mua hàng (Zalo / gọi điện) — hotline / Zalo của cửa hàng đầu tiên (cài đặt ở trang quản trị). */
export async function ContactButtons({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const info = await getShopInfo();
  if (!info.phoneHref && !info.zaloHref) return null;
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {info.zaloHref && (
        <a href={info.zaloHref} target="_blank" rel="noopener noreferrer" className="btn-accent">
          <MessageCircle size={18} aria-hidden />
          Nhắn Zalo
        </a>
      )}
      {info.phoneHref && (
        <a href={info.phoneHref} className={dark ? "btn-outline text-white" : "btn"}>
          <Phone size={18} aria-hidden />
          Gọi {info.phone}
        </a>
      )}
    </div>
  );
}
