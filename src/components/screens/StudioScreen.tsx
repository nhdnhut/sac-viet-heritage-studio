"use client";

import React, { useState, useEffect } from "react";
import { OutfitSpec, BriefInput, RenderJob } from "@/types";
import { BriefInputForm } from "@/components/BriefInputForm";
import { Mockup2D } from "@/components/Mockup2D";
import { AiImageViewer } from "@/components/AiImageViewer";
import { Viewer3D } from "@/components/viewport3d/Viewer3D";
import { RemixStoryCard } from "@/components/RemixStoryCard";
import { LookRefinePanel } from "@/components/LookRefinePanel";
import {
  Sparkles,
  Box,
  Image as ImageIcon,
  FileCode,
  BookmarkPlus,
  FileDown,
  Check,
  BookOpen,
  Layers,
  HelpCircle,
} from "lucide-react";

interface StudioScreenProps {
  hasKey: boolean;
  onSaveToLookbook: (spec: OutfitSpec) => void;
  onExportDesignBrief: (spec: OutfitSpec) => void;
}

export function StudioScreen({
  hasKey,
  onSaveToLookbook,
  onExportDesignBrief,
}: StudioScreenProps) {
  const [options, setOptions] = useState<OutfitSpec[]>([]);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
  const [viewerTab, setViewerTab] = useState<"mockup" | "image" | "3d">("3d");
  const [isLoading, setIsLoading] = useState(false);
  const [renderJob, setRenderJob] = useState<RenderJob | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [history, setHistory] = useState<OutfitSpec[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clarifyingQuestion, setClarifyingQuestion] = useState<string | null>(null);

  const currentSpec = options[selectedOptionIndex] || null;

  // Initial load: create initial default looks so studio is never empty
  useEffect(() => {
    handleGenerateBrief({
      occasion: "tet_nguyen_dan",
      garmentPreference: "any",
      styleVibe: "Trang trọng, ấm áp đón xuân",
    });
  }, []);

  const handleGenerateBrief = async (brief: BriefInput) => {
    setIsLoading(true);
    setClarifyingQuestion(null);
    try {
      const res = await fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(brief),
      });
      const data = await res.json();
      if (data.success && data.data?.options?.length > 0) {
        setOptions(data.data.options);
        setSelectedOptionIndex(0);
        setHistory([data.data.options[0]]);
        setHistoryIndex(0);
        setRenderJob(null);
        if (data.data.clarifyingQuestion) {
          setClarifyingQuestion(data.data.clarifyingQuestion);
        }
      }
    } catch (err) {
      console.error("Failed to generate styling options:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPatch = async (patch: Partial<OutfitSpec>, instruction?: string) => {
    if (!currentSpec) return;

    try {
      const res = await fetch("/api/patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lookId: currentSpec.id,
          baseRevision: currentSpec.revision,
          patch,
          userInstruction: instruction,
        }),
      });

      const data = await res.json();
      if (data.success && data.look) {
        const updatedLook: OutfitSpec = data.look;

        // Update options state
        const updatedOptions = [...options];
        updatedOptions[selectedOptionIndex] = updatedLook;
        setOptions(updatedOptions);

        // Update undo/redo history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(updatedLook);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      } else if (data.conflict) {
        alert(data.error);
      }
    } catch (err) {
      console.error("Failed to apply patch:", err);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      const updatedOptions = [...options];
      updatedOptions[selectedOptionIndex] = prev;
      setOptions(updatedOptions);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      const updatedOptions = [...options];
      updatedOptions[selectedOptionIndex] = next;
      setOptions(updatedOptions);
    }
  };

  const handleTriggerRender = async () => {
    if (!currentSpec) return;
    setIsRendering(true);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookId: currentSpec.id }),
      });
      const data = await res.json();
      if (data.job) {
        setRenderJob(data.job);
        setViewerTab("image");
      } else if (data.error) {
        alert(data.error);
      }
    } catch (err) {
      console.error("Render trigger failed:", err);
    } finally {
      setIsRendering(false);
    }
  };

  const handleSave = () => {
    if (!currentSpec) return;
    onSaveToLookbook(currentSpec);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Clarifying Question Alert if any */}
      {clarifyingQuestion && (
        <div className="p-3 bg-indigoStone-900/60 border border-indigoStone-600/60 rounded-xl flex items-center justify-between text-xs text-parchment-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-imperial-400 shrink-0" />
            <span>
              <strong>Gợi ý từ AI:</strong> {clarifyingQuestion}
            </span>
          </div>
          <button
            onClick={() => setClarifyingQuestion(null)}
            className="text-[11px] text-parchment-400 hover:text-white underline ml-4"
          >
            Đóng
          </button>
        </div>
      )}

      {/* Main Grid: Left Brief Sidebar | Right Preview & Refine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <BriefInputForm onSubmit={handleGenerateBrief} isLoading={isLoading} />
        </div>

        {/* Right Column (8 cols): Options Tabs + Viewer + Controls */}
        <div className="lg:col-span-8 space-y-5">
          {/* 3 Styling Options Tabs */}
          {options.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {options.map((opt, idx) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedOptionIndex(idx);
                    setHistory([opt]);
                    setHistoryIndex(0);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                    selectedOptionIndex === idx
                      ? "bg-lacquer-900/90 border-imperial-500 shadow-lg text-parchment-100 ring-1 ring-imperial-500"
                      : "bg-silkDark-900/70 border-white/5 text-parchment-400 hover:border-white/20 hover:text-parchment-200"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold uppercase tracking-wider text-imperial-400">
                      PA {idx + 1}
                    </span>
                    <span
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: opt.primaryColor }}
                    />
                  </div>
                  <div className="font-serif font-bold text-xs truncate">{opt.name}</div>
                  <div className="text-[10px] text-parchment-400 truncate mt-0.5">
                    {opt.garmentName}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Central Viewer Header Tabs: Mockup 2D | Ảnh AI | 3D Viewport */}
          <div className="flex items-center justify-between bg-silkDark-900 p-2 rounded-2xl border border-white/10">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setViewerTab("3d")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewerTab === "3d"
                    ? "bg-lacquer-800 text-parchment-100 shadow"
                    : "text-parchment-400 hover:text-parchment-200"
                }`}
              >
                <Box className="w-3.5 h-3.5 text-imperial-400" />
                <span>Không Gian 3D Thật</span>
              </button>

              <button
                onClick={() => setViewerTab("mockup")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewerTab === "mockup"
                    ? "bg-lacquer-800 text-parchment-100 shadow"
                    : "text-parchment-400 hover:text-parchment-200"
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-imperial-400" />
                <span>Mockup 2D Tham Số</span>
              </button>

              <button
                onClick={() => setViewerTab("image")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  viewerTab === "image"
                    ? "bg-lacquer-800 text-parchment-100 shadow"
                    : "text-parchment-400 hover:text-parchment-200"
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-imperial-400" />
                <span>Ảnh Thực Tế AI</span>
              </button>
            </div>

            {/* Actions: Save Lookbook & Export Brief */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!currentSpec}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-silkDark-800 hover:bg-silkDark-700 text-parchment-200 rounded-xl text-xs border border-white/10 active:scale-95 transition-all"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Đã lưu Lookbook</span>
                  </>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5 text-imperial-400" />
                    <span>Lưu Lookbook</span>
                  </>
                )}
              </button>

              <button
                onClick={() => currentSpec && onExportDesignBrief(currentSpec)}
                disabled={!currentSpec}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-bold rounded-xl text-xs active:scale-95 transition-all shadow"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Xuất Bản Thiết Kế</span>
              </button>
            </div>
          </div>

          {/* Viewer Area */}
          {currentSpec && (
            <div className="w-full">
              {viewerTab === "3d" && <Viewer3D spec={currentSpec} />}
              {viewerTab === "mockup" && <Mockup2D spec={currentSpec} />}
              {viewerTab === "image" && (
                <AiImageViewer
                  spec={currentSpec}
                  currentJob={renderJob}
                  onTriggerRender={handleTriggerRender}
                  isLoading={isRendering}
                  hasApiKey={hasKey}
                />
              )}
            </div>
          )}

          {/* Refine Controls & Giữ gì - Remix gì Grid */}
          {currentSpec && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <RemixStoryCard story={currentSpec.remixStory} garmentName={currentSpec.garmentName} />
              <LookRefinePanel
                spec={currentSpec}
                onApplyPatch={handleApplyPatch}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex > 0}
                canRedo={historyIndex < history.length - 1}
                isLoading={isLoading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
