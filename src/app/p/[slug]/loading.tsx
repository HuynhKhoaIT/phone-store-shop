/** Khung xám trang chi tiết: ảnh lớn bên trái, tên / giá / ô chọn bên phải (giống bố cục thật). */
export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Đang tải">
      <div className="container-shop pt-6">
        <div className="h-4 w-48 rounded bg-[#f5f5f7]" />
      </div>
      <div className="container-shop mt-6 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div className="aspect-square rounded-3xl bg-[#f5f5f7]" />
        <div>
          <div className="h-4 w-16 rounded bg-[#f5f5f7]" />
          <div className="mt-3 h-10 w-3/4 rounded-xl bg-[#f5f5f7] sm:h-12" />
          <div className="mt-6 h-8 w-40 rounded-lg bg-[#f5f5f7]" />
          <div className="mt-8 h-28 rounded-2xl bg-[#f5f5f7]" />
          <div className="mt-8 grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-[#f5f5f7]" />
            ))}
          </div>
          <div className="mt-8 h-12 rounded-full bg-[#f5f5f7]" />
        </div>
      </div>
    </div>
  );
}
