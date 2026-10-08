"use client";

import { useEffect, useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";

/* Icon thương hiệu (lucide không có) — đường vẽ từ Simple Icons (CC0) */
function FacebookIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

const circle =
  "grid size-10 place-items-center rounded-full bg-[#f5f5f7] text-[#1d1d1f] transition hover:bg-[#e8e8ed] active:scale-95";

/**
 * Nút chia sẻ trang hiện tại (sản phẩm, bài viết).
 * Điện thoại: nút "Chia sẻ" mở bảng chia sẻ của máy — có sẵn Zalo, Messenger... (Zalo không có link chia sẻ công khai).
 * Link lấy từ địa chỉ trang đang mở nên đúng domain ở mọi môi trường.
 */
export function ShareButtons({ title, className = "" }: { title: string; className?: string }) {
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  // navigator.share chỉ có ở trình duyệt (và chủ yếu trên điện thoại) — kiểm tra sau khi render để khỏi lệch hydrate
  useEffect(() => setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share), []);

  const url = () => window.location.href.split("#")[0];
  const popup = (href: string) => window.open(href, "_blank", "noopener,noreferrer,width=640,height=560");

  async function nativeShare() {
    try {
      await navigator.share({ title, url: url() });
    } catch {
      // Người dùng đóng bảng chia sẻ — bỏ qua
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url());
    } catch {
      // Trình duyệt chặn clipboard (http, iframe...) — dùng cách cũ
      const input = document.createElement("textarea");
      input.value = url();
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="mr-1 text-[14px] text-[#6e6e73]">Chia sẻ</span>
      {canNativeShare && (
        <button type="button" onClick={nativeShare} aria-label="Chia sẻ qua Zalo, Messenger..." title="Chia sẻ" className={circle}>
          <Share2 size={17} aria-hidden />
        </button>
      )}
      <button
        type="button"
        onClick={() => popup(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`)}
        aria-label="Chia sẻ lên Facebook"
        title="Facebook"
        className={circle}
      >
        <FacebookIcon />
      </button>
      <button
        type="button"
        onClick={() =>
          popup(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url())}&text=${encodeURIComponent(title)}`)
        }
        aria-label="Chia sẻ lên X"
        title="X"
        className={circle}
      >
        <XIcon />
      </button>
      <button
        type="button"
        onClick={copyLink}
        aria-label={copied ? "Đã sao chép link" : "Sao chép link"}
        title="Sao chép link (dán vào Zalo, Messenger...)"
        className={`${circle} ${copied ? "text-green-700" : ""}`}
      >
        {copied ? <Check size={17} aria-hidden /> : <Link2 size={17} aria-hidden />}
      </button>
      <span aria-live="polite" className="text-[14px] text-green-700">
        {copied ? "Đã sao chép link" : ""}
      </span>
    </div>
  );
}
