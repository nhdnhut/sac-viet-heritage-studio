"use client";

import React, { useState } from "react";
import { BriefInput, BeliefElement } from "@/types";
import { Sparkles, Calendar, Shirt, Palette, ShieldAlert, SlidersHorizontal, Info } from "lucide-react";
import catalogData from "@/data/catalog.json";
import beliefPaletteData from "@/data/belief_palette.json";

interface BriefInputFormProps {
  onSubmit: (brief: BriefInput) => void;
  isLoading: boolean;
}

export function BriefInputForm({ onSubmit, isLoading }: BriefInputFormProps) {
  const [occasion, setOccasion] = useState("tet_nguyen_dan");
  const [customOccasion, setCustomOccasion] = useState("");
  const [garmentPreference, setGarmentPreference] = useState<"ao_ngu_than_tay_chen" | "ao_dai_hien_dai" | "any">("any");
  const [styleVibe, setStyleVibe] = useState("Thanh lịch, trang trọng và tươi tắn");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [enableBelief, setEnableBelief] = useState(false);
  const [beliefElement, setBeliefElement] = useState<BeliefElement>("hoa");

  const presetColors = [
    { name: "Đỏ son", hex: "#9E2A2B" },
    { name: "Đỏ thẫm", hex: "#800E13" },
    { name: "Xanh ngọc", hex: "#1B4931" },
    { name: "Xanh chàm", hex: "#1D3557" },
    { name: "Vàng hoàng kim", hex: "#D4AF37" },
    { name: "Trắng ngà", hex: "#FFFDF7" },
    { name: "Đen tuyền", hex: "#131010" },
  ];

  const handleToggleColor = (hex: string) => {
    if (selectedColors.includes(hex)) {
      setSelectedColors(selectedColors.filter((c) => c !== hex));
    } else {
      if (selectedColors.length < 3) {
        setSelectedColors([...selectedColors, hex]);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const effectiveOccasion = occasion === "custom" ? customOccasion.trim() || "Sự kiện đặc biệt" : occasion;

    onSubmit({
      occasion: effectiveOccasion,
      garmentPreference,
      styleVibe,
      customPrompt: customPrompt.trim() || undefined,
      selectedColors: selectedColors.length > 0 ? selectedColors : undefined,
      beliefElement: enableBelief ? beliefElement : null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 shadow-xl space-y-4 text-xs"
    >
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Sparkles className="w-5 h-5 text-imperial-400" />
        <div>
          <h3 className="font-serif font-bold text-parchment-100 text-sm">
            Tạo Brief Phối Đồ Mới
          </h3>
          <p className="text-[11px] text-parchment-400">
            Kết hợp chọn sẵn hoặc viết mô tả tự do theo ý bạn
          </p>
        </div>
      </div>

      {/* 1. Bối cảnh (Occasion) */}
      <div className="space-y-1.5">
        <label className="font-semibold text-parchment-300 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-imperial-400" />
          <span>Dịp diện y phục (Bối cảnh):</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {catalogData.occasions.map((occ) => (
            <button
              type="button"
              key={occ.id}
              onClick={() => setOccasion(occ.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                occasion === occ.id
                  ? "bg-lacquer-900/80 border-lacquer-600 text-parchment-100 font-semibold"
                  : "bg-silkDark-900/60 border-white/5 text-parchment-300 hover:border-white/20"
              }`}
            >
              <div className="font-medium text-xs">{occ.name}</div>
              <div className="text-[10px] text-parchment-400 mt-0.5 line-clamp-1">{occ.mood}</div>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOccasion("custom")}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              occasion === "custom"
                ? "bg-lacquer-900/80 border-lacquer-600 text-parchment-100 font-semibold"
                : "bg-silkDark-900/60 border-white/5 text-parchment-300 hover:border-white/20"
            }`}
          >
            <div className="font-medium text-xs">Tùy chỉnh khác...</div>
            <div className="text-[10px] text-parchment-400 mt-0.5">Tự nhập bối cảnh riêng</div>
          </button>
        </div>

        {occasion === "custom" && (
          <input
            type="text"
            value={customOccasion}
            onChange={(e) => setCustomOccasion(e.target.value)}
            placeholder="Ví dụ: Dạ tiệc giao lưu quốc tế, Tiệc cưới cổ điển..."
            className="w-full mt-2 bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 focus:outline-none focus:ring-1 focus:ring-imperial-500"
          />
        )}
      </div>

      {/* 2. Loại Áo Ưu Tiên (Garment Preference) */}
      <div className="space-y-1.5">
        <label className="font-semibold text-parchment-300 flex items-center gap-1.5">
          <Shirt className="w-3.5 h-3.5 text-imperial-400" />
          <span>Kiểu y phục mong muốn:</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "any", label: "AI Đề Xuất Cả Hai" },
            { id: "ao_ngu_than_tay_chen", label: "Áo Ngũ Thân Tay Chẽn" },
            { id: "ao_dai_hien_dai", label: "Áo Dài Hiện Đại" },
          ].map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setGarmentPreference(item.id as any)}
              className={`p-2 rounded-xl border text-center transition-all ${
                garmentPreference === item.id
                  ? "bg-lacquer-900/80 border-lacquer-600 text-parchment-100 font-semibold"
                  : "bg-silkDark-900/60 border-white/5 text-parchment-400 hover:text-parchment-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tông Màu Tùy Chọn (Color Palette) */}
      <div className="space-y-1.5">
        <label className="font-semibold text-parchment-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-imperial-400" />
            <span>Màu sắc ưu tiên (Tùy chọn, tối đa 3):</span>
          </span>
          {selectedColors.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedColors([])}
              className="text-[10px] text-parchment-400 hover:text-parchment-200 underline"
            >
              Xóa chọn
            </button>
          )}
        </label>
        <div className="flex flex-wrap gap-2">
          {presetColors.map((color) => {
            const isSelected = selectedColors.includes(color.hex);
            return (
              <button
                type="button"
                key={color.hex}
                onClick={() => handleToggleColor(color.hex)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] transition-all ${
                  isSelected
                    ? "border-white bg-white/10 text-white font-semibold ring-2 ring-imperial-400"
                    : "border-white/10 text-parchment-400 hover:border-white/30"
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/30"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Tùy Chọn Ngũ Hành (Disabled by default, strict guardrails) */}
      <div className="border border-white/10 rounded-xl p-3 bg-silkDark-900/50 space-y-2">
        <div className="flex items-center justify-between">
          <label className="font-semibold text-parchment-300 flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={enableBelief}
              onChange={(e) => setEnableBelief(e.target.checked)}
              className="rounded bg-silkDark-800 border-white/20 text-imperial-600 focus:ring-0"
            />
            <span>Tham khảo bảng màu Ngũ hành (Sở thích cá nhân)</span>
          </label>
          <span className="text-[10px] text-parchment-400">Tắt mặc định</span>
        </div>

        {enableBelief && (
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex gap-1.5">
              {[
                { id: "kim", label: "Kim" },
                { id: "moc", label: "Mộc" },
                { id: "thuy", label: "Thủy" },
                { id: "hoa", label: "Hỏa" },
                { id: "tho", label: "Thổ" },
              ].map((el) => (
                <button
                  type="button"
                  key={el.id}
                  onClick={() => setBeliefElement(el.id as any)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                    beliefElement === el.id
                      ? "bg-imperial-600/30 border-imperial-500 text-imperial-200 font-bold"
                      : "bg-silkDark-950/60 border-white/5 text-parchment-400 hover:text-parchment-200"
                  }`}
                >
                  {el.label}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-parchment-400 flex items-start gap-1 leading-relaxed bg-white/5 p-2 rounded-lg">
              <Info className="w-3.5 h-3.5 text-imperial-400 shrink-0 mt-0.5" />
              <span>
                {beliefPaletteData.disclaimer}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 5. Mô Tả Tự Do (Free Prompt) */}
      <div className="space-y-1">
        <label className="font-semibold text-parchment-300">
          Ý tưởng chi tiết / Gợi ý sáng tạo của bạn:
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          rows={3}
          placeholder="Ví dụ: Em muốn bộ áo ngũ thân màu đỏ son phối cùng quần trắng và giày sneaker trẻ trung cho buổi chụp kỷ yếu ngoài Văn Miếu..."
          className="w-full bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-1 focus:ring-imperial-500 text-xs"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-gradient-to-r from-lacquer-700 via-lacquer-800 to-imperial-700 hover:from-lacquer-600 hover:to-imperial-600 text-parchment-100 font-serif font-bold text-sm rounded-xl shadow-lg shadow-lacquer-950/60 flex items-center justify-center gap-2 active:scale-[0.99] transition-all disabled:opacity-50"
      >
        <Sparkles className={`w-4 h-4 text-imperial-400 ${isLoading ? "animate-spin" : ""}`} />
        <span>{isLoading ? "Đang nghiên cứu và phối đồ..." : "Sáng Tạo Phối Đồ Ngay"}</span>
      </button>
    </form>
  );
}
