"use client";

import React from "react";
import { Sparkles, Compass, Bookmark, Shirt, Users, BookOpen, Settings, ShieldCheck } from "lucide-react";

export type ActiveScreen =
  | "studio"
  | "compare"
  | "lookbook"
  | "wardrobe"
  | "group"
  | "content"
  | "settings";

interface NavbarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  hasKey: boolean;
  activeSource: "env" | "session" | "none";
}

export function Navbar({ activeScreen, onNavigate, hasKey, activeSource }: NavbarProps) {
  const navItems = [
    { id: "studio", label: "Studio Phối Đồ", icon: Sparkles },
    { id: "compare", label: "So Sánh (Compare)", icon: Compass },
    { id: "lookbook", label: "Lookbook Cá Nhân", icon: Bookmark },
    { id: "wardrobe", label: "Tủ Đồ", icon: Shirt },
    { id: "group", label: "Phối Nhóm", icon: Users },
    { id: "content", label: "Nội Dung & Sử Liệu", icon: BookOpen },
    { id: "settings", label: "Cài Đặt", icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-silkDark-950/90 backdrop-blur-md border-b border-lacquer-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand */}
        <div
          onClick={() => onNavigate("studio")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lacquer-700 via-lacquer-800 to-imperial-700 p-0.5 shadow-lg shadow-lacquer-900/50 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-silkDark-950 rounded-[10px] flex items-center justify-center">
              <span className="font-serif font-black text-imperial-400 text-lg">S</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-black tracking-wide text-parchment-100 text-base sm:text-lg">
                SẮC VIỆT STUDIO
              </h1>
              <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 bg-imperial-600/20 text-imperial-300 font-semibold rounded-full border border-imperial-500/30">
                Việt phục Remix
              </span>
            </div>
            <p className="text-[11px] text-parchment-400 hidden md:block">
              Phối Việt phục theo cách của bạn, hiểu câu chuyện phía sau
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ActiveScreen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? "bg-lacquer-800 text-parchment-100 shadow-md font-semibold border border-lacquer-600/40"
                    : "text-parchment-300 hover:text-parchment-100 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-imperial-400" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Status Indicator */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => onNavigate("settings")}
            className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 bg-silkDark-900 border border-white/10 rounded-full text-xs text-parchment-300 hover:border-imperial-500/40 transition-all"
            title={hasKey ? `Gemini Key kết nối qua ${activeSource}` : "Chưa cấu hình API Key"}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                hasKey ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="hidden sm:inline text-[11px]">
              {hasKey ? `Gemini Sẵn Sàng (${activeSource})` : "Chế độ Local Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Scroller */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 border-t border-white/5 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ActiveScreen)}
              className={`flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-lacquer-800 text-parchment-100 font-semibold"
                  : "text-parchment-400 hover:text-parchment-200 bg-silkDark-900/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
