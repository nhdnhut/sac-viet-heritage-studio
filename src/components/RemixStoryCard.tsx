"use client";

import React from "react";
import { RemixStory } from "@/types";
import { ShieldCheck, Sparkles, BookOpen, Compass } from "lucide-react";

interface RemixStoryCardProps {
  story: RemixStory;
  garmentName: string;
}

export function RemixStoryCard({ story, garmentName }: RemixStoryCardProps) {
  return (
    <div className="bg-silkDark-850 border border-lacquer-700/50 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Sparkles className="w-5 h-5 text-imperial-400" />
        <h3 className="font-serif font-bold text-parchment-100 text-base">
          Cấu Trúc Sáng Tạo: Giữ Gì — Remix Gì?
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Giữ Gì (Traditional Roots Preserved) */}
        <div className="bg-lacquer-950/60 border border-lacquer-800/60 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lacquer-400">
            <ShieldCheck className="w-4 h-4 text-lacquer-400" />
            <span>Giữ gì từ quy thức cổ truyền</span>
          </div>
          <ul className="space-y-1.5 text-xs text-parchment-200">
            {story.keep.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-lacquer-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Remix Gì (Contemporary Innovation) */}
        <div className="bg-indigoStone-900/40 border border-indigoStone-700/50 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-imperial-400">
            <Sparkles className="w-4 h-4 text-imperial-400" />
            <span>Remix gì cho phong cách trẻ</span>
          </div>
          <ul className="space-y-1.5 text-xs text-parchment-200">
            {story.remix.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-imperial-400 font-bold shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cultural Meaning & Aesthetic Reasoning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5 text-xs">
        <div className="space-y-1 bg-silkDark-900/60 p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-1.5 font-semibold text-parchment-300">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ý Nghĩa Văn Hóa & Lịch Sử:</span>
          </div>
          <p className="text-parchment-300 leading-relaxed italic">
            &ldquo;{story.culturalMeaning}&rdquo;
          </p>
        </div>

        <div className="space-y-1 bg-silkDark-900/60 p-3 rounded-lg border border-white/5">
          <div className="flex items-center gap-1.5 font-semibold text-parchment-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Lý Giải Phối Sắc & Thẩm Mỹ:</span>
          </div>
          <p className="text-parchment-300 leading-relaxed italic">
            &ldquo;{story.aestheticReasoning}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
