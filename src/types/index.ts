export type GarmentCategory = "traditional_nguyen" | "modern_evolution";

export type BeliefElement = "kim" | "moc" | "thuy" | "hoa" | "tho";

export interface RemixStory {
  keep: string[];
  remix: string[];
  culturalMeaning: string;
  aestheticReasoning: string;
}

export interface LockedFeatures {
  garment?: boolean;
  colors?: boolean;
  collar?: boolean;
  sleeves?: boolean;
  accessories?: boolean;
}

export interface OutfitSpec {
  id: string;
  name: string;
  garmentId: "ao_ngu_than_tay_chen" | "ao_dai_hien_dai";
  garmentName: string;
  collarId: string;
  collarName: string;
  sleeveId: string;
  sleeveName: string;
  buttonId: string;
  buttonName: string;
  pantsId: string;
  pantsName: string;
  primaryColor: string;
  secondaryColor: string;
  pantsColor: string;
  fabricId: string;
  fabricName: string;
  accessories: string[];
  remixStory: RemixStory;
  lockedFeatures: LockedFeatures;
  specHash: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
}

export interface BriefInput {
  occasion: string;
  garmentPreference: "ao_ngu_than_tay_chen" | "ao_dai_hien_dai" | "any";
  styleVibe: string;
  customPrompt?: string;
  selectedColors?: string[];
  beliefElement?: BeliefElement | null;
  wardrobeItemIds?: string[];
  constraints?: string[];
}

export interface PatchLookInput {
  lookId: string;
  baseRevision: number;
  patch: Partial<OutfitSpec>;
  userInstruction?: string;
}

export interface WardrobeItem {
  id: string;
  name: string;
  type: "garment" | "accessory" | "footwear" | "pants";
  colorHex?: string;
  fabric?: string;
  notes?: string;
  createdAt: string;
}

export interface RenderJob {
  id: string;
  lookId: string;
  revision: number;
  specHash: string;
  status: "queued" | "running" | "succeeded" | "failed" | "cancelled" | "unknown";
  imageUrl?: string;
  assetId?: string;
  qaScore?: number;
  qaReport?: {
    passed: boolean;
    garmentMatch: boolean;
    colorMatch: boolean;
    sleeveMatch: boolean;
    collarMatch: boolean;
    notes: string;
    needsHumanReview?: boolean;
  };
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsState {
  hasEnvKey: boolean;
  hasSessionKey: boolean;
  activeKeySource: "env" | "session" | "none";
  textModel: string;
  imageModel: string;
  thinkingLevel: "off" | "low" | "medium" | "high";
  maxImagesPerJob: number;
  visionQaEnabled: boolean;
}
