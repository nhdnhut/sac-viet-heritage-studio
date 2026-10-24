import { z } from "zod";

export const HexColorSchema = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
  message: "Mã màu phải là định dạng Hex hợp lệ (#RGB hoặc #RRGGBB)",
});

export const RemixStorySchema = z.object({
  keep: z.array(z.string().min(1)).min(1, "Phải nêu ít nhất một yếu tố cổ truyền được gìn giữ"),
  remix: z.array(z.string().min(1)).min(1, "Phải nêu ít nhất một điểm cách tân sáng tạo"),
  culturalMeaning: z.string().min(1, "Phải có ý nghĩa văn hóa"),
  aestheticReasoning: z.string().min(1, "Phải có lập luận thẩm mỹ"),
});

export const LockedFeaturesSchema = z.object({
  garment: z.boolean().optional(),
  colors: z.boolean().optional(),
  collar: z.boolean().optional(),
  sleeves: z.boolean().optional(),
  accessories: z.boolean().optional(),
});

export const OutfitSpecSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Tên bộ trang phục không được để trống"),
  garmentId: z.enum(["ao_ngu_than_tay_chen", "ao_dai_hien_dai"]),
  garmentName: z.string().min(1),
  collarId: z.string().min(1),
  collarName: z.string().min(1),
  sleeveId: z.string().min(1),
  sleeveName: z.string().min(1),
  buttonId: z.string().min(1),
  buttonName: z.string().min(1),
  pantsId: z.string().min(1),
  pantsName: z.string().min(1),
  primaryColor: HexColorSchema,
  secondaryColor: HexColorSchema,
  pantsColor: HexColorSchema,
  fabricId: z.string().min(1),
  fabricName: z.string().min(1),
  accessories: z.array(z.string()),
  remixStory: RemixStorySchema,
  lockedFeatures: LockedFeaturesSchema,
  specHash: z.string(),
  revision: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const BriefInputSchema = z.object({
  occasion: z.string().min(1, "Vui lòng chọn hoặc nhập bối cảnh"),
  garmentPreference: z.enum(["ao_ngu_than_tay_chen", "ao_dai_hien_dai", "any"]),
  styleVibe: z.string().min(1, "Vui lòng chọn hoặc nhập phong cách mong muốn"),
  customPrompt: z.string().max(1000).optional(),
  selectedColors: z.array(HexColorSchema).max(5).optional(),
  beliefElement: z.enum(["kim", "moc", "thuy", "hoa", "tho"]).nullable().optional(),
  wardrobeItemIds: z.array(z.string()).optional(),
  constraints: z.array(z.string()).optional(),
});

export const PatchLookInputSchema = z.object({
  lookId: z.string().min(1),
  baseRevision: z.number().int().nonnegative(),
  patch: z.object({
    name: z.string().optional(),
    collarId: z.string().optional(),
    collarName: z.string().optional(),
    sleeveId: z.string().optional(),
    sleeveName: z.string().optional(),
    buttonId: z.string().optional(),
    buttonName: z.string().optional(),
    pantsId: z.string().optional(),
    pantsName: z.string().optional(),
    primaryColor: HexColorSchema.optional(),
    secondaryColor: HexColorSchema.optional(),
    pantsColor: HexColorSchema.optional(),
    fabricId: z.string().optional(),
    fabricName: z.string().optional(),
    accessories: z.array(z.string()).optional(),
    lockedFeatures: LockedFeaturesSchema.optional(),
  }),
  userInstruction: z.string().max(500).optional(),
});

export const WardrobeItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1, "Tên món đồ không được để trống"),
  type: z.enum(["garment", "accessory", "footwear", "pants"]),
  colorHex: HexColorSchema.optional(),
  fabric: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export const SettingsUpdateSchema = z.object({
  apiKey: z.string().trim().optional(),
  textModel: z.string().min(1).optional(),
  imageModel: z.string().min(1).optional(),
  thinkingLevel: z.enum(["off", "low", "medium", "high"]).optional(),
  maxImagesPerJob: z.number().int().min(1).max(5).optional(),
  visionQaEnabled: z.boolean().optional(),
});
