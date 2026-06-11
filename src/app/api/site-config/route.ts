import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/site-config - Get all site configuration
export async function GET() {
  try {
    const configs = await db.siteConfig.findMany();
    
    const siteConfig: Record<string, string> = {};
    configs.forEach((config) => {
      siteConfig[config.key] = config.value;
    });
    
    return NextResponse.json(siteConfig);
  } catch (error) {
    console.error("Error getting site config:", error);
    return NextResponse.json({ error: "فشل في جلب الإعدادات" }, { status: 500 });
  }
}

// PUT /api/site-config - Update site configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "المفتاح والقيمة مطلوبان" }, { status: 400 });
    }

    // Allowed keys
    const allowedKeys = [
      "siteName",
      "siteDescription", 
      "siteKeywords",
      "siteAuthor",
      "siteLogo",
      "footerAboutText",
      "footerCopyright",
      "twitterUrl",
      "instagramUrl",
      "youtubeUrl",
      "telegramUrl",
      "whatsappUrl",
      "linkedinUrl",
      "contactEmail",
      // Profile keys
      "doctorName",
      "doctorBio",
      "doctorImage",
      "aboutPage"
    ];

    if (!allowedKeys.includes(key)) {
      return NextResponse.json({ error: "مفتاح غير صالح" }, { status: 400 });
    }

    // Upsert the config
    await db.siteConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating site config:", error);
    return NextResponse.json({ error: "فشل في تحديث الإعدادات" }, { status: 500 });
  }
}