"use client";

import React, { useState, useEffect } from "react";
import { OutfitSpec } from "@/types";
import { Bookmark, Trash2, Edit3, ExternalLink, Download, Sparkles, Check } from "lucide-react";

interface LookbookScreenProps {
  onOpenInStudio: (spec: OutfitSpec) => void;
}

export function LookbookScreen({ onOpenInStudio }: LookbookScreenProps) {
  const [looks, setLooks] = useState<OutfitSpec[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    loadLooks();
  }, []);

  const loadLooks = async () => {
    try {
      const res = await fetch("/api/looks");
      const data = await res.json();
      if (data.looks) {
        setLooks(data.looks);
      }
    } catch (err) {
      console.error("Failed to load lookbook:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bộ trang phục này khỏi Lookbook?")) return;
    try {
      await fetch(`/api/looks/${id}`, { method: "DELETE" });
      setLooks(looks.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Failed to delete look:", err);
    }
  };

  const handleStartRename = (look: OutfitSpec) => {
    setEditingId(look.id);
    setRenameValue(look.name);
  };

  const handleSaveRename = async (look: OutfitSpec) => {
    if (!renameValue.trim()) return;
    try {
      const updated = { ...look, name: renameValue.trim() };
      await fetch("/api/looks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setEditingId(null);
      loadLooks();
    } catch (err) {
      console.error("Failed to rename look:", err);
    }
  };

  const handleExportJson = (look: OutfitSpec) => {
    const blob = new Blob([JSON.stringify(look, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${look.id}_outfit_spec.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-imperial-400" />
            <h2 className="text-xl font-serif font-black text-parchment-100">
              Lookbook Việt Phục Cá Nhân
            </h2>
          </div>
          <p className="text-xs text-parchment-400 mt-1">
            Bộ sưu tập các mẫu thiết kế của bạn được lưu trữ an toàn trong SQLite cục bộ ({looks.length} bộ)
          </p>
        </div>
      </div>

      {looks.length === 0 ? (
        <div className="p-12 text-center bg-silkDark-900 border border-white/5 rounded-2xl space-y-3">
          <Sparkles className="w-10 h-10 text-imperial-400 mx-auto" />
          <h4 className="text-base font-serif font-bold text-parchment-100">
            Chưa có bộ trang phục nào trong Lookbook
          </h4>
          <p className="text-xs text-parchment-400 max-w-sm mx-auto">
            Hãy bắt đầu tạo phương án phối đồ tại màn hình Studio và nhấn &ldquo;Lưu Lookbook&rdquo; để lưu giữ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {looks.map((look) => (
            <div
              key={look.id}
              className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-imperial-500/40 transition-all"
            >
              <div className="space-y-3">
                {/* Title & Rename */}
                {editingId === look.id ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="flex-1 bg-silkDark-900 border border-imperial-500 rounded-lg px-2.5 py-1 text-xs text-parchment-100 focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(look)}
                      className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif font-bold text-parchment-100 text-sm">
                        {look.name}
                      </h3>
                      <span className="text-[10px] text-imperial-400 font-semibold uppercase tracking-wider">
                        {look.garmentName}
                      </span>
                    </div>
                    <button
                      onClick={() => handleStartRename(look)}
                      title="Đổi tên"
                      className="p-1 hover:bg-white/5 rounded text-parchment-400 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Color swatches preview */}
                <div className="flex items-center gap-2 text-xs text-parchment-300">
                  <span className="text-[11px] text-parchment-400">Phối màu:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: look.primaryColor }}
                      title={`Thân áo: ${look.primaryColor}`}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: look.secondaryColor }}
                      title={`Viền nẹp: ${look.secondaryColor}`}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: look.pantsColor }}
                      title={`Quần: ${look.pantsColor}`}
                    />
                  </div>
                </div>

                {/* Summary points */}
                <div className="bg-silkDark-900/60 p-3 rounded-xl border border-white/5 text-[11px] space-y-1 text-parchment-300">
                  <div>
                    <strong className="text-lacquer-400">Giữ:</strong>{" "}
                    {look.remixStory.keep.slice(0, 2).join(", ")}
                  </div>
                  <div>
                    <strong className="text-imperial-400">Remix:</strong>{" "}
                    {look.remixStory.remix.slice(0, 2).join(", ")}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <button
                  onClick={() => onOpenInStudio(look)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-lacquer-800 hover:bg-lacquer-700 text-parchment-100 rounded-lg text-xs font-semibold transition-all active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Mở Trong Studio</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleExportJson(look)}
                    title="Xuất file JSON đặc tả"
                    className="p-1.5 bg-silkDark-800 hover:bg-silkDark-700 text-parchment-300 hover:text-white rounded-lg"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(look.id)}
                    title="Xóa khỏi Lookbook"
                    className="p-1.5 bg-silkDark-800 hover:bg-red-950 text-parchment-400 hover:text-red-400 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
