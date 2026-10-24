import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getBeliefPalette } from "../src/lib/tools.js";
import beliefData from "../src/data/belief_palette.json";

describe("Belief Palette Guardrails Tests", () => {
  test("Belief mapping table specifies version, scope, reviewStatus and sources", () => {
    assert.equal(beliefData.version, "1.0.0");
    assert.equal(beliefData.scope, "personal_belief_symbolism_only");
    assert.equal(beliefData.reviewStatus, "reviewed_folklore_symbolism");
    assert.ok(beliefData.sourceIds.length > 0);
  });

  test("Belief disclaimer explicitly states neutrality and non-superstition", () => {
    const disclaimer = beliefData.disclaimer.toLowerCase();
    assert.ok(disclaimer.includes("không đại diện cho tính chuẩn xác lịch sử"));
    assert.ok(disclaimer.includes("không mang tính dự đoán"));
    assert.ok(disclaimer.includes("tự do"));
  });

  test("getBeliefPalette returns specific element with neutral alternatives", () => {
    const res = getBeliefPalette("hoa");
    assert.ok(res.element);
    assert.equal(res.element.name.includes("Hỏa"), true);
    assert.ok(res.element.neutralAlternativeNote);
  });

  test("getBeliefPalette returns clear error for unknown elements", () => {
    const res = getBeliefPalette("unknown_element");
    assert.ok(res.error);
    assert.ok(res.error.includes("Không tìm thấy hành"));
  });
});
