import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminDashboard } from "./admin-dashboard";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const [postsCount, publishedCount, draftCount, categoriesCount] =
    await Promise.all([
      db.post.count(),
      db.post.count({ where: { published: true } }),
      db.post.count({ where: { published: false } }),
      db.category.count(),
    ]);

  const recentPosts = await db.post.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <AdminDashboard
      stats={{ postsCount, publishedCount, draftCount, categoriesCount }}
      recentPosts={recentPosts}
      userName={session.user?.name || "المشرف"}
    />
  );
}
