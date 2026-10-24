import { NextRequest, NextResponse } from "next/server";
import { getActiveApiKey, getSession } from "@/lib/session";
import { getLook } from "@/lib/db";
import { executeRenderJob } from "@/lib/imageEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { lookId } = body;

    if (!lookId) {
      return NextResponse.json({ error: "Thiếu lookId" }, { status: 400 });
    }

    const look = getLook(lookId);
    if (!look) {
      return NextResponse.json({ error: "Không tìm thấy bộ phối" }, { status: 404 });
    }

    const sessionId = req.cookies.get("sac_viet_session")?.value;
    const apiKey = getActiveApiKey(sessionId);

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Chưa cấu hình API Key. Để tạo ảnh thực tế với Gemini Image Model, vui lòng nhập API key trong mục Cài Đặt.",
          code: "NO_API_KEY",
        },
        { status: 401 }
      );
    }

    const session = getSession(sessionId);
    const imageModel = session?.imageModel || "gemini-3.1-flash-image";
    const textModel = session?.textModel || "gemini-3.8-flash";
    const visionQaEnabled = session?.visionQaEnabled ?? true;

    const job = await executeRenderJob(apiKey, look, imageModel, textModel, visionQaEnabled);

    return NextResponse.json({
      success: job.status === "succeeded",
      job,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Lỗi xử lý tạo ảnh" }, { status: 500 });
  }
}
