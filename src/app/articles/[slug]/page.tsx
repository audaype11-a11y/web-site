import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ArticleCard } from "@/components/blog/article-card";
import Link from "next/link";
import type { Metadata } from "next";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.post.findUnique({
    where: { slug },
    include: { category: true, author: true },
  });

  if (!post) {
    return { title: "المقال غير موجود" };
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || "",
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name],
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || "",
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  const post = await db.post.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true, image: true } },
      category: true,
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Get related posts
  const relatedPosts = post.categoryId
    ? await db.post.findMany({
        where: {
          published: true,
          categoryId: post.categoryId,
          id: { not: post.id },
        },
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      })
    : [];

  const formattedDate = new Date(post.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <Link
            href="/articles"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            العودة للمقالات
          </Link>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="rounded-xl overflow-hidden mb-8 bg-muted">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.category && (
              <Badge
                variant="secondary"
                style={{
                  backgroundColor: post.category.color + "20",
                  color: post.category.color,
                  borderColor: post.category.color + "40",
                }}
              >
                <Tag className="h-3 w-3 ml-1" />
                {post.category.name}
              </Badge>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formattedDate}
            </span>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {post.author.name}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Share */}
          <div className="mb-8 pb-6 border-b">
            <ShareButtons title={post.title} />
          </div>

          {/* Content */}
          <div className="prose-rtl">
            <ReactMarkdown>{post.content || ""}</ReactMarkdown>
          </div>

          {/* Share Bottom */}
          <div className="mt-10 pt-6 border-t">
            <ShareButtons title={post.title} />
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16 pt-10 border-t">
            <h2 className="text-2xl font-bold mb-6 text-center">مقالات ذات صلة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <ArticleCard key={rp.id} post={rp} />
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
