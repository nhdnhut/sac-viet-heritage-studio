import { NextRequest, NextResponse } from "next/server";
import { PatchLookInputSchema } from "@/lib/schemas";
import { patchLookTool } from "@/lib/tools";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = PatchLookInputSchema.parse(body);

    const result = patchLookTool(validated);
    if (!result.success) {
      const status = result.conflict ? 409 : 400;
      return NextResponse.json({ error: result.error, conflict: result.conflict }, { status });
    }

    return NextResponse.json({
      success: true,
      look: result.look,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Lỗi xác thực dữ liệu patch" }, { status: 400 });
  }
}
