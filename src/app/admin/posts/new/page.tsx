import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PostEditor } from "../post-editor";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  const userId = (session.user as any)?.id;

  return <PostEditor categories={categories} userId={userId} />;
}
