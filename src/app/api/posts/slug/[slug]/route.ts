import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/posts/slug/[slug] - Get post by slug (public)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const post = await db.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    if (!post || !post.published) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post by slug:", error);
    return NextResponse.json({ error: "فشل في جلب المقال" }, { status: 500 });
  }
}
