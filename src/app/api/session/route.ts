import { NextRequest, NextResponse } from "next/server";
import {
  createSession,
  getSession,
  updateSession,
  deleteSessionKey,
  hasActiveKey,
  verifyLocalOrigin,
} from "@/lib/session";
import { SettingsUpdateSchema } from "@/lib/schemas";

const COOKIE_NAME = "sac_viet_session";

function getOrSetSessionId(req: NextRequest, resHeaders: Headers): string {
  const existingCookie = req.cookies.get(COOKIE_NAME)?.value;
  if (existingCookie && getSession(existingCookie)) {
    return existingCookie;
  }
  const newId = createSession();
  resHeaders.append(
    "Set-Cookie",
    `${COOKIE_NAME}=${newId}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`
  );
  return newId;
}

export async function GET(req: NextRequest) {
  const resHeaders = new Headers();
  const sessionId = getOrSetSessionId(req, resHeaders);
  const session = getSession(sessionId);
  const keyStatus = hasActiveKey(sessionId);

  return NextResponse.json(
    {
      ...keyStatus,
      textModel: session?.textModel || "gemini-3.8-flash",
      imageModel: session?.imageModel || "gemini-3.1-flash-image",
      thinkingLevel: session?.thinkingLevel || "high",
      maxImagesPerJob: session?.maxImagesPerJob || 3,
      visionQaEnabled: session?.visionQaEnabled ?? true,
    },
    { headers: resHeaders }
  );
}

export async function POST(req: NextRequest) {
  if (!verifyLocalOrigin(req)) {
    return NextResponse.json({ error: "Yêu cầu bị từ chối: Sai lệch Origin/Host" }, { status: 403 });
  }

  const resHeaders = new Headers();
  const sessionId = getOrSetSessionId(req, resHeaders);

  try {
    const body = await req.json();
    const validated = SettingsUpdateSchema.parse(body);

    const updates: any = {};
    if (validated.apiKey !== undefined) {
      updates.apiKey = validated.apiKey;
    }
    if (validated.textModel) updates.textModel = validated.textModel;
    if (validated.imageModel) updates.imageModel = validated.imageModel;
    if (validated.thinkingLevel) updates.thinkingLevel = validated.thinkingLevel;
    if (validated.maxImagesPerJob) updates.maxImagesPerJob = validated.maxImagesPerJob;
    if (validated.visionQaEnabled !== undefined) updates.visionQaEnabled = validated.visionQaEnabled;

    updateSession(sessionId, updates);

    const keyStatus = hasActiveKey(sessionId);
    const session = getSession(sessionId);

    return NextResponse.json(
      {
        success: true,
        message: "Cập nhật thiết lập thành công",
        ...keyStatus,
        textModel: session?.textModel,
        imageModel: session?.imageModel,
        thinkingLevel: session?.thinkingLevel,
      },
      { headers: resHeaders }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Dữ liệu không hợp lệ" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!verifyLocalOrigin(req)) {
    return NextResponse.json({ error: "Yêu cầu bị từ chối" }, { status: 403 });
  }

  const sessionId = req.cookies.get(COOKIE_NAME)?.value;
  if (sessionId) {
    deleteSessionKey(sessionId);
  }

  const keyStatus = hasActiveKey(sessionId);
  return NextResponse.json({
    success: true,
    message: "Đã xóa API key khỏi bộ nhớ phiên làm việc",
    ...keyStatus,
  });
}
