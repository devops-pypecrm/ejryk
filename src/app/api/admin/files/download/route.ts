import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import * as files from "../../../../../lib/files";

export async function GET(req: NextRequest) {
  try {
    const { abs } = await files.filePath(req.nextUrl.searchParams.get("path") || "");
    const name = path.basename(abs).replace(/["\r\n]/g, "");
    return new NextResponse(new Uint8Array(await fs.readFile(abs)), { headers: { "Content-Type": "application/octet-stream", "Content-Disposition": `attachment; filename="${name}"`, "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" } });
  } catch (e) { return new NextResponse(e instanceof files.FsError ? e.message : "Error", { status: e instanceof files.FsError ? e.status : 500 }); }
}
