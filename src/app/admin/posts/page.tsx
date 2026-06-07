import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminPostsList } from "./admin-posts-list";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const posts = await db.post.findMany({
    include: { category: true, author: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const userId = (session.user as any)?.id;

  return <AdminPostsList posts={posts} userId={userId} />;
}
