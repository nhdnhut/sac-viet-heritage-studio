import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  searchCatalog,
  retrieveCulturalFacts,
  getBeliefPalette,
  listUserWardrobe,
  createLookTool,
  patchLookTool,
  prepare3dPreview,
  compareLooksTool,
  saveLookbookTool,
  exportDesignBriefTool,
  ALLOWLIST_TOOLS_CONFIG,
} from "../src/lib/tools.js";

describe("Tool Orchestration Allowlist Tests", () => {
  test("ALLOWLIST_TOOLS_CONFIG contains 10 required tool declarations", () => {
    const toolNames = ALLOWLIST_TOOLS_CONFIG.map((t) => t.name);
    assert.ok(toolNames.includes("search_catalog"));
    assert.ok(toolNames.includes("retrieve_cultural_facts"));
    assert.ok(toolNames.includes("get_belief_palette"));
    assert.ok(toolNames.includes("list_wardrobe"));
    assert.ok(toolNames.includes("create_look"));
    assert.ok(toolNames.includes("patch_look"));
    assert.ok(toolNames.includes("prepare_3d_preview"));
    assert.ok(toolNames.includes("compare_looks"));
    assert.ok(toolNames.includes("save_lookbook"));
    assert.ok(toolNames.includes("export_design_brief"));
  });

  test("searchCatalog filters garments correctly", () => {
    const res = searchCatalog("ngũ thân", "ao_ngu_than_tay_chen");
    assert.ok(res.garments.length > 0);
    assert.equal(res.garments[0].id, "ao_ngu_than_tay_chen");
  });

  test("retrieveCulturalFacts attaches source details", () => {
    const facts = retrieveCulturalFacts("garment_anatomy");
    assert.ok(facts.length > 0);
    assert.ok(facts[0].sourceDetails.length > 0);
  });

  test("prepare3dPreview generates parameters without arbitrary code execution", () => {
    // First create a look
    const created = createLookTool({
      id: "look_for_3d",
      name: "Bộ 3D test",
      garmentId: "ao_ngu_than_tay_chen",
      garmentName: "Áo ngũ thân",
      collarId: "co_dung",
      collarName: "Cổ đứng",
      sleeveId: "tay_chen",
      sleeveName: "Tay chẽn",
      buttonId: "cuc_5",
      buttonName: "5 cúc",
      pantsId: "quan_trang",
      pantsName: "Quần trắng",
      primaryColor: "#800E13",
      secondaryColor: "#D4AF37",
      pantsColor: "#FFFDF7",
      fabricId: "lua",
      fabricName: "Lụa",
      accessories: [],
      remixStory: {
        keep: ["Quy thức"],
        remix: ["Màu sắc"],
        culturalMeaning: "Lịch sử",
        aestheticReasoning: "Thẩm mỹ",
      },
      lockedFeatures: {},
    });

    assert.equal(created.success, true);
    const preview = prepare3dPreview("look_for_3d");
    assert.equal(preview.success, true);
    assert.equal(preview.meshType, "ao_ngu_than_tay_chen");
    assert.ok(preview.cameraPresets?.includes("front"));
    assert.ok(preview.cameraPresets?.includes("back"));
  });

  test("exportDesignBriefTool generates complete design brief with disclaimers", () => {
    const exportRes = exportDesignBriefTool("look_for_3d");
    assert.equal(exportRes.success, true);
    assert.ok(exportRes.designBrief);
    assert.ok(exportRes.designBrief.disclaimers.length >= 2);
  });
});
