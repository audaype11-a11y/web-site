import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "@/lib/hash";

// Secret key for setup - must match SETUP_SECRET in env
const SETUP_SECRET = process.env.SETUP_SECRET || "change-this-secret";

export async function GET(request: Request) {
  try {
    // Check for secret in query params
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== SETUP_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin exists
    const existingAdmin = await db.user.findUnique({
      where: { email: "admin@medblog.com" },
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: "Admin already exists",
        email: "admin@medblog.com"
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

    // Create site config
    const siteConfigs = [
      { key: "doctorName", value: "د. أحمد محمد" },
      { key: "doctorBio", value: "طالب طب بشري، أهتم بتبسيط المعلومات الطبية ونشر الوعي الصحي." },
    ];

    for (const config of siteConfigs) {
      await db.siteConfig.upsert({
        where: { key: config.key },
        update: {},
        create: config,
      });
    }

    return NextResponse.json({ 
      success: true,
      message: "Setup completed! Login with admin@medblog.com / admin123"
    });
  } catch (error) {
    console.error("Setup error:", error);
    return NextResponse.json({ error: "Setup failed" }, { status: 500 });
  }
}
