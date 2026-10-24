import { NextRequest, NextResponse } from "next/server";
import { getActiveApiKey, getSession, verifyLocalOrigin } from "@/lib/session";
import { testGeminiConnection } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  if (!verifyLocalOrigin(req)) {
    return NextResponse.json({ error: "Yêu cầu bị từ chối: Sai lệch Origin/Host" }, { status: 403 });
  }

  const sessionId = req.cookies.get("sac_viet_session")?.value;
  const session = getSession(sessionId);

  // Read provided key from body if testing directly from input field, otherwise active key
  let apiKeyToTest: string | null = null;
  try {
    const body = await req.json();
    if (body.apiKey && typeof body.apiKey === "string" && body.apiKey.trim() !== "") {
      apiKeyToTest = body.apiKey.trim();
    }
  } catch {
    // Body may be empty, proceed to active key
  }

  if (!apiKeyToTest) {
    apiKeyToTest = getActiveApiKey(sessionId);
  }

  if (!apiKeyToTest) {
    return NextResponse.json(
      {
        success: false,
        error: "Chưa cấu hình API Key. Vui lòng nhập key hoặc thêm GEMINI_API_KEY vào .env.local",
        models: [],
      },
      { status: 400 }
    );
  }

  const textModel = session?.textModel || "gemini-3.8-flash";
  const imageModel = session?.imageModel || "gemini-3.1-flash-image";

  const result = await testGeminiConnection(apiKeyToTest, textModel, imageModel);
  return NextResponse.json(result);
}
