import { NextRequest, NextResponse } from "next/server";
import { deleteWardrobeItem } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  deleteWardrobeItem(id);
  return NextResponse.json({ success: true, message: "Đã xóa món đồ khỏi tủ" });
}
