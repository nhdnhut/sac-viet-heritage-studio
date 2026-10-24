import { NextRequest, NextResponse } from "next/server";
import { getActiveApiKey, getSession } from "@/lib/session";
import { BriefInputSchema } from "@/lib/schemas";
import { generateAiStyling, generateLocalStyling } from "@/lib/stylingEngine";
import { saveLook } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedBrief = BriefInputSchema.parse(body);

    const sessionId = req.cookies.get("sac_viet_session")?.value;
    const session = getSession(sessionId);
    const apiKey = getActiveApiKey(sessionId);

    let result;
    if (apiKey) {
      result = await generateAiStyling(
        apiKey,
        validatedBrief,
        session?.textModel || "gemini-3.8-flash",
        session?.thinkingLevel || "high"
      );
    } else {
      result = generateLocalStyling(validatedBrief);
    }

    // Persist generated looks to SQLite
    for (const opt of result.options) {
      saveLook(opt);
    }

    return NextResponse.json({
      success: true,
      data: result,
      source: apiKey ? "gemini_live" : "local_deterministic",
    });
  } catch (err: any) {
    console.error("API /api/style error:", err);
    return NextResponse.json({ error: err?.message || "Lỗi xử lý yêu cầu phối đồ" }, { status: 400 });
  }
}
