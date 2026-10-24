import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getDb } from "../src/lib/db.js";
import { createSession, getSession, hasActiveKey } from "../src/lib/session.js";

describe("Security & Secrets Isolation Tests", () => {
  test("Session memory does not leak raw API key via hasActiveKey()", () => {
    const sessionId = createSession();
    const status = hasActiveKey(sessionId);

    // Ensure hasActiveKey only returns boolean flags and source enum, never string key
    assert.equal(typeof status.hasEnvKey, "boolean");
    assert.equal(typeof status.hasSessionKey, "boolean");
    assert.ok(["env", "session", "none"].includes(status.activeKeySource));
    assert.equal((status as any).apiKey, undefined);
  });

  test("SQLite database contains ZERO secret or key columns", () => {
    const db = getDb();
    const tables = ["looks", "look_revisions", "wardrobe_items", "render_jobs", "assets"];

    for (const table of tables) {
      const columns = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
      const columnNames = columns.map((c) => c.name.toLowerCase());

      assert.equal(columnNames.includes("api_key"), false);
      assert.equal(columnNames.includes("secret"), false);
      assert.equal(columnNames.includes("token"), false);
      assert.equal(columnNames.includes("password"), false);
    }
  });
});
