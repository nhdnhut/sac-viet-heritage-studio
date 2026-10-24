import { NextRequest, NextResponse } from "next/server";
import { listWardrobe, saveWardrobeItem } from "@/lib/db";
import { WardrobeItemSchema } from "@/lib/schemas";

export async function GET() {
  const items = listWardrobe();
  return NextResponse.json({ success: true, items });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body.id || `wardrobe_${Date.now()}`;
    const validated = WardrobeItemSchema.parse({
      ...body,
      id,
      createdAt: body.createdAt || new Date().toISOString(),
    });

    saveWardrobeItem(validated);
    return NextResponse.json({ success: true, item: validated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Dữ liệu tủ đồ không hợp lệ" }, { status: 400 });
  }
}
