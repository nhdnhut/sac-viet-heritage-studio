"use client";

import React, { useState } from "react";
import { OutfitSpec } from "@/types";
import { Lock, Unlock, Send, Undo2, Redo2, Palette, Sliders, Sparkles } from "lucide-react";
import catalogData from "@/data/catalog.json";

interface LookRefinePanelProps {
  spec: OutfitSpec;
  onApplyPatch: (patch: Partial<OutfitSpec>, instruction?: string) => Promise<void>;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  isLoading: boolean;
}

export function LookRefinePanel({
  spec,
  onApplyPatch,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isLoading,
}: LookRefinePanelProps) {
  const [chatPrompt, setChatPrompt] = useState("");
  const [activeTab, setActiveTab] = useState<"quick" | "chat" | "locks">("quick");

  const garmentMeta = catalogData.garments.find((g) => g.id === spec.garmentId) || catalogData.garments[0];

  const handleToggleLock = (feature: keyof OutfitSpec["lockedFeatures"]) => {
    const updated = {
      ...spec.lockedFeatures,
      [feature]: !spec.lockedFeatures[feature],
    };
    onApplyPatch({ lockedFeatures: updated });
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() || isLoading) return;

    const instruction = chatPrompt.trim();
    setChatPrompt("");

    // Parse simple commands or pass instruction for backend patch
    const lower = instruction.toLowerCase();
    const patch: Partial<OutfitSpec> = {};

    if (lower.includes("đỏ") || lower.includes("son")) {
      patch.primaryColor = "#9E2A2B";
    } else if (lower.includes("vàng") || lower.includes("hoàng kim")) {
      patch.primaryColor = "#D4AF37";
    } else if (lower.includes("xanh lục") || lower.includes("ngọc")) {
      patch.primaryColor = "#1B4931";
    } else if (lower.includes("chàm") || lower.includes("xanh dương")) {
      patch.primaryColor = "#1D3557";
    }

    if (lower.includes("khăn đóng") && !spec.accessories.includes("khan_dong_truyen_thong")) {
      patch.accessories = [...spec.accessories, "khan_dong_truyen_thong"];
    } else if (lower.includes("quạt") && !spec.accessories.includes("quat_giay_do_thu_phap")) {
      patch.accessories = [...spec.accessories, "quat_giay_do_thu_phap"];
    } else if (lower.includes("sneaker") && !spec.accessories.includes("sneaker_trang_remix")) {
      patch.accessories = [...spec.accessories, "sneaker_trang_remix"];
    }

    await onApplyPatch(patch, instruction);
  };

  return (
    <div className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 shadow-xl flex flex-col space-y-4">
      {/* Header with Undo / Redo */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-imperial-400" />
          <h3 className="font-serif font-bold text-parchment-100 text-sm">
            Tinh Chỉnh & Sửa Đổi Look
          </h3>
          <span className="text-xs text-parchment-300 font-mono bg-white/5 px-2 py-0.5 rounded">
            Rev {spec.revision}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo || isLoading}
            title="Hoàn tác (Undo)"
            className="p-1.5 rounded-lg bg-silkDark-800 hover:bg-silkDark-700 disabled:opacity-30 text-parchment-300 hover:text-white"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo || isLoading}
            title="Làm lại (Redo)"
            className="p-1.5 rounded-lg bg-silkDark-800 hover:bg-silkDark-700 disabled:opacity-30 text-parchment-300 hover:text-white"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/5 pb-2 text-xs">
        <button
          onClick={() => setActiveTab("quick")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "quick"
              ? "bg-lacquer-800 text-parchment-100 font-semibold"
              : "text-parchment-400 hover:text-parchment-200"
          }`}
        >
          Chọn Nhanh
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
            activeTab === "chat"
              ? "bg-lacquer-800 text-parchment-100 font-semibold"
              : "text-parchment-400 hover:text-parchment-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-imperial-400" />
          <span>Chat AI Tinh Chỉnh</span>
        </button>
        <button
          onClick={() => setActiveTab("locks")}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === "locks"
              ? "bg-lacquer-800 text-parchment-100 font-semibold"
              : "text-parchment-400 hover:text-parchment-200"
          }`}
        >
          Khóa Thuộc Tính ({Object.values(spec.lockedFeatures).filter(Boolean).length})
        </button>
      </div>

      {/* Tab 1: Quick Pickers */}
      {activeTab === "quick" && (
        <div className="space-y-3.5 text-xs">
          {/* Color Swatches */}
          <div>
            <span className="text-parchment-400 font-semibold block mb-1.5">
              Màu Thân Áo (Primary Color):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={spec.primaryColor}
                onChange={(e) => onApplyPatch({ primaryColor: e.target.value })}
                disabled={Boolean(spec.lockedFeatures.colors)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <div className="flex flex-wrap gap-1.5">
                {["#9E2A2B", "#800E13", "#1B4931", "#1D3557", "#D4AF37", "#131010"].map((hex) => (
                  <button
                    key={hex}
                    onClick={() => onApplyPatch({ primaryColor: hex })}
                    disabled={Boolean(spec.lockedFeatures.colors)}
                    className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-transform"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Collar Picker */}
          <div>
            <span className="text-parchment-400 font-semibold block mb-1">Kiểu Cổ Áo:</span>
            <select
              value={spec.collarId}
              disabled={Boolean(spec.lockedFeatures.collar)}
              onChange={(e) => {
                const found = garmentMeta.collarTypes.find((c) => c.id === e.target.value);
                if (found) {
                  onApplyPatch({ collarId: found.id, collarName: found.name });
                }
              }}
              className="w-full bg-silkDark-900 border border-white/10 rounded-lg p-2 text-parchment-200 text-xs focus:ring-1 focus:ring-imperial-500"
            >
              {garmentMeta.collarTypes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sleeve Picker */}
          <div>
            <span className="text-parchment-400 font-semibold block mb-1">Kiểu Ống Tay:</span>
            <select
              value={spec.sleeveId}
              disabled={Boolean(spec.lockedFeatures.sleeves)}
              onChange={(e) => {
                const found = garmentMeta.sleeveTypes.find((s) => s.id === e.target.value);
                if (found) {
                  onApplyPatch({ sleeveId: found.id, sleeveName: found.name });
                }
              }}
              className="w-full bg-silkDark-900 border border-white/10 rounded-lg p-2 text-parchment-200 text-xs focus:ring-1 focus:ring-imperial-500"
            >
              {garmentMeta.sleeveTypes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fabric Picker */}
          <div>
            <span className="text-parchment-400 font-semibold block mb-1">Chất Liệu Vải:</span>
            <select
              value={spec.fabricId}
              onChange={(e) => {
                const found = garmentMeta.fabrics.find((f) => f.id === e.target.value);
                if (found) {
                  onApplyPatch({ fabricId: found.id, fabricName: found.name });
                }
              }}
              className="w-full bg-silkDark-900 border border-white/10 rounded-lg p-2 text-parchment-200 text-xs focus:ring-1 focus:ring-imperial-500"
            >
              {garmentMeta.fabrics.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Tab 2: Natural Language Chat Refine */}
      {activeTab === "chat" && (
        <form onSubmit={handleSendChat} className="space-y-3">
          <p className="text-xs text-parchment-300 leading-relaxed">
            Nhập yêu cầu tinh chỉnh bằng tiếng Việt tự nhiên (ví dụ: <em>&ldquo;Đổi sang màu đỏ son&rdquo;</em>, <em>&ldquo;Thêm quạt giấy dó và khăn đóng&rdquo;</em>).
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              placeholder="Nhập yêu cầu sửa đổi..."
              disabled={isLoading}
              className="flex-1 bg-silkDark-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-1 focus:ring-imperial-500"
            />
            <button
              type="submit"
              disabled={!chatPrompt.trim() || isLoading}
              className="bg-imperial-600 hover:bg-imperial-500 disabled:opacity-40 text-silkDark-950 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 active:scale-95 transition-all shadow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Lock Features */}
      {activeTab === "locks" && (
        <div className="space-y-2 text-xs">
          <p className="text-xs text-parchment-300 mb-2">
            Khi thuộc tính bị khóa, các lệnh tinh chỉnh AI sẽ không được phép thay đổi phần này:
          </p>
          {[
            { key: "garment", label: "Khóa kiểu y phục chính (Áo ngũ thân / Áo dài)" },
            { key: "colors", label: "Khóa bảng màu (Thân áo, nẹp viền, quần)" },
            { key: "collar", label: "Khóa kiểu cổ áo" },
            { key: "sleeves", label: "Khóa kiểu ống tay" },
            { key: "accessories", label: "Khóa danh sách phụ kiện" },
          ].map(({ key, label }) => {
            const isLocked = Boolean(spec.lockedFeatures[key as keyof OutfitSpec["lockedFeatures"]]);
            return (
              <div
                key={key}
                onClick={() => handleToggleLock(key as any)}
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                  isLocked
                    ? "bg-amber-950/40 border-amber-600/50 text-amber-200"
                    : "bg-silkDark-900/60 border-white/5 text-parchment-300 hover:border-white/20"
                }`}
              >
                <span>{label}</span>
                {isLocked ? (
                  <Lock className="w-4 h-4 text-amber-400" />
                ) : (
                  <Unlock className="w-4 h-4 text-parchment-400" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
