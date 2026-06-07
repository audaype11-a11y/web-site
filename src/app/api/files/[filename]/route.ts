import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Upload directory - use /tmp for Railway compatibility, or local uploads folder
const getUploadDir = () => {
  if (process.env.UPLOAD_DIR) {
    return process.env.UPLOAD_DIR;
  }
  // For Railway/production, use /tmp
  if (process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT) {
    return path.join("/tmp", "uploads");
  }
  // For local development, use uploads folder in project root
  return path.join(process.cwd(), "uploads");
};

// GET /api/files/[filename] - Serve uploaded files
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    // Security: prevent directory traversal
    const safeName = path.basename(filename);
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, safeName);

    // Check if file exists
    if (!existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Determine content type
    const ext = path.extname(safeName).toLowerCase();
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
    };

    const contentType = contentTypes[ext] || "application/octet-stream";

    // Return file with cache headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
