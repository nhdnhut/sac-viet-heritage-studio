"use client";

import React, { useState, useEffect } from "react";
import { OutfitSpec } from "@/types";
import { Mockup2D } from "@/components/Mockup2D";
import { Compass, ArrowRightLeft, Sparkles, Check, AlertCircle } from "lucide-react";

interface CompareScreenProps {
  onSelectForStudio: (spec: OutfitSpec) => void;
}

export function CompareScreen({ onSelectForStudio }: CompareScreenProps) {
  const [looks, setLooks] = useState<OutfitSpec[]>([]);
  const [selectedIdA, setSelectedIdA] = useState<string>("");
  const [selectedIdB, setSelectedIdB] = useState<string>("");

  useEffect(() => {
    fetchLooks();
  }, []);

  const fetchLooks = async () => {
    try {
      const res = await fetch("/api/looks");
      const data = await res.json();
      if (data.looks && data.looks.length > 0) {
        setLooks(data.looks);
        setSelectedIdA(data.looks[0].id);
        if (data.looks.length > 1) {
          setSelectedIdB(data.looks[1].id);
        } else {
          setSelectedIdB(data.looks[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch looks:", err);
    }
  };

  const lookA = looks.find((l) => l.id === selectedIdA) || null;
  const lookB = looks.find((l) => l.id === selectedIdB) || null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-imperial-400" />
            <h2 className="text-xl font-serif font-black text-parchment-100">
              So Sánh Trực Quan (Compare Looks)
            </h2>
          </div>
          <p className="text-xs text-parchment-400 mt-1">
            Đặt 2 bộ trang phục cạnh nhau dưới cùng một bối cảnh để đối chiếu đường nét, phối màu và tính cách tân
          </p>
        </div>
      </div>

      {looks.length < 2 ? (
        <div className="p-12 text-center bg-silkDark-900 border border-white/5 rounded-2xl space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
          <h4 className="text-base font-serif font-bold text-parchment-100">
            Cần ít nhất 2 bộ trang phục để so sánh
          </h4>
          <p className="text-xs text-parchment-400 max-w-sm mx-auto">
            Hãy quay lại màn hình Studio để tạo thêm phương án phối đồ hoặc lưu các bộ phối vào Lookbook.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-silkDark-850 p-4 rounded-xl border border-white/10 space-y-2">
              <label className="text-xs font-semibold text-parchment-300 block">
                Chọn Bộ Trang Phục 1:
              </label>
              <select
                value={selectedIdA}
                onChange={(e) => setSelectedIdA(e.target.value)}
                className="w-full bg-silkDark-900 border border-white/10 rounded-lg p-2.5 text-xs text-parchment-100 focus:ring-1 focus:ring-imperial-500"
              >
                {looks.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.garmentName})
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-silkDark-850 p-4 rounded-xl border border-white/10 space-y-2">
              <label className="text-xs font-semibold text-parchment-300 block">
                Chọn Bộ Trang Phục 2:
              </label>
              <select
                value={selectedIdB}
                onChange={(e) => setSelectedIdB(e.target.value)}
                className="w-full bg-silkDark-900 border border-white/10 rounded-lg p-2.5 text-xs text-parchment-100 focus:ring-1 focus:ring-imperial-500"
              >
                {looks.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.garmentName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-Side View */}
          {lookA && lookB && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card A */}
              <div className="space-y-4">
                <Mockup2D spec={lookA} />
                <div className="bg-silkDark-850 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                  <div className="font-bold text-parchment-100">{lookA.name}</div>
                  <div className="text-parchment-300">
                    <strong>Giữ gì:</strong> {lookA.remixStory.keep.join(", ")}
                  </div>
                  <div className="text-imperial-300">
                    <strong>Remix gì:</strong> {lookA.remixStory.remix.join(", ")}
                  </div>
                  <button
                    onClick={() => onSelectForStudio(lookA)}
                    className="w-full mt-2 py-2 bg-lacquer-800 hover:bg-lacquer-700 text-parchment-100 rounded-lg text-xs font-semibold"
                  >
                    Mở Bộ Này Trên Studio
                  </button>
                </div>
              </div>

              {/* Card B */}
              <div className="space-y-4">
                <Mockup2D spec={lookB} />
                <div className="bg-silkDark-850 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
                  <div className="font-bold text-parchment-100">{lookB.name}</div>
                  <div className="text-parchment-300">
                    <strong>Giữ gì:</strong> {lookB.remixStory.keep.join(", ")}
                  </div>
                  <div className="text-imperial-300">
                    <strong>Remix gì:</strong> {lookB.remixStory.remix.join(", ")}
                  </div>
                  <button
                    onClick={() => onSelectForStudio(lookB)}
                    className="w-full mt-2 py-2 bg-lacquer-800 hover:bg-lacquer-700 text-parchment-100 rounded-lg text-xs font-semibold"
                  >
                    Mở Bộ Này Trên Studio
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
