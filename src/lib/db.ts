import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { OutfitSpec, WardrobeItem, RenderJob } from "@/types";

const DB_DIR = path.resolve(process.cwd(), "data");
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, "sac_viet.db");

// Singleton database instance
let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (!dbInstance) {
    dbInstance = new DatabaseSync(DB_PATH);
    initTables(dbInstance);
  }
  return dbInstance;
}

function initTables(db: DatabaseSync) {
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS looks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      garment_id TEXT NOT NULL,
      revision INTEGER NOT NULL DEFAULT 1,
      spec_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS look_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      look_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      spec_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(look_id, revision)
    );

    CREATE TABLE IF NOT EXISTS wardrobe_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      color_hex TEXT,
      fabric TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS render_jobs (
      id TEXT PRIMARY KEY,
      look_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      spec_hash TEXT NOT NULL,
      status TEXT NOT NULL,
      image_url TEXT,
      asset_id TEXT,
      qa_report_json TEXT,
      error_message TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      look_id TEXT NOT NULL,
      revision INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      data_base64 TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
}

// Looks Operations
export function saveLook(spec: OutfitSpec): void {
  const db = getDb();
  const specJson = JSON.stringify(spec);
  const now = new Date().toISOString();

  const existing = db.prepare("SELECT revision FROM looks WHERE id = ?").get(spec.id) as { revision: number } | undefined;

  if (existing) {
    db.prepare(`
      UPDATE looks 
      SET name = ?, garment_id = ?, revision = ?, spec_json = ?, updated_at = ?
      WHERE id = ?
    `).run(spec.name, spec.garmentId, spec.revision, specJson, now, spec.id);
  } else {
    db.prepare(`
      INSERT INTO looks (id, name, garment_id, revision, spec_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(spec.id, spec.name, spec.garmentId, spec.revision, specJson, spec.createdAt || now, now);
  }

  // Record revision history
  try {
    db.prepare(`
      INSERT OR REPLACE INTO look_revisions (look_id, revision, spec_json, created_at)
      VALUES (?, ?, ?, ?)
    `).run(spec.id, spec.revision, specJson, now);
  } catch (err) {
    console.error("Error saving revision:", err);
  }
}

export function getLook(id: string): OutfitSpec | null {
  const db = getDb();
  const row = db.prepare("SELECT spec_json FROM looks WHERE id = ?").get(id) as { spec_json: string } | undefined;
  if (!row) return null;
  return JSON.parse(row.spec_json) as OutfitSpec;
}

export function listLooks(): OutfitSpec[] {
  const db = getDb();
  const rows = db.prepare("SELECT spec_json FROM looks ORDER BY updated_at DESC").all() as { spec_json: string }[];
  return rows.map((r) => JSON.parse(r.spec_json) as OutfitSpec);
}

export function deleteLook(id: string): boolean {
  const db = getDb();
  db.prepare("DELETE FROM look_revisions WHERE look_id = ?").run(id);
  db.prepare("DELETE FROM looks WHERE id = ?").run(id);
  return true;
}

export function getLookRevisions(lookId: string): { revision: number; spec: OutfitSpec; createdAt: string }[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT revision, spec_json, created_at 
    FROM look_revisions 
    WHERE look_id = ? 
    ORDER BY revision ASC
  `).all(lookId) as { revision: number; spec_json: string; created_at: string }[];

  return rows.map((r) => ({
    revision: r.revision,
    spec: JSON.parse(r.spec_json) as OutfitSpec,
    createdAt: r.created_at,
  }));
}

// Wardrobe Operations
export function saveWardrobeItem(item: WardrobeItem): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO wardrobe_items (id, name, type, color_hex, fabric, notes, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(item.id, item.name, item.type, item.colorHex || null, item.fabric || null, item.notes || null, item.createdAt);
}

export function listWardrobe(): WardrobeItem[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM wardrobe_items ORDER BY created_at DESC").all() as Array<{
    id: string;
    name: string;
    type: "garment" | "accessory" | "footwear" | "pants";
    color_hex: string | null;
    fabric: string | null;
    notes: string | null;
    created_at: string;
  }>;

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    colorHex: r.color_hex || undefined,
    fabric: r.fabric || undefined,
    notes: r.notes || undefined,
    createdAt: r.created_at,
  }));
}

export function deleteWardrobeItem(id: string): boolean {
  const db = getDb();
  db.prepare("DELETE FROM wardrobe_items WHERE id = ?").run(id);
  return true;
}

// Jobs Operations
export function saveJob(job: RenderJob): void {
  const db = getDb();
  const qaJson = job.qaReport ? JSON.stringify(job.qaReport) : null;
  db.prepare(`
    INSERT OR REPLACE INTO render_jobs 
    (id, look_id, revision, spec_hash, status, image_url, asset_id, qa_report_json, error_message, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    job.id,
    job.lookId,
    job.revision,
    job.specHash,
    job.status,
    job.imageUrl || null,
    job.assetId || null,
    qaJson,
    job.errorMessage || null,
    job.createdAt,
    job.updatedAt
  );
}

export function getJob(id: string): RenderJob | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM render_jobs WHERE id = ?").get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    lookId: row.look_id,
    revision: row.revision,
    specHash: row.spec_hash,
    status: row.status,
    imageUrl: row.image_url || undefined,
    assetId: row.asset_id || undefined,
    qaReport: row.qa_report_json ? JSON.parse(row.qa_report_json) : undefined,
    errorMessage: row.error_message || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// Asset Operations
export function saveAsset(asset: {
  id: string;
  lookId: string;
  revision: number;
  mimeType: string;
  dataBase64: string;
  createdAt: string;
}): void {
  const db = getDb();
  db.prepare(`
    INSERT OR REPLACE INTO assets (id, look_id, revision, mime_type, data_base64, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(asset.id, asset.lookId, asset.revision, asset.mimeType, asset.dataBase64, asset.createdAt);
}

export function getAsset(id: string): {
  id: string;
  lookId: string;
  revision: number;
  mimeType: string;
  dataBase64: string;
  createdAt: string;
} | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM assets WHERE id = ?").get(id) as any;
  if (!row) return null;
  return {
    id: row.id,
    lookId: row.look_id,
    revision: row.revision,
    mimeType: row.mime_type,
    dataBase64: row.data_base64,
    createdAt: row.created_at,
  };
}

// Clear all local data
export function clearAllData(): void {
  const db = getDb();
  db.exec(`
    DELETE FROM looks;
    DELETE FROM look_revisions;
    DELETE FROM wardrobe_items;
    DELETE FROM render_jobs;
    DELETE FROM assets;
  `);
}
