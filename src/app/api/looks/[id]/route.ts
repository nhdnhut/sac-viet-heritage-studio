import { NextRequest, NextResponse } from "next/server";
import { getLook, deleteLook, getLookRevisions } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const look = getLook(id);
  if (!look) {
    return NextResponse.json({ error: "Không tìm thấy bộ phối" }, { status: 404 });
  }

  const revisions = getLookRevisions(id);
  return NextResponse.json({ success: true, look, revisions });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteLook(id);
  return NextResponse.json({ success: true, message: "Đã xóa bộ phối thành công" });
}
