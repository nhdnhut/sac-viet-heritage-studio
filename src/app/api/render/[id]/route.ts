import { NextRequest, NextResponse } from "next/server";
import { getJob } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) {
    return NextResponse.json({ error: "Không tìm thấy tác vụ render" }, { status: 404 });
  }

  return NextResponse.json({ success: true, job });
}
