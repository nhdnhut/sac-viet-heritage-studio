"use client";

import React, { useState, useEffect } from "react";
import { SettingsState } from "@/types";
import {
  Settings,
  Key,
  ShieldCheck,
  Cpu,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Database,
  Eye,
  EyeOff,
} from "lucide-react";

interface SettingsScreenProps {
  onSettingsChanged: () => void;
}

export function SettingsScreen({ onSettingsChanged }: SettingsScreenProps) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [settings, setSettings] = useState<SettingsState | null>(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [clearingData, setClearingData] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/session");
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setActionMessage(null);

    try {
      const body: any = {
        textModel: settings?.textModel,
        imageModel: settings?.imageModel,
        thinkingLevel: settings?.thinkingLevel,
        maxImagesPerJob: settings?.maxImagesPerJob,
        visionQaEnabled: settings?.visionQaEnabled,
      };

      if (apiKeyInput.trim()) {
        body.apiKey = apiKeyInput.trim();
      }

      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        // Clear input state immediately as required by specification D
        setApiKeyInput("");
        setSettings(data);
        setActionMessage("Đã lưu thiết lập thành công. Key đã được đưa vào bộ nhớ phiên.");
        onSettingsChanged();
      } else {
        alert(data.error || "Không thể lưu cài đặt");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/connection-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() || undefined }),
      });
      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: "Lỗi kết nối mạng cục bộ đến backend.",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleDeleteSessionKey = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa API key khỏi bộ nhớ phiên làm việc?")) return;
    try {
      const res = await fetch("/api/session", { method: "DELETE" });
      const data = await res.json();
      setSettings(data);
      setTestResult(null);
      setActionMessage("Đã xóa API key khỏi phiên.");
      onSettingsChanged();
    } catch (err) {
      console.error("Failed to delete session key:", err);
    }
  };

  const handleClearLocalData = async () => {
    if (
      !confirm(
        "CẢNH BÁO: Thao tác này sẽ xóa toàn bộ Looks, Tủ đồ và Lịch sử tác vụ trong SQLite cục bộ. Bạn có chắc chắn không?"
      )
    )
      return;

    setClearingData(true);
    try {
      const res = await fetch("/api/clear-data", { method: "POST" });
      const data = await res.json();
      alert(data.message);
      onSettingsChanged();
    } catch (err) {
      console.error("Failed to clear local data:", err);
    } finally {
      setClearingData(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-xs">
      {/* Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-imperial-400" />
          <h2 className="text-xl font-serif font-black text-parchment-100">
            Cài Đặt & Cấu Hình Mô Hình
          </h2>
        </div>
        <p className="text-parchment-400 mt-1">
          Quản lý Gemini API Key an toàn theo phiên, chọn model văn bản, model ảnh, cấu hình thinking và hạn mức tác vụ.
        </p>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-600/60 rounded-xl text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* 1. API Key Card */}
      <div className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-imperial-400" />
            <h3 className="font-serif font-bold text-parchment-100 text-sm">
              Google Gemini API Key
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {settings?.hasEnvKey && (
              <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-full text-[10px] font-semibold">
                Đang dùng key từ .env.local
              </span>
            )}
            {settings?.hasSessionKey && !settings.hasEnvKey && (
              <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-700 rounded-full text-[10px] font-semibold">
                Đang dùng key phiên In-Memory
              </span>
            )}
            {!settings?.hasEnvKey && !settings?.hasSessionKey && (
              <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-700 rounded-full text-[10px] font-semibold">
                Chưa có key (Chạy Offline)
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-3">
          <div>
            <label className="text-parchment-300 font-semibold block mb-1">
              Nhập hoặc thay đổi API Key:
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder={
                  settings?.hasEnvKey || settings?.hasSessionKey
                    ? "•••••••••••••••••••••••• (Đã cấu hình, nhập mới để ghi đè)"
                    : "Dán Google AI Studio API Key (AIzaSy...)"
                }
                className="w-full bg-silkDark-900 border border-white/10 rounded-xl px-3 py-2.5 pr-10 text-xs text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-1 focus:ring-imperial-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-parchment-400 hover:text-parchment-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-parchment-400 mt-1.5 leading-relaxed">
              <strong>Bảo mật chuẩn:</strong> Key được gửi trực tiếp qua POST cùng origin, xóa sạch khỏi ô nhập ngay sau gửi, chỉ lưu trong RAM phiên trên máy bạn và không bao giờ ghi xuống localStorage, SQLite, log hay Git.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection}
                className="px-3.5 py-2 bg-silkDark-800 hover:bg-silkDark-700 text-parchment-200 rounded-xl border border-white/10 font-medium flex items-center gap-1.5 transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? "animate-spin" : ""}`} />
                <span>{testingConnection ? "Đang kiểm tra kết nối..." : "Kiểm Tra Kết Nối (ai.models.list)"}</span>
              </button>

              {settings?.hasSessionKey && (
                <button
                  type="button"
                  onClick={handleDeleteSessionKey}
                  className="px-3 py-2 bg-red-950/60 hover:bg-red-900/60 text-red-200 border border-red-800/40 rounded-xl font-medium flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Key Khỏi Phiên</span>
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-imperial-600 hover:bg-imperial-500 text-silkDark-950 font-bold rounded-xl shadow active:scale-95 transition-all"
            >
              {isSaving ? "Đang lưu..." : "Cập Nhật Cài Đặt"}
            </button>
          </div>
        </form>

        {/* Connection Test Report */}
        {testResult && (
          <div
            className={`p-3.5 rounded-xl border text-xs space-y-2 ${
              testResult.success
                ? "bg-emerald-950/40 border-emerald-600/50 text-emerald-200"
                : "bg-red-950/40 border-red-600/50 text-red-200"
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {testResult.success ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Kết nối Gemini API thành công!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span>Kết nối thất bại</span>
                </>
              )}
            </div>

            {testResult.success ? (
              <div className="space-y-1 text-[11px] text-parchment-300">
                <div>• Tìm thấy <strong>{testResult.models.length}</strong> mô hình trong tài khoản của bạn.</div>
                <div>• Model văn bản khả dụng: <strong>{testResult.recommendedTextModel}</strong></div>
                <div>• Model tạo ảnh khả dụng: <strong>{testResult.recommendedImageModel}</strong></div>
              </div>
            ) : (
              <div className="text-[11px] leading-relaxed text-red-300">
                {testResult.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Models & Thinking Config Card */}
      <div className="bg-silkDark-850 border border-lacquer-800/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Cpu className="w-4 h-4 text-imperial-400" />
          <h3 className="font-serif font-bold text-parchment-100 text-sm">
            Cấu Hình Mô Hình & Thinking Level
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Text Model */}
          <div className="space-y-1.5">
            <label className="font-semibold text-parchment-300 block">
              Mô hình Văn bản & Suy luận (Text Model):
            </label>
            <select
              value={settings?.textModel || "gemini-3.8-flash"}
              onChange={(e) =>
                setSettings((prev) => (prev ? { ...prev, textModel: e.target.value } : null))
              }
              className="w-full bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 focus:ring-1 focus:ring-imperial-500"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Mặc định khuyến nghị)</option>
              <option value="gemini-2.5-flash">gemini-2.5-flash (Dự phòng ổn định)</option>
              <option value="gemini-2.0-flash">gemini-2.0-flash</option>
            </select>
          </div>

          {/* Image Model */}
          <div className="space-y-1.5">
            <label className="font-semibold text-parchment-300 block">
              Mô hình Tạo ảnh Thực tế (Image Model):
            </label>
            <select
              value={settings?.imageModel || "gemini-3.1-flash-image"}
              onChange={(e) =>
                setSettings((prev) => (prev ? { ...prev, imageModel: e.target.value } : null))
              }
              className="w-full bg-silkDark-900 border border-white/10 rounded-xl p-2.5 text-parchment-100 focus:ring-1 focus:ring-imperial-500"
            >
              <option value="gemini-3.1-flash-image">gemini-3.1-flash-image (Mặc định)</option>
              <option value="gemini-3-pro-image">gemini-3-pro-image (Chất lượng cao)</option>
              <option value="imagen-3.0-generate-002">imagen-3.0-generate-002</option>
            </select>
          </div>
        </div>

        {/* Thinking Level */}
        <div className="space-y-1.5 pt-2">
          <label className="font-semibold text-parchment-300 block">
            Mức Độ Tư Duy Sâu (Thinking Config):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: "high", label: "High (Khuyến nghị)" },
              { id: "medium", label: "Medium" },
              { id: "low", label: "Low" },
              { id: "off", label: "Off" },
            ].map((lvl) => (
              <button
                type="button"
                key={lvl.id}
                onClick={() =>
                  setSettings((prev) => (prev ? { ...prev, thinkingLevel: lvl.id as any } : null))
                }
                className={`py-2 rounded-xl border text-center font-medium transition-all ${
                  settings?.thinkingLevel === lvl.id
                    ? "bg-imperial-600/30 border-imperial-500 text-imperial-200 font-bold"
                    : "bg-silkDark-900/60 border-white/5 text-parchment-400 hover:text-parchment-200"
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-parchment-400 mt-1">
            * Cấu hình qua thinkingConfig trong SDK (không gắn đuôi tên model), giúp phân tích đối chiếu sử liệu và suy luận phối màu thấu đáo hơn.
          </p>
        </div>

        {/* Vision QA Toggle */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="font-semibold text-parchment-200 block">
              Tự động kiểm định ảnh bằng Vision QA:
            </span>
            <span className="text-[10px] text-parchment-400">
              Đối soát ảnh tạo ra với bản đặc tả (cổ, tay, tà, màu) trước khi hoàn tất.
            </span>
          </div>
          <input
            type="checkbox"
            checked={settings?.visionQaEnabled ?? true}
            onChange={(e) =>
              setSettings((prev) => (prev ? { ...prev, visionQaEnabled: e.target.checked } : null))
            }
            className="rounded bg-silkDark-900 border-white/20 text-imperial-600 focus:ring-0 w-4 h-4 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Database Maintenance Card */}
      <div className="bg-silkDark-850 border border-red-950/60 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-red-300">
          <Database className="w-4 h-4 text-red-400" />
          <h3 className="font-serif font-bold text-sm">
            Quản Lý & Xóa Dữ Liệu Cục Bộ (SQLite)
          </h3>
        </div>
        <p className="text-[11px] text-parchment-400 leading-relaxed">
          Tất cả dữ liệu phối đồ, revisions, tủ đồ và ảnh assets được lưu hoàn toàn trên máy của bạn (file <code>data/sac_viet.db</code>). Nhấn nút dưới đây nếu bạn muốn làm sạch toàn bộ dữ liệu mẫu để bắt đầu lại.
        </p>
        <button
          type="button"
          onClick={handleClearLocalData}
          disabled={clearingData}
          className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-200 border border-red-800/60 rounded-xl font-semibold flex items-center gap-1.5 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{clearingData ? "Đang xóa..." : "Xóa Sạch Dữ Liệu Cục Bộ"}</span>
        </button>
      </div>
    </div>
  );
}
