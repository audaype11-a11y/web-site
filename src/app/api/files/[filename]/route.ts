import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Upload directory - uses UPLOAD_DIR env var if set
const getUploadDir = (): string => {
  // Use custom path from env var (set in Dockerfile)
  if (process.env.UPLOAD_DIR) {
    return process.env.UPLOAD_DIR;
  }
  // Fallback: production uses /tmp/uploads
  if (process.env.NODE_ENV === "production") {
    return "/tmp/uploads";
  }
  // Development: local uploads folder
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
      console.log("File not found:", filePath);
      return new NextResponse("File not found", { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);
    console.log("Serving file:", safeName, "Size:", fileBuffer.length);

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

    // Return file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
