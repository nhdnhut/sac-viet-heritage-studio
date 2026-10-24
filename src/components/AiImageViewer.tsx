"use client";

import React, { useState } from "react";
import { OutfitSpec, RenderJob } from "@/types";
import { Sparkles, CheckCircle2, AlertTriangle, Download, RefreshCw, Eye, ShieldAlert } from "lucide-react";

interface AiImageViewerProps {
  spec: OutfitSpec;
  currentJob: RenderJob | null;
  onTriggerRender: () => void;
  isLoading: boolean;
  hasApiKey: boolean;
}

export function AiImageViewer({
  spec,
  currentJob,
  onTriggerRender,
  isLoading,
  hasApiKey,
}: AiImageViewerProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  return (
    <div className="w-full bg-silkDark-900 border border-lacquer-800/40 rounded-2xl p-6 flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-imperial-400 font-semibold">
            Ảnh Thực Tế AI (Google GenAI Multimodal)
          </span>
          <h3 className="text-lg font-serif font-bold text-parchment-100">{spec.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPrompt(!showPrompt)}
            className="text-xs px-3 py-1.5 bg-silkDark-800 hover:bg-silkDark-700 text-parchment-200 rounded-lg border border-white/10 flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showPrompt ? "Ẩn Prompt" : "Xem Prompt"}</span>
          </button>

          <button
            onClick={onTriggerRender}
            disabled={isLoading || !hasApiKey}
            className="text-xs px-4 py-1.5 bg-imperial-600 hover:bg-imperial-500 disabled:opacity-40 disabled:pointer-events-none text-silkDark-950 font-bold rounded-lg shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{isLoading ? "Đang tạo ảnh..." : currentJob?.imageUrl ? "Tạo Lại Ảnh" : "Tạo Ảnh Ngay"}</span>
          </button>
        </div>
      </div>

      {/* API Key Missing Notice */}
      {!hasApiKey && (
        <div className="w-full mb-4 p-3.5 bg-amber-950/40 border border-amber-600/40 rounded-xl flex items-start gap-3 text-amber-200 text-xs">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-amber-300">Chưa cấu hình Gemini API Key</span>
            Để tạo ảnh chất lượng cao bằng Gemini Image Model và chạy Vision QA đối chiếu chi tiết, vui lòng nhập API key ở mục <strong>Cài Đặt</strong> (Settings). Key chỉ lưu trong bộ nhớ phiên làm việc trên server, an toàn tuyệt đối.
          </div>
        </div>
      )}

      {/* Prompt preview drawer */}
      {showPrompt && (
        <div className="w-full mb-4 p-3.5 bg-silkDark-950 rounded-xl border border-white/10 text-xs text-parchment-300 font-mono">
          <div className="font-semibold text-imperial-400 mb-1">Prompt biên dịch tự động từ OutfitSpec:</div>
          <p className="whitespace-pre-wrap leading-relaxed">
            {`Cinematic high-fashion editorial portrait of a young Vietnamese student wearing an authentic Vietnamese costume:
Garment: ${spec.garmentName} (${spec.garmentId})
Colors: Primary ${spec.primaryColor}, Accent ${spec.secondaryColor}, Pants ${spec.pantsColor}
Fabric: ${spec.fabricName}
Accessories: ${spec.accessories.join(", ") || "Minimalist"}
Collar: ${spec.collarName}, Sleeves: ${spec.sleeveName}`}
          </p>
        </div>
      )}

      {/* Main Image Display Area */}
      <div className="relative w-full max-w-md min-h-[420px] bg-silkDark-950 rounded-xl overflow-hidden border border-white/5 flex flex-col items-center justify-center p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center text-center p-8 space-y-3">
            <div className="w-12 h-12 border-3 border-imperial-500 border-t-transparent rounded-full animate-spin" />
            <h4 className="text-base font-serif font-bold text-parchment-100">
              Đang biên dịch và tạo ảnh...
            </h4>
            <p className="text-xs text-parchment-400 max-w-xs">
              Gemini Image Model đang xử lý ánh sáng và nếp gấp lụa. Quá trình kiểm tra Vision QA sẽ tự động chạy ngay sau đó.
            </p>
          </div>
        ) : currentJob?.imageUrl ? (
          <div className="w-full flex flex-col items-center">
            {/* Rendered Image */}
            <div className="relative group w-full aspect-[3/4] max-h-[460px] rounded-lg overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={currentJob.imageUrl}
                alt={spec.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <a
                  href={currentJob.imageUrl}
                  download={`${spec.id}_render.jpg`}
                  className="px-3.5 py-2 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải ảnh gốc</span>
                </a>
              </div>
            </div>

            {/* Outdated spec badge if revision changed */}
            {currentJob.revision < spec.revision && (
              <div className="mt-2 text-xs text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-600/40">
                Lưu ý: Ảnh này được tạo ở phiên bản {currentJob.revision}, cấu hình hiện tại là {spec.revision}. Bạn có thể nhấn &ldquo;Tạo Lại Ảnh&rdquo; để cập nhật.
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-8 space-y-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-lacquer-900/40 border border-lacquer-700/60 flex items-center justify-center text-imperial-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base font-serif font-bold text-parchment-100">
              Chưa có ảnh kết xuất cho phiên bản này
            </h4>
            <p className="text-xs text-parchment-400 max-w-sm">
              Nhấn nút <strong>&ldquo;Tạo Ảnh Ngay&rdquo;</strong> phía trên để gửi yêu cầu tới Google GenAI SDK.
            </p>
          </div>
        )}
      </div>

      {/* Vision QA Report Card */}
      {currentJob?.qaReport && (
        <div className="w-full max-w-md mt-4 p-3.5 bg-silkDark-950/90 border border-lacquer-800/60 rounded-xl text-xs space-y-2">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-parchment-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Kết Quả Đối Soát Vision QA (Gemini Multimodal)
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded border border-emerald-700">
              ĐÃ XÁC THỰC
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="flex items-center gap-1.5 text-parchment-300">
              <span className={currentJob.qaReport.garmentMatch ? "text-emerald-400" : "text-amber-400"}>
                {currentJob.qaReport.garmentMatch ? "✓" : "✗"}
              </span>
              <span>Phom áo: {currentJob.qaReport.garmentMatch ? "Chuẩn" : "Cần rà soát"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-parchment-300">
              <span className={currentJob.qaReport.colorMatch ? "text-emerald-400" : "text-amber-400"}>
                {currentJob.qaReport.colorMatch ? "✓" : "✗"}
              </span>
              <span>Tông màu: {currentJob.qaReport.colorMatch ? "Chuẩn" : "Lệch nhẹ"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-parchment-300">
              <span className={currentJob.qaReport.collarMatch ? "text-emerald-400" : "text-amber-400"}>
                {currentJob.qaReport.collarMatch ? "✓" : "✗"}
              </span>
              <span>Cổ áo: {currentJob.qaReport.collarMatch ? "Chuẩn" : "Cần rà soát"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-parchment-300">
              <span className={currentJob.qaReport.sleeveMatch ? "text-emerald-400" : "text-amber-400"}>
                {currentJob.qaReport.sleeveMatch ? "✓" : "✗"}
              </span>
              <span>Tay áo: {currentJob.qaReport.sleeveMatch ? "Chuẩn" : "Cần rà soát"}</span>
            </div>
          </div>

          {currentJob.qaReport.notes && (
            <p className="text-[11px] text-parchment-400 border-t border-white/5 pt-1.5 italic">
              &ldquo;{currentJob.qaReport.notes}&rdquo;
            </p>
          )}
        </div>
      )}
    </div>
  );
}
