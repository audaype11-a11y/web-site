import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Allowed file types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

// Upload directory - hardcoded for Railway
const getUploadDir = (): string => {
  // Always use /tmp/uploads in production
  if (process.env.NODE_ENV === "production") {
    return "/tmp/uploads";
  }
  // Development: local uploads folder
  return path.join(process.cwd(), "uploads");
};

// POST /api/upload - Upload an image (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "لم يتم اختيار ملف" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "نوع الملف غير مسموح. الأنواع المسموحة: JPEG, PNG, GIF, WebP" 
      }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ 
        error: "حجم الملف كبير جداً. الحد الأقصى: 5MB" 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure unique filename with safe extension
    const ext = path.extname(file.name).toLowerCase() || ".png";
    const safeExt = [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext) ? ext : ".png";
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${safeExt}`;

    const uploadDir = getUploadDir();
    console.log("Upload dir:", uploadDir, "NODE_ENV:", process.env.NODE_ENV);
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    await writeFile(filePath, buffer);

    // Return URL that will be served by the API
    const url = `/api/files/${uniqueName}`;

    return NextResponse.json({ url, name: uniqueName });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "فشل في رفع الملف" }, { status: 500 });
  }
}
