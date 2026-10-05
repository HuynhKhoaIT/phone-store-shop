import { Headphones, Smartphone } from "lucide-react";

/**
 * Ảnh sản phẩm trên nền xám nhạt kiểu Apple; admin chưa thêm ảnh thì hiện hình minh hoạ.
 * Dùng <img> thường vì link ảnh có thể từ nhiều nguồn (không phải cấu hình domain cho next/image).
 */
export function ProductImage({
  src,
  alt,
  category,
  className = "",
  priority = false,
}: {
  src: string | null;
  alt: string;
  category: string;
  className?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }
  const Icon = category === "ACCESSORY" ? Headphones : Smartphone;
  return (
    <div className={`grid h-full w-full place-items-center ${className}`} role="img" aria-label={alt}>
      <div className="relative grid aspect-square w-2/5 place-items-center">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-300/50 via-violet-300/40 to-amber-200/50 blur-2xl" />
        <Icon className="relative h-full w-full text-current opacity-80" strokeWidth={0.9} aria-hidden />
      </div>
    </div>
  );
}
