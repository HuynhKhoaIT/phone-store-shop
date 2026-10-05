"use client";

/** Trang quản trị (API) không phản hồi → báo lỗi nhẹ nhàng thay vì trang trắng. */
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-shop py-32 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Không tải được sản phẩm</h1>
      <p className="mt-3 text-[17px] text-[#6e6e73]">Hệ thống đang bận, vui lòng thử lại sau ít phút.</p>
      <button type="button" onClick={reset} className="btn mt-8">
        Thử lại
      </button>
    </div>
  );
}
