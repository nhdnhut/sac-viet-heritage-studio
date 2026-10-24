import { GoogleGenAI } from "@google/genai";
import { BriefInput, OutfitSpec } from "@/types";
import catalogData from "@/data/catalog.json";
import culturalFactsData from "@/data/cultural_facts.json";
import beliefPaletteData from "@/data/belief_palette.json";
import { computeSpecHash } from "@/lib/tools";
import { buildThinkingConfig } from "@/lib/gemini";

export interface StylingResult {
  options: OutfitSpec[];
  clarifyingQuestion?: string;
  culturalContext: string;
  sourceAttributions: string[];
}

// Deterministic offline styling generator (Ensures zero stubs even without API key)
export function generateLocalStyling(brief: BriefInput): StylingResult {
  const garmentType =
    brief.garmentPreference === "any"
      ? brief.occasion === "ky_yeu_hoc_duong"
        ? "ao_dai_hien_dai"
        : "ao_ngu_than_tay_chen"
      : brief.garmentPreference;

  const garmentMeta =
    catalogData.garments.find((g) => g.id === garmentType) || catalogData.garments[0];

  // Palette resolution
  let primaryCol = garmentMeta.defaultColors.primary;
  let secondaryCol = garmentMeta.defaultColors.secondary;
  let pantsCol = garmentMeta.defaultColors.pants;

  if (brief.selectedColors && brief.selectedColors.length > 0) {
    primaryCol = brief.selectedColors[0];
    if (brief.selectedColors.length > 1) secondaryCol = brief.selectedColors[1];
  } else if (brief.beliefElement) {
    const el = beliefPaletteData.elements.find((e) => e.element === brief.beliefElement);
    if (el && el.primaryColors.length > 0) {
      primaryCol = el.primaryColors[0].hex;
      if (el.secondaryColors.length > 0) {
        secondaryCol = el.secondaryColors[0].hex;
      }
    }
  }

  const now = new Date().toISOString();

  // Option 1: Trân trọng truyền thống (Preserve Tradition)
  const option1Base = {
    id: `opt1_${Date.now()}`,
    name: `${garmentMeta.name} — Tôn Vinh Cổ Điển`,
    garmentId: garmentType as any,
    garmentName: garmentMeta.name,
    collarId: garmentMeta.collarTypes[0].id,
    collarName: garmentMeta.collarTypes[0].name,
    sleeveId: garmentMeta.sleeveTypes[0].id,
    sleeveName: garmentMeta.sleeveTypes[0].name,
    buttonId: garmentMeta.buttonTypes[0].id,
    buttonName: garmentMeta.buttonTypes[0].name,
    pantsId: garmentMeta.pantsTypes[0].id,
    pantsName: garmentMeta.pantsTypes[0].name,
    primaryColor: primaryCol,
    secondaryColor: secondaryCol,
    pantsColor: pantsCol,
    fabricId: garmentMeta.fabrics[0].id,
    fabricName: garmentMeta.fabrics[0].name,
    accessories: ["khan_dong_truyen_thong", "tram_cai_sen_bac"],
    remixStory: {
      keep: [
        "Phom dáng y phục chuẩn tắc (5 thân ghép vạt tả lập hoặc 2 tà buông rủ)",
        "Nẹp cổ đứng đoan trang ôm khít",
        "5 cúc cài bên sườn phải giữ trọn tinh thần Ngũ thường",
      ],
      remix: [
        "Chất liệu lụa dệt hoa văn sen chìm hiện đại hóa nhẹ nhàng",
        "Trâm cài tóc bạc xà cừ gia công thanh mảnh phù hợp bạn trẻ",
      ],
      culturalMeaning:
        "Tôn vinh quy thức y phục truyền thống Việt Nam, gìn giữ nét đĩnh đạc và đoan trang của tổ tiên.",
      aestheticReasoning:
        "Sự chuẩn mực luôn mang lại vẻ đẹp bền vững qua thời gian, đặc biệt trang trọng cho các nghi lễ lớn và ngày đầu năm mới.",
    },
    lockedFeatures: {},
    revision: 1,
    createdAt: now,
    updatedAt: now,
  };

  // Option 2: Giao thoa Đương đại (Balanced Contemporary Fusion)
  const option2Base = {
    id: `opt2_${Date.now()}`,
    name: `${garmentMeta.name} — Giao Thoa Đương Đại`,
    garmentId: garmentType as any,
    garmentName: garmentMeta.name,
    collarId: garmentMeta.collarTypes.length > 1 ? garmentMeta.collarTypes[1].id : garmentMeta.collarTypes[0].id,
    collarName: garmentMeta.collarTypes.length > 1 ? garmentMeta.collarTypes[1].name : garmentMeta.collarTypes[0].name,
    sleeveId: garmentMeta.sleeveTypes[0].id,
    sleeveName: garmentMeta.sleeveTypes[0].name,
    buttonId: garmentMeta.buttonTypes[0].id,
    buttonName: garmentMeta.buttonTypes[0].name,
    pantsId: garmentMeta.pantsTypes.length > 1 ? garmentMeta.pantsTypes[1].id : garmentMeta.pantsTypes[0].id,
    pantsName: garmentMeta.pantsTypes.length > 1 ? garmentMeta.pantsTypes[1].name : garmentMeta.pantsTypes[0].name,
    primaryColor: secondaryCol,
    secondaryColor: primaryCol,
    pantsColor: pantsCol,
    fabricId: garmentMeta.fabrics.length > 1 ? garmentMeta.fabrics[1].id : garmentMeta.fabrics[0].id,
    fabricName: garmentMeta.fabrics.length > 1 ? garmentMeta.fabrics[1].name : garmentMeta.fabrics[0].name,
    accessories: ["quat_giay_do_thu_phap", "tui_gam_theu_hoa_thuy_ba"],
    remixStory: {
      keep: [
        "Hàng cúc cài hữu nhậm bên nách",
        "Tay chẽn thon gọn ôm cổ tay hoặc đường tà raglan mượt mà",
      ],
      remix: [
        "Phối màu tương phản giữa thân áo và nẹp viền lót vạt áo",
        "Túi gấm đeo chéo mini họa tiết Thủy Ba triều Nguyễn tái sinh",
        "Cổ hạ thấp 2.5cm tạo cảm giác thoáng đãng, năng động",
      ],
      culturalMeaning:
        "Tái hiện tinh thần tiếp biến văn hóa: mang di sản bước vào nhịp sống thường nhật của giới trẻ.",
      aestheticReasoning:
        "Tạo điểm nhấn thị giác qua phụ kiện tiện dụng, giúp người mặc vừa tự tin chụp ảnh vừa thoải mái di chuyển.",
    },
    lockedFeatures: {},
    revision: 1,
    createdAt: now,
    updatedAt: now,
  };

  // Option 3: Phá cách Học đường (Youthful Streetwear Remix)
  const option3Base = {
    id: `opt3_${Date.now()}`,
    name: `${garmentMeta.name} — Phá Cách Học Đường`,
    garmentId: garmentType as any,
    garmentName: garmentMeta.name,
    collarId: garmentMeta.collarTypes[0].id,
    collarName: garmentMeta.collarTypes[0].name,
    sleeveId: garmentMeta.sleeveTypes.length > 1 ? garmentMeta.sleeveTypes[1].id : garmentMeta.sleeveTypes[0].id,
    sleeveName: garmentMeta.sleeveTypes.length > 1 ? garmentMeta.sleeveTypes[1].name : garmentMeta.sleeveTypes[0].name,
    buttonId: garmentMeta.buttonTypes[0].id,
    buttonName: garmentMeta.buttonTypes[0].name,
    pantsId: garmentMeta.pantsTypes.length > 1 ? garmentMeta.pantsTypes[1].id : garmentMeta.pantsTypes[0].id,
    pantsName: garmentMeta.pantsTypes.length > 1 ? garmentMeta.pantsTypes[1].name : garmentMeta.pantsTypes[0].name,
    primaryColor: primaryCol,
    secondaryColor: "#D4AF37",
    pantsColor: "#FFFDF7",
    fabricId: garmentMeta.fabrics.length > 2 ? garmentMeta.fabrics[2].id : garmentMeta.fabrics[0].id,
    fabricName: garmentMeta.fabrics.length > 2 ? garmentMeta.fabrics[2].name : garmentMeta.fabrics[0].name,
    accessories: ["sneaker_trang_remix", "tui_gam_theu_hoa_thuy_ba"],
    remixStory: {
      keep: [
        "Cấu trúc nẹp thân áo và tỷ lệ tà áo nguyên bản",
      ],
      remix: [
        "Vải đũi tơ thô dệt tự nhiên thoáng mát thay cho lụa bóng",
        "Đi cùng giày sneaker trắng canvas tạo độ tương phản giữa cổ kính và hiện đại",
        "Tay áo viền lót màu tương phản khi xắn gấu",
      ],
      culturalMeaning:
        "Sự khẳng định bản sắc dân tộc của thế hệ Gen Z: tự hào diện cổ phục trong mọi không gian học tập và sinh hoạt.",
      aestheticReasoning:
        "Phá vỡ định kiến trang phục truyền thống gò bó, mang lại năng lượng trẻ trung, tràn đầy sức sống.",
    },
    lockedFeatures: {},
    revision: 1,
    createdAt: now,
    updatedAt: now,
  };

  const options: OutfitSpec[] = [
    { ...option1Base, specHash: computeSpecHash(option1Base) },
    { ...option2Base, specHash: computeSpecHash(option2Base) },
    { ...option3Base, specHash: computeSpecHash(option3Base) },
  ];

  return {
    options,
    culturalContext:
      "Áo ngũ thân tay chẽn triều Nguyễn đại diện cho sự chuẩn mực, khiêm nhường và đĩnh đạc. Áo dài hiện đại kế thừa nét thướt tha, tôn dáng và bay bổng.",
    sourceAttributions: ["Ngàn Năm Áo Mũ (Trần Quang Đức)", "Trang phục triều Nguyễn (TTBTDT Cố đô Huế)"],
  };
}

