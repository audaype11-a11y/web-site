import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "@/lib/hash";

export async function GET() {
  try {
    // Check if admin exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@medblog.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin already exists",
        email: "admin@medblog.com",
        password: "admin123"
      });
    }

    // Create admin user
    const hashedPassword = await hash("admin123");
    const user = await db.user.create({
      data: {
        email: "admin@medblog.com",
        name: "د. أحمد محمد",
        password: hashedPassword,
        role: "admin",
      },
    });

    // Create default categories
    const categories = [
      { name: "طب عام", slug: "general-medicine", description: "مقالات في الطب العام والصحة العامة", color: "#0ea5e9" },
      { name: "تشريح", slug: "anatomy", description: "ملاحظات وملخصات التشريح البشري", color: "#10b981" },
      { name: "أدوية", slug: "pharmacology", description: "معلومات عن الأدوية وتداخلاتها", color: "#8b5cf6" },
      { name: "نصائح طبية", slug: "tips", description: "نصائح صحية وإرشادات طبية", color: "#f59e0b" },
      { name: "ملاحظات دراسية", slug: "study-notes", description: "ملاحظات وملخصات من المحاضرات", color: "#06b6d4" },
    ];

    for (const cat of categories) {
      await db.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      });
    }

    return NextResponse.json({ 
      success: true,
      message: "Setup completed!",
      admin: {
        email: "admin@medblog.com",
        password: "admin123"
      }
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}
