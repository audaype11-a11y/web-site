import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/categories
export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: { select: { posts: { where: { published: true } } } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "فشل في جلب التصنيفات" }, { status: 500 });
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, color } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "الاسم والرابط مطلوبان" }, { status: 400 });
    }

    const existing = await db.category.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "الرابط مستخدم بالفعل" }, { status: 400 });
    }

    const category = await db.category.create({
      data: { name, slug, description, color: color || "#0ea5e9" },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "فشل في إنشاء التصنيف" }, { status: 500 });
  }
}