// AI-Powered Styling using Gemini API
export async function generateAiStyling(
  apiKey: string,
  brief: BriefInput,
  textModel = "gemini-3.8-flash",
  thinkingLevel: "off" | "low" | "medium" | "high" = "high"
): Promise<StylingResult> {
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
Bạn là chuyên gia thiết kế và giám tuyển trang phục tại "SẮC VIỆT STUDIO" (Việt phục Remix).
Nhiệm vụ của bạn: Từ yêu cầu người dùng, đề xuất 3 phương án phối y phục Việt phục (Áo ngũ thân tay chẽn hoặc Áo dài hiện đại).

DỮ LIỆU ĐẦU VÀO:
- Bối cảnh: ${brief.occasion}
- Ưu tiên loại áo: ${brief.garmentPreference}
- Phong cách: ${brief.styleVibe}
- Mô tả tự do từ người dùng: ${brief.customPrompt || "Không có"}
- Màu sắc yêu cầu: ${brief.selectedColors ? brief.selectedColors.join(", ") : "Tự do phối"}
- Hành đã chọn: ${brief.beliefElement || "Không áp dụng"}

QUY TẮC BẮT BUỘC:
1. Đưa ra chính xác 3 phương án khác biệt nhau:
   - Phương án 1: Trân trọng cổ điển (giữ tối đa quy thức truyền thống, điểm xuyết remix nhẹ).
   - Phương án 2: Giao thoa đương đại (cân bằng hài hòa giữa chất liệu/phụ kiện mới).
   - Phương án 3: Phá cách học đường (trẻ trung, kết hợp đũi thô, sneaker, túi gấm mini).
2. Thẻ "Giữ gì — Remix gì?" phải ghi rõ ràng, cụ thể từng chi tiết (vạt, nẹp, khuy, phụ kiện, chất liệu).
3. Độc lập hoàn toàn giữa Sử liệu thực tế (quy thức triều Nguyễn) và Quan niệm ngũ hành biểu trưng (chỉ tham khảo khi người dùng chọn).
4. Định dạng trả về: JSON thuần túy theo schema sau:

{
  "options": [
    {
      "id": "opt_1",
      "name": "Tên phương án",
      "garmentId": "ao_ngu_than_tay_chen" hoặc "ao_dai_hien_dai",
      "garmentName": "Áo ngũ thân tay chẽn" hoặc "Áo dài hiện đại",
      "collarId": "id_co_ao",
      "collarName": "Tên kiểu cổ",
      "sleeveId": "id_tay_ao",
      "sleeveName": "Tên kiểu tay",
      "buttonId": "cuc_ngoc_5_chiec",
      "buttonName": "Tên loại cúc",
      "pantsId": "id_quan",
      "pantsName": "Tên kiểu quần",
      "primaryColor": "#HEX",
      "secondaryColor": "#HEX",
      "pantsColor": "#HEX",
      "fabricId": "id_vai",
      "fabricName": "Tên chất liệu vải",
      "accessories": ["id_phu_kien_1", "id_phu_kien_2"],
      "remixStory": {
        "keep": ["Yếu tố truyền thống 1", "Yếu tố truyền thống 2"],
        "remix": ["Điểm cách tân 1", "Điểm cách tân 2"],
        "culturalMeaning": "Ý nghĩa văn hóa sâu sắc",
        "aestheticReasoning": "Lý giải phối màu và thẩm mỹ"
      }
    }
  ],
  "clarifyingQuestion": "Một câu hỏi làm rõ nếu thiếu ràng buộc trọng yếu (hoặc null nếu đủ)",
  "culturalContext": "Tóm tắt bối cảnh văn hóa liên quan",
  "sourceAttributions": ["Nguồn trích dẫn sử liệu"]
}
`;

    const thinkingConfig = buildThinkingConfig(thinkingLevel);

    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        ...thinkingConfig,
      },
    });

    const text = response.text?.trim() || "";
    const parsed = JSON.parse(text);

    const now = new Date().toISOString();
    const formattedOptions: OutfitSpec[] = parsed.options.map((opt: any, idx: number) => {
      const base = {
        ...opt,
        id: `opt_${Date.now()}_${idx}`,
        lockedFeatures: {},
        revision: 1,
        createdAt: now,
        updatedAt: now,
      };
      return {
        ...base,
        specHash: computeSpecHash(base),
      };
    });

    return {
      options: formattedOptions,
      clarifyingQuestion: parsed.clarifyingQuestion || undefined,
      culturalContext: parsed.culturalContext || "Tri thức y phục truyền thống Việt Nam.",
      sourceAttributions: parsed.sourceAttributions || ["Ngàn Năm Áo Mũ (Trần Quang Đức)"],
    };
  } catch (err) {
    console.error("Gemini AI Styling failed, falling back to local deterministic engine:", err);
    // Graceful fallback to deterministic local engine
    return generateLocalStyling(brief);
  }
}
