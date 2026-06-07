import Link from "next/link";
import { db } from "@/lib/db";
import { ArticleCard } from "@/components/blog/article-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  BookOpen,
  HeartPulse,
  Brain,
  FlaskConical,
  ArrowLeft,
  GraduationCap,
  FileText,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  "طب عام": <HeartPulse className="h-5 w-5" />,
  "تشريح": <BookOpen className="h-5 w-5" />,
  "أدوية": <FlaskConical className="h-5 w-5" />,
  "نصائح": <Brain className="h-5 w-5" />,
};

export default async function HomePage() {
  const [posts, categories, siteConfig] = await Promise.all([
    db.post.findMany({
      where: { published: true },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    db.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { name: "asc" },
    }),
    db.siteConfig.findMany(),
  ]);

  const configMap: Record<string, string> = {};
  siteConfig.forEach((c) => {
    configMap[c.key] = c.value;
  });

  const doctorName = configMap.doctorName || "د. أحمد محمد";
  const doctorBio =
    configMap.doctorBio ||
    "طالب طب بشري في السنة الرابعة، أهتم بتبسيط المعلومات الطبية ونشر الوعي الصحي بين المجتمع العربي.";
  const doctorImage = configMap.doctorImage || "";

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-sky-50 via-emerald-50 to-white dark:from-sky-950 dark:via-emerald-950 dark:to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Doctor Image */}
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl bg-gradient-to-br from-emerald-200 to-sky-200 dark:from-emerald-800 dark:to-sky-800">
                {doctorImage ? (
                  <img
                    src={doctorImage}
                    alt={doctorName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Stethoscope className="h-16 w-16 md:h-20 md:w-20 text-emerald-600 dark:text-emerald-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="text-center md:text-right">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {doctorName}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-6">
                {doctorBio}
              </p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/articles">
                  <Button size="lg" className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                    <FileText className="h-4 w-4" />
                    تصفح المقالات
                  </Button>
                </Link>
                <Link href="/articles">
                  <Button variant="outline" size="lg" className="gap-2">
                    <GraduationCap className="h-4 w-4" />
                    عن المدونة
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">أقسام المقالات</h2>
              <Link
                href="/articles"
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                عرض الكل
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/articles?category=${cat.slug}`}>
                  <div className="group p-5 rounded-xl border bg-card hover:shadow-md transition-all text-center hover:border-emerald-300 dark:hover:border-emerald-700">
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3"
                      style={{
                        backgroundColor: cat.color + "20",
                        color: cat.color,
                      }}
                    >
                      {categoryIcons[cat.name] || <BookOpen className="h-5 w-5" />}
                    </div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {cat._count.posts} مقال
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Posts Section */}
      {posts.length > 0 && (
        <section className="py-12 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">آخر المقالات</h2>
              <Link
                href="/articles"
                className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                جميع المقالات
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {posts.length === 0 && (
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">لا توجد مقات بعد</h3>
              <p className="text-muted-foreground">
                سيتم نشر المقالات قريباً، تابعنا لتحصل على أحدث المحتوى الطبي.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
