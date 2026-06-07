import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PostEditor } from "./post-editor";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;

  const [post, categories] = await Promise.all([
    db.post.findUnique({ where: { id }, include: { category: true } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!post) redirect("/admin/posts");

  const userId = (session.user as any)?.id;

  return <PostEditor categories={categories} userId={userId} post={post} />;
}
