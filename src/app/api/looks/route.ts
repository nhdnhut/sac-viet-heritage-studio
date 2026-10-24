import { NextRequest, NextResponse } from "next/server";
import { listLooks, saveLook } from "@/lib/db";
import { OutfitSpecSchema } from "@/lib/schemas";

export async function GET() {
  const looks = listLooks();
  return NextResponse.json({ success: true, looks });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = OutfitSpecSchema.parse(body);
    saveLook(validated);
    return NextResponse.json({ success: true, look: validated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Dữ liệu look không hợp lệ" }, { status: 400 });
  }
}
