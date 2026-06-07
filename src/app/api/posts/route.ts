import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/posts - Get all published posts (public) or all posts (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const publishedOnly = searchParams.get("all") !== "true";

    const where: any = {};

    if (publishedOnly) {
      where.published = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    const [posts, total] = await Promise.all([
      db.post.findMany({
        where,
        include: {
          author: { select: { id: true, name: true, image: true } },
          category: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json({ error: "فشل في جلب المقالات" }, { status: 500 });
  }
}

// POST /api/posts - Create a new post (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, excerpt, coverImage, metaTitle, metaDescription, published, authorId, categoryId } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "العنوان والرابط مطلوبان" }, { status: 400 });
    }

    const existingPost = await db.post.findUnique({ where: { slug } });
    if (existingPost) {
      return NextResponse.json({ error: "الرابط مستخدم بالفعل" }, { status: 400 });
    }

    const post = await db.post.create({
      data: {
        title,
        slug,
        content: content || "",
        excerpt,
        coverImage,
        metaTitle,
        metaDescription,
        published: published || false,
        authorId,
        categoryId: categoryId || null,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "فشل في إنشاء المقال" }, { status: 500 });
  }
}
