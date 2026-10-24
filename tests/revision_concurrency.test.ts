import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { createLookTool, patchLookTool } from "../src/lib/tools.js";
import { getLook } from "../src/lib/db.js";

describe("Revision & Concurrency Tests", () => {
  const uniqueId = `concurrency_look_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  before(() => {
    createLookTool({
      id: uniqueId,
      name: "Bộ phối kiểm thử Concurrency",
      garmentId: "ao_ngu_than_tay_chen",
      garmentName: "Áo ngũ thân tay chẽn",
      collarId: "co_dung_truyen_thong",
      collarName: "Cổ đứng",
      sleeveId: "tay_chen_chuan",
      sleeveName: "Tay chẽn",
      buttonId: "cuc_ngoc_5_chiec",
      buttonName: "5 Cúc",
      pantsId: "quan_trang_ong_rong",
      pantsName: "Quần trắng",
      primaryColor: "#800E13",
      secondaryColor: "#D4AF37",
      pantsColor: "#FFFDF7",
      fabricId: "lua_to_tam_ha_dong",
      fabricName: "Lụa tơ tằm",
      accessories: [],
      remixStory: {
        keep: ["Quy thức 5 thân"],
        remix: ["Màu sắc mới"],
        culturalMeaning: "Văn hóa triều Nguyễn.",
        aestheticReasoning: "Phối màu nhã nhặn.",
      },
      lockedFeatures: {},
    });
  });

  test("initial look is at revision 1", () => {
    const look = getLook(uniqueId);
    assert.ok(look);
    assert.equal(look.revision, 1);
  });

  test("patchLookTool succeeds with matching baseRevision and increments revision", () => {
    const patchRes = patchLookTool({
      lookId: uniqueId,
      baseRevision: 1,
      patch: {
        primaryColor: "#1B4931",
      },
    });

    assert.equal(patchRes.success, true);
    assert.ok(patchRes.look);
    assert.equal(patchRes.look.revision, 2);
    assert.equal(patchRes.look.primaryColor, "#1B4931");
  });

  test("patchLookTool rejects stale baseRevision with conflict: true", () => {
    const stalePatchRes = patchLookTool({
      lookId: uniqueId,
      baseRevision: 1, // Current is 2, so 1 must conflict
      patch: {
        primaryColor: "#D4AF37",
      },
    });

    assert.equal(stalePatchRes.success, false);
    assert.equal(stalePatchRes.conflict, true);
    assert.ok(stalePatchRes.error?.includes("Xung đột phiên bản"));
  });

  test("patchLookTool respects lockedFeatures", () => {
    // Lock colors on revision 2
    const lockRes = patchLookTool({
      lookId: uniqueId,
      baseRevision: 2,
      patch: {
        lockedFeatures: { colors: true },
      },
    });
    assert.equal(lockRes.success, true);
    assert.equal(lockRes.look?.revision, 3);
    assert.equal(lockRes.look?.lockedFeatures.colors, true);

    // Attempt to change color when locked
    const lockedPatchRes = patchLookTool({
      lookId: uniqueId,
      baseRevision: 3,
      patch: {
        primaryColor: "#9E2A2B", // Should be ignored
      },
    });

    assert.equal(lockedPatchRes.success, true);
    assert.equal(lockedPatchRes.look?.primaryColor, "#1B4931");
  });
});
