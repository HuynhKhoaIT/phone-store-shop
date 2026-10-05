import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shop py-32 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Không tìm thấy trang</h1>
      <p className="mt-3 text-[17px] text-[#6e6e73]">
        Sản phẩm có thể đã được bán / ngừng kinh doanh, hoặc bài viết đã bị gỡ.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/products" className="btn">
          Xem sản phẩm
        </Link>
        <Link href="/" className="btn-outline">
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
