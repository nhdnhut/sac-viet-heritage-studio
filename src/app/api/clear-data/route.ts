import { NextRequest, NextResponse } from "next/server";
import { clearAllData } from "@/lib/db";
import { verifyLocalOrigin } from "@/lib/session";

export async function POST(req: NextRequest) {
  if (!verifyLocalOrigin(req)) {
    return NextResponse.json({ error: "Yêu cầu bị từ chối: Sai lệch Origin/Host" }, { status: 403 });
  }

  clearAllData();
  return NextResponse.json({
    success: true,
    message: "Toàn bộ dữ liệu bộ phối, tủ đồ và nhật ký tác vụ trong cơ sở dữ liệu SQLite cục bộ đã được xóa an toàn.",
  });
}
