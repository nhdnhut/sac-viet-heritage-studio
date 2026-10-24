import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  HexColorSchema,
  OutfitSpecSchema,
  BriefInputSchema,
  PatchLookInputSchema,
} from "../src/lib/schemas.js";

describe("Schema Validation Tests", () => {
  test("HexColorSchema accepts valid 6-char and 3-char hex colors", () => {
    assert.equal(HexColorSchema.safeParse("#800E13").success, true);
    assert.equal(HexColorSchema.safeParse("#FFF").success, true);
    assert.equal(HexColorSchema.safeParse("#D4AF37").success, true);
  });

  test("HexColorSchema rejects invalid color values", () => {
    assert.equal(HexColorSchema.safeParse("red").success, false);
    assert.equal(HexColorSchema.safeParse("#GGG123").success, false);
    assert.equal(HexColorSchema.safeParse("123456").success, false);
  });

  test("BriefInputSchema validates required fields", () => {
    const validBrief = {
      occasion: "tet_nguyen_dan",
      garmentPreference: "ao_ngu_than_tay_chen",
      styleVibe: "Trang trọng, hoài cổ",
    };
    assert.equal(BriefInputSchema.safeParse(validBrief).success, true);
  });

  test("OutfitSpecSchema validates complete outfit data", () => {
    const sampleSpec = {
      id: "look_test_1",
      name: "Áo ngũ thân kiểm thử",
      garmentId: "ao_ngu_than_tay_chen",
      garmentName: "Áo ngũ thân tay chẽn",
      collarId: "co_dung_truyen_thong",
      collarName: "Cổ đứng truyền thống",
      sleeveId: "tay_chen_chuan",
      sleeveName: "Tay chẽn chuẩn mực",
      buttonId: "cuc_ngoc_5_chiec",
      buttonName: "5 Cúc ngọc",
      pantsId: "quan_trang_ong_rong",
      pantsName: "Quần trắng ống rộng",
      primaryColor: "#800E13",
      secondaryColor: "#D4AF37",
      pantsColor: "#FFFDF7",
      fabricId: "lua_to_tam_ha_dong",
      fabricName: "Lụa tơ tằm Vạn Phúc",
      accessories: ["khan_dong_truyen_thong"],
      remixStory: {
        keep: ["Quy thức 5 thân", "Nẹp khuy hữu nhậm"],
        remix: ["Phối màu đương đại"],
        culturalMeaning: "Gìn giữ bản sắc truyền thống.",
        aestheticReasoning: "Tôn vinh nét đẹp đoan trang.",
      },
      lockedFeatures: {},
      specHash: "hash123",
      revision: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    assert.equal(OutfitSpecSchema.safeParse(sampleSpec).success, true);
  });
});
