"use client";

import React from "react";
import { OutfitSpec } from "@/types";
import { ShieldCheck, Tag, Sparkles } from "lucide-react";

interface Mockup2DProps {
  spec: OutfitSpec;
}

export function Mockup2D({ spec }: Mockup2DProps) {
  const isNguThan = spec.garmentId === "ao_ngu_than_tay_chen";

  return (
    <div className="w-full bg-silkDark-900 border border-lacquer-800/40 rounded-2xl p-6 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div>
          <span className="text-xs uppercase tracking-wider text-imperial-400 font-semibold">
            Bản vẽ Kỹ thuật 2D Tham số
          </span>
          <h3 className="text-lg font-serif font-bold text-parchment-100">{spec.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 bg-lacquer-900/60 border border-lacquer-700/60 rounded-full text-parchment-200">
            Hash: {spec.specHash.slice(0, 8)}
          </span>
        </div>
      </div>

      {/* SVG Diagram */}
      <div className="relative w-full max-w-md h-[400px] flex items-center justify-center bg-silkDark-950/60 rounded-xl p-4 border border-white/5">
        <svg
          viewBox="0 0 300 420"
          className="w-full h-full max-h-[380px] drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Head & Neck silhouette */}
          <circle cx="150" cy="40" r="22" fill="#ECC8A8" />
          <rect x="141" y="60" width="18" height="20" rx="3" fill="#ECC8A8" />

          {/* Collar */}
          <rect
            x="134"
            y="70"
            width="32"
            height="14"
            rx="4"
            fill={spec.secondaryColor}
            stroke="#131010"
            strokeWidth="1.5"
          />

          {/* Trousers */}
          <rect
            x="115"
            y="230"
            width="32"
            height="150"
            rx="4"
            fill={spec.pantsColor}
            stroke="#2A2424"
            strokeWidth="1"
          />
          <rect
            x="153"
            y="230"
            width="32"
            height="150"
            rx="4"
            fill={spec.pantsColor}
            stroke="#2A2424"
            strokeWidth="1"
          />

          {isNguThan ? (
            /* Áo ngũ thân 5-panel layout */
            <g>
              {/* Thân áo chính */}
              <path
                d="M100 84 L200 84 L212 140 L218 270 L82 270 L88 140 Z"
                fill={spec.primaryColor}
                stroke="#1A1616"
                strokeWidth="2"
              />
              {/* Nẹp vạt áo khuy phải (Hữu nhậm) */}
              <path
                d="M150 84 Q170 100 185 130 Q196 170 198 220"
                stroke={spec.secondaryColor}
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* 5 Cúc ngọc */}
              <circle cx="154" cy="88" r="3.5" fill="#E2C366" stroke="#222" strokeWidth="1" />
              <circle cx="172" cy="110" r="3.5" fill="#E2C366" stroke="#222" strokeWidth="1" />
              <circle cx="186" cy="138" r="3.5" fill="#E2C366" stroke="#222" strokeWidth="1" />
              <circle cx="194" cy="174" r="3.5" fill="#E2C366" stroke="#222" strokeWidth="1" />
              <circle cx="197" cy="210" r="3.5" fill="#E2C366" stroke="#222" strokeWidth="1" />

              {/* Tay chẽn thuôn gọn */}
              <path
                d="M100 84 L50 170 L64 176 L106 120 Z"
                fill={spec.primaryColor}
                stroke="#1A1616"
                strokeWidth="1.5"
              />
              <path
                d="M200 84 L250 170 L236 176 L194 120 Z"
                fill={spec.primaryColor}
                stroke="#1A1616"
                strokeWidth="1.5"
              />
              {/* Viền nẹp cổ tay */}
              <rect
                x="48"
                y="167"
                width="18"
                height="8"
                rx="2"
                fill={spec.secondaryColor}
                transform="rotate(35 48 167)"
              />
              <rect
                x="234"
                y="177"
                width="18"
                height="8"
                rx="2"
                fill={spec.secondaryColor}
                transform="rotate(-35 234 177)"
              />
            </g>
          ) : (
            /* Áo dài hiện đại 2 tà */
            <g>
              {/* Thân áo ôm eo */}
              <path
                d="M110 84 L190 84 L175 140 L166 170 L195 310 L105 310 L134 170 L125 140 Z"
                fill={spec.primaryColor}
                stroke="#1A1616"
                strokeWidth="2"
              />
              {/* Đường xẻ eo hai bên */}
              <line x1="134" y1="170" x2="134" y2="310" stroke="#000" strokeWidth="1.5" opacity="0.3" />
              <line x1="166" y1="170" x2="166" y2="310" stroke="#000" strokeWidth="1.5" opacity="0.3" />

              {/* Tay Raglan mềm mại */}
              <path
                d="M110 84 L65 180 L78 184 L125 130 Z"
                fill={spec.primaryColor}
                stroke="#1A1616"
                strokeWidth="1.5"
              />
              <path
                d="M190 84 L235 180 L222 184 L175 130 Z"
                fill={spec.primaryColor}
                stroke="#1A1616"
                strokeWidth="1.5"
              />
            </g>
          )}

          {/* Shoes */}
          <rect x="116" y="380" width="30" height="12" rx="4" fill="#3D2614" />
          <rect x="154" y="380" width="30" height="12" rx="4" fill="#3D2614" />
        </svg>

        {/* Labels overlay */}
        <div className="absolute top-6 right-4 text-[11px] bg-silkDark-800/90 border border-white/10 px-2.5 py-1.5 rounded-lg text-parchment-200 space-y-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-white/20 inline-block"
              style={{ backgroundColor: spec.primaryColor }}
            />
            <span>Thân áo: {spec.primaryColor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-white/20 inline-block"
              style={{ backgroundColor: spec.secondaryColor }}
            />
            <span>Viền nẹp: {spec.secondaryColor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full border border-white/20 inline-block"
              style={{ backgroundColor: spec.pantsColor }}
            />
            <span>Quần lụa: {spec.pantsColor}</span>
          </div>
        </div>
      </div>

      {/* Specifications list */}
      <div className="w-full mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        <div className="bg-silkDark-800/70 p-2.5 rounded-xl border border-white/5">
          <span className="text-parchment-400 block text-[10px] uppercase font-semibold">Cổ áo</span>
          <span className="text-parchment-100 font-medium">{spec.collarName}</span>
        </div>
        <div className="bg-silkDark-800/70 p-2.5 rounded-xl border border-white/5">
          <span className="text-parchment-400 block text-[10px] uppercase font-semibold">Ống tay</span>
          <span className="text-parchment-100 font-medium">{spec.sleeveName}</span>
        </div>
        <div className="bg-silkDark-800/70 p-2.5 rounded-xl border border-white/5">
          <span className="text-parchment-400 block text-[10px] uppercase font-semibold">Chất liệu</span>
          <span className="text-parchment-100 font-medium">{spec.fabricName}</span>
        </div>
        <div className="bg-silkDark-800/70 p-2.5 rounded-xl border border-white/5">
          <span className="text-parchment-400 block text-[10px] uppercase font-semibold">Phụ kiện</span>
          <span className="text-parchment-100 font-medium">
            {spec.accessories.length > 0 ? `${spec.accessories.length} món` : "Tối giản"}
          </span>
        </div>
      </div>
    </div>
  );
}
