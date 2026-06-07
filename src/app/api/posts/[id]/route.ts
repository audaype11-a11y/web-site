import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await db.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json({ error: "فشل في جلب المقال" }, { status: 500 });
  }
}

// PUT /api/posts/[id] - Update a post
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const post = await db.post.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
        published: body.published,
        categoryId: body.categoryId || null,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json({ error: "فشل في تحديث المقال" }, { status: 500 });
  }
}

// DELETE /api/posts/[id] - Delete a post
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.post.delete({ where: { id } });
    return NextResponse.json({ message: "تم حذف المقال بنجاح" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json({ error: "فشل في حذف المقال" }, { status: 500 });
  }
}
