import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  saveLook,
  getLook,
  listLooks,
  deleteLook,
  getLookRevisions,
  saveWardrobeItem,
  listWardrobe,
  deleteWardrobeItem,
} from "../src/lib/db.js";

describe("SQLite Persistence Tests", () => {
  const testLookId = "test_persistence_look_1";

  test("saveLook stores and retrieves look from SQLite", () => {
    const spec = {
      id: testLookId,
      name: "Bộ y phục lưu SQLite",
      garmentId: "ao_dai_hien_dai" as const,
      garmentName: "Áo dài hiện đại",
      collarId: "co_tru_co_dien",
      collarName: "Cổ trụ",
      sleeveId: "tay_raglan_dai",
      sleeveName: "Tay raglan",
      buttonId: "khoa_keo_sau_lung",
      buttonName: "Khóa kéo",
      pantsId: "quan_lua_ong_suong",
      pantsName: "Quần lụa",
      primaryColor: "#1B4931",
      secondaryColor: "#D4AF37",
      pantsColor: "#FFFDF7",
      fabricId: "lua_to_tam_trang",
      fabricName: "Lụa tơ tằm",
      accessories: [],
      remixStory: {
        keep: ["Tà áo dài"],
        remix: ["Khóa kéo giấu"],
        culturalMeaning: "Áo dài thế kỷ 20.",
        aestheticReasoning: "Thanh thoát.",
      },
      lockedFeatures: {},
      specHash: "hash_persist",
      revision: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLook(spec);
    const retrieved = getLook(testLookId);
    assert.ok(retrieved);
    assert.equal(retrieved.id, testLookId);
    assert.equal(retrieved.primaryColor, "#1B4931");
  });

  test("getLookRevisions tracks multiple revisions in SQLite", () => {
    const revs = getLookRevisions(testLookId);
    assert.ok(revs.length >= 1);
    assert.equal(revs[0].revision, 1);
  });

  test("saveWardrobeItem and deleteWardrobeItem operate correctly", () => {
    const wardrobeId = `wb_${Date.now()}`;
    saveWardrobeItem({
      id: wardrobeId,
      name: "Khăn đóng lụa gấm",
      type: "accessory",
      colorHex: "#D4AF37",
      createdAt: new Date().toISOString(),
    });

    const items = listWardrobe();
    assert.ok(items.some((i) => i.id === wardrobeId));

    deleteWardrobeItem(wardrobeId);
    const itemsAfterDelete = listWardrobe();
    assert.equal(itemsAfterDelete.some((i) => i.id === wardrobeId), false);
  });

  test("deleteLook removes look and revisions from SQLite", () => {
    deleteLook(testLookId);
    const retrieved = getLook(testLookId);
    assert.equal(retrieved, null);
  });
});
