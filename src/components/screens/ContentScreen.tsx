"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, ShieldCheck, FileText, CheckCircle2, AlertCircle, Compass, Sparkles } from "lucide-react";

export function ContentScreen() {
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"catalog" | "facts" | "sources" | "belief" | "credits">("facts");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch((err) => console.error(err));
  }, []);

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-parchment-400 text-xs">
        Đang tải kho tri thức văn hóa...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-xs">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-imperial-400" />
          <h2 className="text-xl font-serif font-black text-parchment-100">
            Kho Tri Thức & Rà Soát Sử Liệu Văn Hóa
          </h2>
        </div>
        <p className="text-parchment-400 mt-1">
          Hệ thống dữ liệu tĩnh phiên bản hóa (Versioned JSON) phục vụ tra cứu chính xác, minh bạch nguồn gốc và phân định giữa sử liệu với cách tân.
        </p>
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        {[
          { id: "facts", label: "Khảo Cứu Lịch Sử" },
          { id: "catalog", label: "Danh Mục Y Phục" },
          { id: "sources", label: "Nguồn Thư Tịch & Trích Dẫn" },
          { id: "belief", label: "Bảng Ngũ Hành Dân Gian" },
          { id: "credits", label: "Bản Quyền & Mức Mô Phỏng" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-lacquer-800 text-parchment-100 shadow border border-lacquer-600/40"
                : "bg-silkDark-900/60 text-parchment-400 hover:text-parchment-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Cultural Facts */}
      {activeTab === "facts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.culturalFacts?.facts?.map((fact: any) => (
            <div
              key={fact.id}
              className="bg-silkDark-850 border border-white/5 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-serif font-bold text-parchment-100 text-sm">
                  {fact.title}
                </h3>
                <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-600/60 text-emerald-300 rounded text-[10px] font-semibold shrink-0">
                  {fact.reviewStatus === "verified_academic" ? "Đã Khảo Cứu" : "Định Hướng Sáng Tạo"}
                </span>
              </div>
              <div className="text-[11px] text-imperial-400 font-semibold">
                Thời kỳ: {fact.period}
              </div>
              <p className="text-parchment-300 leading-relaxed text-xs">
                {fact.content}
              </p>
              <div className="pt-2 border-t border-white/5 text-[10px] text-parchment-400">
                Nguồn đối chiếu: {fact.sourceIds.join(", ")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Catalog */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.catalog?.garments?.map((garment: any) => (
              <div
                key={garment.id}
                className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 space-y-4"
              >
                <div>
                  <span className="text-[10px] text-imperial-400 font-bold uppercase tracking-wider">
                    {garment.historicalPeriod}
                  </span>
                  <h3 className="text-base font-serif font-bold text-parchment-100">
                    {garment.name}
                  </h3>
                </div>
                <p className="text-parchment-300 leading-relaxed text-xs">
                  {garment.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="font-semibold text-parchment-200">Không Gian Remix Sáng Tạo:</div>
                  <ul className="space-y-1 text-parchment-400">
                    {garment.remixPossibilities.map((r: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-imperial-400 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Sources */}
      {activeTab === "sources" && (
        <div className="space-y-3">
          {data.sources?.sources?.map((src: any) => (
            <div
              key={src.id}
              className="bg-silkDark-850 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="font-bold text-parchment-100 text-xs">
                  {src.title}
                </div>
                <div className="text-[11px] text-parchment-400">
                  Tác giả: <strong>{src.author}</strong> ({src.year}) • {src.publisher}
                </div>
                <p className="text-[11px] text-parchment-300 italic">
                  {src.notes}
                </p>
              </div>
              <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-parchment-300 shrink-0 self-start sm:self-center">
                {src.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Belief Palette */}
      {activeTab === "belief" && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-950/30 border border-amber-600/40 rounded-xl flex items-start gap-3 text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {data.beliefPalette?.disclaimer}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.beliefPalette?.elements?.map((el: any) => (
              <div
                key={el.element}
                className="bg-silkDark-850 border border-white/5 rounded-2xl p-4 space-y-3"
              >
                <div className="font-serif font-bold text-parchment-100 text-sm">
                  {el.name}
                </div>
                <p className="text-parchment-300 text-[11px] leading-relaxed">
                  {el.culturalMeaning}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <div className="font-semibold text-parchment-200 text-[11px]">Bảng Màu Tương Hợp:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {el.primaryColors.map((c: any) => (
                      <span
                        key={c.hex}
                        className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] flex items-center gap-1.5 bg-silkDark-900 text-parchment-200"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-parchment-400 italic bg-white/5 p-2 rounded-lg">
                  {el.neutralAlternativeNote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Asset Credits */}
      {activeTab === "credits" && (
        <div className="space-y-4">
          <div className="bg-silkDark-850 border border-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="font-serif font-bold text-parchment-100 text-sm">
              Quy Chuẩn Bản Quyền & Mức Độ Mô Phỏng 3D
            </h3>
            <p className="text-parchment-300 leading-relaxed">
              Dự án cam kết tính minh bạch học thuật tuyệt đối: Các mô hình 3D trong Sắc Việt Studio được kiến tạo bằng thuật toán hình học tham số (Procedural Parametric Geometry) bám sát tỷ lệ y phục thời Nguyễn, giữ vai trò trực quan hóa màu sắc và cấu tạo, không đưa ra cam kết sai lệch về rập cắt may công nghiệp.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-white/5">
              {data.assetCredits?.credits?.map((credit: any, idx: number) => (
                <div key={idx} className="bg-silkDark-900 p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="font-bold text-parchment-200">{credit.asset}</div>
                  <div className="text-[11px] text-parchment-400">
                    Bản quyền: <strong>{credit.author}</strong> ({credit.license})
                  </div>
                  {credit.simulationLevel && (
                    <div className="text-[10px] text-imperial-400">
                      Mức mô phỏng: {credit.simulationLevel}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
