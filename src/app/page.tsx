"use client";

import React, { useState, useEffect } from "react";
import { Navbar, ActiveScreen } from "@/components/Navbar";
import { StudioScreen } from "@/components/screens/StudioScreen";
import { CompareScreen } from "@/components/screens/CompareScreen";
import { LookbookScreen } from "@/components/screens/LookbookScreen";
import { WardrobeScreen } from "@/components/screens/WardrobeScreen";
import { GroupScreen } from "@/components/screens/GroupScreen";
import { ContentScreen } from "@/components/screens/ContentScreen";
import { SettingsScreen } from "@/components/screens/SettingsScreen";
import { DesignBriefModal } from "@/components/DesignBriefModal";
import { OutfitSpec } from "@/types";

export default function HomePage() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>("studio");
  const [hasKey, setHasKey] = useState(false);
  const [activeSource, setActiveSource] = useState<"env" | "session" | "none">("none");
  const [designBriefSpec, setDesignBriefSpec] = useState<OutfitSpec | null>(null);

  // Global look selection for studio editing
  const [studioTargetSpec, setStudioTargetSpec] = useState<OutfitSpec | null>(null);

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      setHasKey(data.hasEnvKey || data.hasSessionKey);
      setActiveSource(data.activeKeySource || "none");
    } catch (err) {
      console.error("Failed to check key status:", err);
    }
  };

  const handleSaveToLookbook = async (spec: OutfitSpec) => {
    try {
      await fetch("/api/looks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec),
      });
    } catch (err) {
      console.error("Failed to save to lookbook:", err);
    }
  };

  const handleOpenInStudio = (spec: OutfitSpec) => {
    setStudioTargetSpec(spec);
    setActiveScreen("studio");
  };

  return (
    <div className="min-h-screen flex flex-col bg-silkDark-950 text-parchment-100">
      {/* Top Navbar */}
      <Navbar
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        hasKey={hasKey}
        activeSource={activeSource}
      />

      {/* Main Screen Content */}
      <main className="flex-1 pb-16">
        {activeScreen === "studio" && (
          <StudioScreen
            key={studioTargetSpec?.id || "default"}
            hasKey={hasKey}
            onSaveToLookbook={handleSaveToLookbook}
            onExportDesignBrief={(spec) => setDesignBriefSpec(spec)}
          />
        )}

        {activeScreen === "compare" && (
          <CompareScreen onSelectForStudio={handleOpenInStudio} />
        )}

        {activeScreen === "lookbook" && (
          <LookbookScreen onOpenInStudio={handleOpenInStudio} />
        )}

        {activeScreen === "wardrobe" && <WardrobeScreen />}

        {activeScreen === "group" && (
          <GroupScreen onOpenInStudio={handleOpenInStudio} />
        )}

        {activeScreen === "content" && <ContentScreen />}

        {activeScreen === "settings" && (
          <SettingsScreen onSettingsChanged={checkKeyStatus} />
        )}
      </main>

      {/* Design Brief Modal */}
      {designBriefSpec && (
        <DesignBriefModal
          spec={designBriefSpec}
          onClose={() => setDesignBriefSpec(null)}
        />
      )}

      {/* Cultural Footer */}
      <footer className="w-full bg-silkDark-900 border-t border-white/5 py-6 px-4 text-center text-xs text-parchment-400 space-y-1">
        <p className="font-serif text-parchment-200">
          SẮC VIỆT STUDIO — Dự án Việt phục Remix cho học sinh, sinh viên và câu lạc bộ văn hóa
        </p>
        <p className="text-[11px] text-parchment-400">
          Tôn trọng quy thức Áo ngũ thân tay chẽn triều Nguyễn & Khuyến khích sáng tạo Áo dài đương đại • Vận hành 100% Local
        </p>
      </footer>
    </div>
  );
}
