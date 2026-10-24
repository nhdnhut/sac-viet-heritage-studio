"use client";

import React from "react";
import { OutfitSpec } from "@/types";
import { X, Printer, Download, Sparkles, BookOpen, ShieldAlert } from "lucide-react";

interface DesignBriefModalProps {
  spec: OutfitSpec;
  onClose: () => void;
}

export function DesignBriefModal({ spec, onClose }: DesignBriefModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const briefData = {
      title: `Bản Mô Tả Thiết Kế: ${spec.name}`,
      lookId: spec.id,
      revision: spec.revision,
      specHash: spec.specHash,
      garment: {
        id: spec.garmentId,
        name: spec.garmentName,
        collar: spec.collarName,
        sleeves: spec.sleeveName,
        buttons: spec.buttonName,
        pants: spec.pantsName,
        fabric: spec.fabricName,
      },
      colorPalette: {
        primary: spec.primaryColor,
        secondary: spec.secondaryColor,
        pants: spec.pantsColor,
      },
      accessories: spec.accessories,
      remixStory: spec.remixStory,
      disclaimers: [
        "Màu sắc thực tế trên vải có thể chênh lệch nhẹ theo chất liệu nhuộm (tơ tằm, đũi, gấm).",
        "Số đo và đường cắt rập cụ thể cần thợ may thực hiện trực tiếp theo vóc dáng người mặc.",
        "Mẫu tham số 3D và hình ảnh mang tính định hướng tạo hình thẩm mỹ.",
      ],
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(briefData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${spec.id}_design_brief.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-silkDark-900 border border-lacquer-800/80 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-xs my-8">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-imperial-400" />
            <h2 className="font-serif font-black text-lg text-parchment-100">
              Bản Mô Tả Thiết Kế (Design Brief)
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-silkDark-800 hover:bg-silkDark-700 text-parchment-200 rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Bản Vẽ / PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-bold rounded-lg flex items-center gap-1.5 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-lg text-parchment-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-brief" className="space-y-5 text-parchment-200">
          {/* Identity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-silkDark-950 p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-[10px] text-imperial-400 font-bold uppercase tracking-wider">
                SẮC VIỆT STUDIO • VIỆT PHỤC REMIX
              </span>
              <h1 className="text-xl font-serif font-black text-parchment-100 mt-0.5">
                {spec.name}
              </h1>
              <p className="text-[11px] text-parchment-400">
                Phân loại: {spec.garmentName} • Phiên bản {spec.revision}
              </p>
            </div>
            <div className="text-right text-[11px] font-mono text-parchment-400">
              <div>Hash: {spec.specHash.slice(0, 10)}</div>
              <div>Ngày xuất: {new Date().toLocaleDateString("vi-VN")}</div>
            </div>
          </div>

          {/* Color & Material Spec */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-silkDark-950 p-3.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-parchment-400 uppercase">Thân Áo Chính</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-lg border border-white/20 shadow"
                  style={{ backgroundColor: spec.primaryColor }}
                />
                <span className="font-mono font-bold text-parchment-100">{spec.primaryColor}</span>
              </div>
              <div className="text-[11px] text-parchment-400">Vải: {spec.fabricName}</div>
            </div>

            <div className="bg-silkDark-950 p-3.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-parchment-400 uppercase">Viền Nẹp & Cổ</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-lg border border-white/20 shadow"
                  style={{ backgroundColor: spec.secondaryColor }}
                />
                <span className="font-mono font-bold text-parchment-100">{spec.secondaryColor}</span>
              </div>
              <div className="text-[11px] text-parchment-400">Kiểu cổ: {spec.collarName}</div>
            </div>

            <div className="bg-silkDark-950 p-3.5 rounded-xl border border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-parchment-400 uppercase">Quần Y Phục</span>
              <div className="flex items-center gap-2">
                <span
                  className="w-6 h-6 rounded-lg border border-white/20 shadow"
                  style={{ backgroundColor: spec.pantsColor }}
                />
                <span className="font-mono font-bold text-parchment-100">{spec.pantsColor}</span>
              </div>
              <div className="text-[11px] text-parchment-400">Kiểu dáng: {spec.pantsName}</div>
            </div>
          </div>

          {/* Garment Construction Details */}
          <div className="bg-silkDark-950 p-4 rounded-xl border border-white/5 space-y-2">
            <h3 className="font-serif font-bold text-sm text-parchment-100">
              Chi Tiết Cấu Trúc May Mặc
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-parchment-400 block">Kiểu ống tay:</span>
                <span className="font-medium text-parchment-100">{spec.sleeveName}</span>
              </div>
              <div>
                <span className="text-parchment-400 block">Quy cách khuy:</span>
                <span className="font-medium text-parchment-100">{spec.buttonName}</span>
              </div>
              <div>
                <span className="text-parchment-400 block">Chất liệu dự kiến:</span>
                <span className="font-medium text-parchment-100">{spec.fabricName}</span>
              </div>
              <div>
                <span className="text-parchment-400 block">Phụ kiện đi kèm:</span>
                <span className="font-medium text-parchment-100">
                  {spec.accessories.join(", ") || "Tối giản"}
                </span>
              </div>
            </div>
          </div>

          {/* Giữ Gì — Remix Gì */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-silkDark-950 p-4 rounded-xl border border-lacquer-800/40 space-y-2">
              <span className="text-[11px] font-bold text-lacquer-400 uppercase">
                Yếu Tố Cổ Truyền Được Bảo Tồn
              </span>
              <ul className="space-y-1 text-parchment-300 text-[11px]">
                {spec.remixStory.keep.map((k, i) => (
                  <li key={i}>• {k}</li>
                ))}
              </ul>
            </div>

            <div className="bg-silkDark-950 p-4 rounded-xl border border-indigoStone-700/40 space-y-2">
              <span className="text-[11px] font-bold text-imperial-400 uppercase">
                Điểm Nhấn Sáng Tạo Remix
              </span>
              <ul className="space-y-1 text-parchment-300 text-[11px]">
                {spec.remixStory.remix.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Tailoring Disclaimer Notice */}
          <div className="p-3.5 bg-silkDark-950/90 border border-amber-600/30 rounded-xl space-y-1 text-[11px] text-amber-200/90">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Lưu Ý Cần Bổ Sung Cho Xưởng May:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-parchment-300">
              <li>Bản thiết kế này phục vụ mục đích định hướng mỹ thuật, tạo hình và phối màu tổng thể.</li>
              <li>Chưa bao gồm số đo cơ thể cá nhân, độ co giãn thực tế của sớ vải và sơ đồ giác rập chi tiết.</li>
              <li>Người mặc cần phối hợp cùng nghệ nhân/thợ may để lấy số đo thực tế trước khi cắt vải.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
