import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Upload directory
const getUploadDir = () => {
  // Use custom path if set
  if (process.env.UPLOAD_DIR) {
    return process.env.UPLOAD_DIR;
  }
  // Use /tmp for production (Railway, etc.)
  if (process.env.NODE_ENV === "production") {
    return "/tmp/uploads";
  }
  // Use local uploads folder for development
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
