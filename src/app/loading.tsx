/** Khung xám trong lúc tải trang (mạng chậm): tiêu đề + lưới thẻ sản phẩm, giữ bố cục không bị nhảy. */
export default function Loading() {
  return (
    <div className="container-shop animate-pulse pt-10 sm:pt-14" aria-busy="true" aria-label="Đang tải">
      <div className="h-10 w-2/3 max-w-md rounded-xl bg-[#f5f5f7] sm:h-14" />
      <div className="mt-8 h-12 max-w-xl rounded-full bg-[#f5f5f7]" />
      <div className="mt-6 flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-9 w-20 shrink-0 rounded-full bg-[#f5f5f7]" />
        ))}
      </div>
      <div className="mt-10 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="aspect-square rounded-2xl bg-[#f5f5f7]" />
            <div className="mt-3 h-4 w-1/3 rounded bg-[#f5f5f7]" />
            <div className="mt-2 h-5 w-3/4 rounded bg-[#f5f5f7]" />
            <div className="mt-2 h-4 w-1/2 rounded bg-[#f5f5f7]" />
          </div>
        ))}
      </div>
    </div>
  );
}
