import crypto from "node:crypto";
import catalogData from "@/data/catalog.json";
import culturalFactsData from "@/data/cultural_facts.json";
import beliefPaletteData from "@/data/belief_palette.json";
import sourcesData from "@/data/sources.json";
import { OutfitSpec, BriefInput, PatchLookInput } from "@/types";
import {
  saveLook,
  getLook,
  listLooks,
  listWardrobe,
  getLookRevisions,
} from "@/lib/db";
import { OutfitSpecSchema, PatchLookInputSchema } from "@/lib/schemas";

export function computeSpecHash(spec: Omit<OutfitSpec, "specHash" | "revision">): string {
  const normalized = {
    garmentId: spec.garmentId,
    collarId: spec.collarId,
    sleeveId: spec.sleeveId,
    buttonId: spec.buttonId,
    pantsId: spec.pantsId,
    primaryColor: spec.primaryColor.toUpperCase(),
    secondaryColor: spec.secondaryColor.toUpperCase(),
    pantsColor: spec.pantsColor.toUpperCase(),
    fabricId: spec.fabricId,
    accessories: [...spec.accessories].sort(),
  };
  return crypto.createHash("sha256").update(JSON.stringify(normalized)).digest("hex").slice(0, 16);
}

// 1. search_catalog
export function searchCatalog(query?: string, garmentId?: string) {
  let garments = catalogData.garments;
  if (garmentId && garmentId !== "any") {
    garments = garments.filter((g) => g.id === garmentId);
  }

  if (query) {
    const q = query.toLowerCase();
    garments = garments.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.remixPossibilities.some((r) => r.toLowerCase().includes(q))
    );
  }

  return {
    garments,
    accessories: catalogData.accessories,
    occasions: catalogData.occasions,
  };
}

// 2. retrieve_cultural_facts
export function retrieveCulturalFacts(category?: string, query?: string) {
  let facts = culturalFactsData.facts;
  if (category) {
    facts = facts.filter((f) => f.category === category);
  }
  if (query) {
    const q = query.toLowerCase();
    facts = facts.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        f.content.toLowerCase().includes(q)
    );
  }

  // Attach full source details
  return facts.map((fact) => {
    const matchedSources = sourcesData.sources.filter((s) => fact.sourceIds.includes(s.id));
    return {
      ...fact,
      sourceDetails: matchedSources,
    };
  });
}

// 3. get_belief_palette
export function getBeliefPalette(element?: string) {
  if (!element) {
    return {
      disclaimer: beliefPaletteData.disclaimer,
      scope: beliefPaletteData.scope,
      reviewStatus: beliefPaletteData.reviewStatus,
      elements: beliefPaletteData.elements,
    };
  }

  const found = beliefPaletteData.elements.find((e) => e.element.toLowerCase() === element.toLowerCase());
  if (!found) {
    return {
      error: `Không tìm thấy hành '${element}'. Các hành hỗ trợ: kim, moc, thuy, hoa, tho.`,
      disclaimer: beliefPaletteData.disclaimer,
    };
  }

  return {
    disclaimer: beliefPaletteData.disclaimer,
    scope: beliefPaletteData.scope,
    reviewStatus: beliefPaletteData.reviewStatus,
    element: found,
  };
}

// 4. list_wardrobe
export function listUserWardrobe() {
  return listWardrobe();
}

