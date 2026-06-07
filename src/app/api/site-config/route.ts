import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/site-config
export async function GET() {
  try {
    const configs = await db.siteConfig.findMany();
    const configMap: Record<string, string> = {};
    configs.forEach((c) => {
      configMap[c.key] = c.value;
    });
    return NextResponse.json(configMap);
  } catch (error) {
    console.error("Error fetching site config:", error);
    return NextResponse.json({}, { status: 500 });
  }
}

// PUT /api/site-config
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      await db.siteConfig.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    return NextResponse.json({ message: "تم تحديث الإعدادات بنجاح" });
  } catch (error) {
    console.error("Error updating site config:", error);
    return NextResponse.json({ error: "فشل في تحديث الإعدادات" }, { status: 500 });
  }
}
