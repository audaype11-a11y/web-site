import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// Upload directory
const getUploadDir = (): string => {
  // Production uses /app/uploads (Railway doesn't mount here)
  if (process.env.NODE_ENV === "production") {
    return "/app/uploads";
  }
  // Development: use UPLOAD_DIR if set, otherwise local folder
  if (process.env.UPLOAD_DIR && !process.env.UPLOAD_DIR.startsWith(".")) {
    return process.env.UPLOAD_DIR;
  }
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
