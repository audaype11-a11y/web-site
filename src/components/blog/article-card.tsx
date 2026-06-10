import Link from "next/link";
import { Calendar, ArrowLeft, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ArticleCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    coverImage?: string | null;
    createdAt: string;
    category?: {
      id: string;
      name: string;
      slug: string;
      color: string;
    } | null;
    author?: {
      name: string;
      image?: string | null;
    } | null;
  };
}

export function ArticleCard({ post }: ArticleCardProps) {
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/articles/${post.slug}`}>
      <Card className="group overflow-hidden h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800">
        {/* Cover Image */}
        {post.coverImage ? (
          <div className="overflow-hidden bg-muted">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-sky-100 to-emerald-100 dark:from-sky-950 dark:to-emerald-950 flex items-center justify-center">
            <span className="text-4xl opacity-30">🏥</span>
          </div>
        )}

        <CardContent className="p-5">
          {/* Category & Date */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {post.category && (
              <Badge
                variant="secondary"
                className="text-xs"
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
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formattedDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Read More */}
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            اقرأ المزيد
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