// 5. create_look
export function createLookTool(specData: any): { success: boolean; look?: OutfitSpec; error?: string } {
  try {
    const now = new Date().toISOString();
    const id = specData.id || `look_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const revision = 1;

    const baseSpec = {
      ...specData,
      id,
      revision,
      createdAt: now,
      updatedAt: now,
      lockedFeatures: specData.lockedFeatures || {},
    };

    const specHash = computeSpecHash(baseSpec);
    const fullSpec: OutfitSpec = {
      ...baseSpec,
      specHash,
    };

    // Validate with Zod
    const validated = OutfitSpecSchema.parse(fullSpec);
    saveLook(validated);

    return { success: true, look: validated };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// 6. patch_look (with optimistic baseRevision checking)
export function patchLookTool(input: PatchLookInput): {
  success: boolean;
  look?: OutfitSpec;
  error?: string;
  conflict?: boolean;
} {
  try {
    const validatedInput = PatchLookInputSchema.parse(input);
    const existing = getLook(validatedInput.lookId);
    if (!existing) {
      return { success: false, error: `Không tìm thấy bộ phối ID: ${validatedInput.lookId}` };
    }

    // Optimistic Concurrency Control
    if (existing.revision !== validatedInput.baseRevision) {
      return {
        success: false,
        conflict: true,
        error: `Xung đột phiên bản! Phiên bản hiện tại là ${existing.revision}, nhưng yêu cầu dựa trên phiên bản ${validatedInput.baseRevision}. Vui lòng làm mới trước khi sửa đổi.`,
      };
    }

    const locked = existing.lockedFeatures || {};
    const patch = validatedInput.patch;

    // Respect locked features
    const updatedColors = locked.colors
      ? {
          primaryColor: existing.primaryColor,
          secondaryColor: existing.secondaryColor,
          pantsColor: existing.pantsColor,
        }
      : {
          primaryColor: patch.primaryColor || existing.primaryColor,
          secondaryColor: patch.secondaryColor || existing.secondaryColor,
          pantsColor: patch.pantsColor || existing.pantsColor,
        };

    const updatedCollar = locked.collar
      ? { collarId: existing.collarId, collarName: existing.collarName }
      : {
          collarId: patch.collarId || existing.collarId,
          collarName: patch.collarName || existing.collarName,
        };

    const updatedSleeves = locked.sleeves
      ? { sleeveId: existing.sleeveId, sleeveName: existing.sleeveName }
      : {
          sleeveId: patch.sleeveId || existing.sleeveId,
          sleeveName: patch.sleeveName || existing.sleeveName,
        };

    const updatedAccessories = locked.accessories
      ? existing.accessories
      : patch.accessories || existing.accessories;

    const newRevision = existing.revision + 1;
    const now = new Date().toISOString();

    const newSpecCandidate = {
      ...existing,
      ...patch,
      ...updatedColors,
      ...updatedCollar,
      ...updatedSleeves,
      accessories: updatedAccessories,
      lockedFeatures: patch.lockedFeatures || existing.lockedFeatures,
      revision: newRevision,
      updatedAt: now,
    };

    const specHash = computeSpecHash(newSpecCandidate);
    const finalSpec: OutfitSpec = {
      ...newSpecCandidate,
      specHash,
    };

    const validated = OutfitSpecSchema.parse(finalSpec);
    saveLook(validated);

    return { success: true, look: validated };
  } catch (err: any) {
    return { success: false, error: err?.message || String(err) };
  }
}

// 7. prepare_3d_preview
export function prepare3dPreview(lookId: string) {
  const look = getLook(lookId);
  if (!look) {
    return { success: false, error: "Không tìm thấy bộ phối" };
  }

  return {
    success: true,
    meshType: look.garmentId,
    materials: {
      primary: { color: look.primaryColor, fabric: look.fabricId },
      secondary: { color: look.secondaryColor },
      pants: { color: look.pantsColor },
    },
    accessories: look.accessories,
    cameraPresets: ["front", "back", "left", "right"],
    simulationNotice: "Mô hình tham số 3D tái hiện phom dáng và phối màu; không thay thế bản rập may mặc.",
  };
}

// 8. compare_looks
export function compareLooksTool(lookIdA: string, lookIdB: string) {
  const lookA = getLook(lookIdA);
  const lookB = getLook(lookIdB);

  if (!lookA || !lookB) {
    return { success: false, error: "Một trong hai bộ phối không tồn tại" };
  }

  return {
    success: true,
    lookA,
    lookB,
    differences: {
      garment: lookA.garmentId !== lookB.garmentId,
      colors:
        lookA.primaryColor !== lookB.primaryColor ||
        lookA.secondaryColor !== lookB.secondaryColor ||
        lookA.pantsColor !== lookB.pantsColor,
      collar: lookA.collarId !== lookB.collarId,
      sleeves: lookA.sleeveId !== lookB.sleeveId,
      accessories: JSON.stringify(lookA.accessories) !== JSON.stringify(lookB.accessories),
    },
  };
}

// 9. save_lookbook
export function saveLookbookTool(look: OutfitSpec) {
  saveLook(look);
  return { success: true, savedLookId: look.id, revision: look.revision };
}

// 10. export_design_brief
export function exportDesignBriefTool(lookId: string) {
  const look = getLook(lookId);
  if (!look) {
    return { success: false, error: "Không tìm thấy bộ phối" };
  }

  const revisions = getLookRevisions(lookId);

  return {
    success: true,
    designBrief: {
      title: `Bản Mô Tả Thiết Kế: ${look.name}`,
      lookId: look.id,
      revision: look.revision,
      specHash: look.specHash,
      garment: {
        name: look.garmentName,
        id: look.garmentId,
        collar: look.collarName,
        sleeves: look.sleeveName,
        buttons: look.buttonName,
        pants: look.pantsName,
        fabric: look.fabricName,
      },
      colorPalette: {
        primary: look.primaryColor,
        secondary: look.secondaryColor,
        pants: look.pantsColor,
      },
      accessories: look.accessories,
      remixStory: look.remixStory,
      disclaimers: [
        "Màu sắc thực tế trên vải có thể chênh lệch nhẹ theo chất liệu nhuộm (tơ tằm, đũi, gấm).",
        "Số đo và đường cắt rập cụ thể cần thợ may thực hiện trực tiếp theo vóc dáng người mặc.",
        "Mẫu tham số 3D và hình ảnh mang tính định hướng tạo hình thẩm mỹ.",
      ],
      revisionHistoryCount: revisions.length,
      exportedAt: new Date().toISOString(),
    },
  };
}

// 11 Tools Allowlist Definition for Gemini Function Calling
export const ALLOWLIST_TOOLS_CONFIG = [
  {
    name: "search_catalog",
    description: "Tra cứu danh mục áo ngũ thân, áo dài, phụ kiện và bối cảnh y phục cổ truyền và remix.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Từ khóa tìm kiếm (tùy chọn)" },
        garmentId: { type: "STRING", description: "ID loại áo (ao_ngu_than_tay_chen hoặc ao_dai_hien_dai)" },
      },
    },
  },
  {
    name: "retrieve_cultural_facts",
    description: "Truy xuất tri thức lịch sử triều Nguyễn, cấu trúc 5 thân, ý nghĩa ngũ thường và nguồn khảo cứu.",
    parameters: {
      type: "OBJECT",
      properties: {
        category: { type: "STRING", description: "Danh mục kiến thức (tùy chọn)" },
        query: { type: "STRING", description: "Từ khóa tìm kiếm kiến thức" },
      },
    },
  },
  {
    name: "get_belief_palette",
    description: "Lấy bảng màu ngũ hành dân gian theo lựa chọn chủ động của người dùng (kim, moc, thuy, hoa, tho).",
    parameters: {
      type: "OBJECT",
      properties: {
        element: { type: "STRING", description: "Hành cụ thể: kim, moc, thuy, hoa, hoặc tho" },
      },
    },
  },
  {
    name: "list_wardrobe",
    description: "Xem danh sách các món đồ có sẵn trong tủ đồ của người dùng để ưu tiên phối ghép.",
    parameters: { type: "OBJECT", properties: {} },
  },
  {
    name: "create_look",
    description: "Tạo một bộ phối y phục mới chuẩn hóa với OutfitSpec và lưu vào hệ thống.",
    parameters: {
      type: "OBJECT",
      properties: {
        specData: { type: "OBJECT", description: "Dữ liệu đặc tả bộ trang phục" },
      },
      required: ["specData"],
    },
  },
  {
    name: "patch_look",
    description: "Chỉnh sửa bộ phối hiện tại có kiểm soát phiên bản (yêu cầu baseRevision để tránh ghi đè).",
    parameters: {
      type: "OBJECT",
      properties: {
        lookId: { type: "STRING", description: "ID bộ phối" },
        baseRevision: { type: "NUMBER", description: "Số phiên bản gốc trước khi sửa" },
        patch: { type: "OBJECT", description: "Các thuộc tính cần sửa đổi" },
        userInstruction: { type: "STRING", description: "Yêu cầu từ người dùng" },
      },
      required: ["lookId", "baseRevision", "patch"],
    },
  },
  {
    name: "prepare_3d_preview",
    description: "Chuẩn bị tham số cho viewport 3D và các góc nhìn.",
    parameters: {
      type: "OBJECT",
      properties: {
        lookId: { type: "STRING", description: "ID bộ phối cần hiển thị 3D" },
      },
      required: ["lookId"],
    },
  },
  {
    name: "compare_looks",
    description: "So sánh hai bộ phối y phục dưới cùng nhu cầu hoặc bối cảnh.",
    parameters: {
      type: "OBJECT",
      properties: {
        lookIdA: { type: "STRING", description: "ID bộ phối thứ nhất" },
        lookIdB: { type: "STRING", description: "ID bộ phối thứ hai" },
      },
      required: ["lookIdA", "lookIdB"],
    },
  },
  {
    name: "save_lookbook",
    description: "Lưu bộ phối vào kho Lookbook cá nhân để lưu giữ qua các phiên làm việc.",
    parameters: {
      type: "OBJECT",
      properties: {
        look: { type: "OBJECT", description: "Đặc tả bộ phối OutfitSpec" },
      },
      required: ["look"],
    },
  },
  {
    name: "export_design_brief",
    description: "Xuất bản mô tả thiết kế đầy đủ (thông số, màu sắc, vải, lưu ý may mặc).",
    parameters: {
      type: "OBJECT",
      properties: {
        lookId: { type: "STRING", description: "ID bộ phối cần xuất" },
      },
      required: ["lookId"],
    },
  },
];
