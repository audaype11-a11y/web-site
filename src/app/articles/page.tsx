import { db } from "@/lib/db";
import { ArticleCard } from "@/components/blog/article-card";
import { SearchBar } from "@/components/blog/search-bar";
import { CategoryFilter } from "@/components/blog/category-filter";
import { BookOpen } from "lucide-react";
import { ArticlesClient } from "./articles-client";

export const metadata = {
  title: "المقالات",
  description: "تصفح جميع المقالات الطبية والملاحظات الدراسية",
};

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categoryFilter = params.category || "";
  const searchFilter = params.search || "";

  const where: any = { published: true };

  if (searchFilter) {
    where.OR = [
      { title: { contains: searchFilter } },
      { excerpt: { contains: searchFilter } },
    ];
  }

  if (categoryFilter) {
    where.category = { slug: categoryFilter };
  }

  const [posts, categories] = await Promise.all([
    db.post.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">المقالات</h1>
          <p className="text-muted-foreground">
            تصفح جميع المقالات الطبية والملاحظات الدراسية
          </p>
        </div>

        {/* Filters */}
        <ArticlesClient
          categories={categories}
          initialCategory={categoryFilter}
          initialSearch={searchFilter}
          postsCount={posts.length}
        />

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">لا توجد مقات</h3>
            <p className="text-muted-foreground">
              {searchFilter || categoryFilter
                ? "لم يتم العثور على مقالات تطابق البحث"
                : "سيتم نشر المقالات قريباً"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
