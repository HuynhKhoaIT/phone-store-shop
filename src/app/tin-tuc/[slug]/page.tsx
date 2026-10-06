import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPost } from "@/lib/news";
import { ContactButtons } from "@/components/ContactButtons";
import { PostCard, PostMeta } from "@/components/PostCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getPost((await params).slug);
  if (!data) return { title: "Không tìm thấy bài viết" };
  const { post } = data;
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export default async function Article({ params }: Props) {
  const data = await getPost((await params).slug);
  if (!data) notFound();
  const { post, related } = data;

  return (
    <>
      <article className="container-shop pt-8 sm:pt-12">
        <div className="mx-auto max-w-[720px]">
          <Link href="/tin-tuc" className="inline-flex items-center text-[15px] text-accent hover:underline">
            <ChevronLeft size={16} aria-hidden /> Tin tức
          </Link>
          <div className="mt-6">
            <PostMeta post={post} />
          </div>
          <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-xl leading-relaxed text-[#6e6e73]">{post.excerpt}</p>}
          {post.author && <p className="mt-4 text-[15px]">Bởi {post.author}</p>}
        </div>

        {post.coverImageUrl && (
          <div className="mx-auto mt-10 max-w-[960px] overflow-hidden rounded-3xl bg-[#f5f5f7]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.coverImageUrl} alt="" className="w-full object-cover" />
          </div>
        )}

        {/* contentHtml đã được trang quản trị làm sạch (không có HTML viết tay, chỉ link an toàn) */}
        <div className="prose-shop mx-auto mt-10 max-w-[720px]" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {post.category === "PROMOTION" && (
          <div className="mx-auto mt-12 max-w-[720px] rounded-3xl bg-[#f5f5f7] p-7">
            <p className="text-[19px] font-semibold tracking-tight">Cần tư vấn về chương trình này?</p>
            <ContactButtons className="mt-5" />
          </div>
        )}
      </article>

      {related.length > 0 && (
        <section className="container-shop mt-24">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">Bài viết liên quan.</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
