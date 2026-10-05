import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shop py-32 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Không tìm thấy sản phẩm</h1>
      <p className="mt-3 text-[17px] text-[#6e6e73]">Sản phẩm có thể đã được bán hoặc ngừng kinh doanh.</p>
      <Link href="/products" className="btn mt-8">
        Xem sản phẩm khác
      </Link>
    </div>
  );
}
