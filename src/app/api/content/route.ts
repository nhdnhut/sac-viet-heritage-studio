import { NextResponse } from "next/server";
import catalogData from "@/data/catalog.json";
import culturalFactsData from "@/data/cultural_facts.json";
import sourcesData from "@/data/sources.json";
import beliefPaletteData from "@/data/belief_palette.json";
import assetCreditsData from "@/data/asset_credits.json";

export async function GET() {
  return NextResponse.json({
    success: true,
    catalog: catalogData,
    culturalFacts: culturalFactsData,
    sources: sourcesData,
    beliefPalette: beliefPaletteData,
    assetCredits: assetCreditsData,
  });
}
