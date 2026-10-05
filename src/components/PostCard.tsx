import Link from "next/link";
import { Newspaper } from "lucide-react";
import { formatDateVN } from "@/lib/format";
import type { PostSummary } from "@/lib/news";

/** Ảnh bìa bài viết; bài không có ảnh thì hiện khối màu theo chuyên mục. */
export function PostCover({ post, className = "" }: { post: PostSummary; className?: string }) {
  if (post.coverImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={post.coverImageUrl} alt="" loading="lazy" className={`h-full w-full object-cover ${className}`} />
    );
  }
  const bg = { NEWS: "from-sky-200 to-indigo-200", PROMOTION: "from-rose-200 to-amber-200", GUIDE: "from-emerald-200 to-teal-200" }[
    post.category
  ];
  return (
    <div className={`grid h-full w-full place-items-center bg-gradient-to-br ${bg ?? "from-slate-200 to-slate-300"} ${className}`}>
      <Newspaper size={48} strokeWidth={1.2} className="text-[#1d1d1f]/50" aria-hidden />
    </div>
  );
}

export function PostMeta({ post }: { post: PostSummary }) {
  return (
    <p className="text-[14px] text-[#6e6e73]">
      <span className="font-semibold text-[#bf4800]">{post.categoryLabel}</span> · {formatDateVN(post.publishedAt)} ·{" "}
      {post.readingMinutes} phút đọc
    </p>
  );
}

export function PostCard({ post, className = "" }: { post: PostSummary; className?: string }) {
  return (
    <Link href={`/tin-tuc/${post.slug}`} className={`group block ${className}`}>
      <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#f5f5f7]">
        <PostCover post={post} className="transition duration-500 group-hover:scale-[1.03]" />
      </div>
      <div className="mt-4 space-y-1.5">
        <PostMeta post={post} />
        <h3 className="text-[19px] leading-snug font-semibold tracking-tight group-hover:underline">{post.title}</h3>
        <p className="line-clamp-2 text-[15px] text-[#6e6e73]">{post.excerpt}</p>
      </div>
    </Link>
  );
}
