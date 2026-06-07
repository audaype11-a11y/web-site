import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// PUT /api/categories/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const category = await db.category.update({
      where: { id },
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        color: body.color,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "فشل في تحديث التصنيف" }, { status: 500 });
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.category.delete({ where: { id } });
    return NextResponse.json({ message: "تم حذف التصنيف بنجاح" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "فشل في حذف التصنيف" }, { status: 500 });
  }
}
