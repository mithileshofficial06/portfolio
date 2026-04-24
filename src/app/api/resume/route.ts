import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  try {
    const filePath = join(process.cwd(), "public", "Resume.pdf");
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return new NextResponse("Resume file not found", { status: 404 });
    }
    
    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="Mithilesh_KS_Resume.pdf"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Error serving resume:", error);
    return new NextResponse("Error loading resume", { status: 500 });
  }
}
