import { GoogleGenAI, ThinkingLevel } from "@google/genai";

export function createGenAiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey });
}

export interface ConnectionTestResult {
  success: boolean;
  models: string[];
  recommendedTextModel: string;
  recommendedImageModel: string;
  isTextModelAvailable: boolean;
  isImageModelAvailable: boolean;
  error?: string;
  errorCode?: string;
}

export async function testGeminiConnection(
  apiKey: string,
  preferredTextModel = "gemini-3.8-flash",
  preferredImageModel = "gemini-3.1-flash-image"
): Promise<ConnectionTestResult> {
  try {
    const ai = createGenAiClient(apiKey);
    const response = await ai.models.list();
    const models: string[] = [];

    // response is a paged response or array
    for await (const m of response) {
      if (m.name) {
        // name might be "models/gemini-2.5-flash"
        const cleanName = m.name.replace(/^models\//, "");
        models.push(cleanName);
      }
    }

    const isTextModelAvailable = models.includes(preferredTextModel);
    const isImageModelAvailable = models.includes(preferredImageModel);

    // Find closest verified fallbacks if preferred is not in the account
    const fallbackText = isTextModelAvailable
      ? preferredTextModel
      : models.find((m) => m.includes("flash") && m.includes("gemini")) || "gemini-2.5-flash";

    const fallbackImage = isImageModelAvailable
      ? preferredImageModel
      : models.find((m) => m.includes("image") || m.includes("imagen")) || "imagen-3.0-generate-002";

    return {
      success: true,
      models,
      recommendedTextModel: fallbackText,
      recommendedImageModel: fallbackImage,
      isTextModelAvailable,
      isImageModelAvailable,
    };
  } catch (err: any) {
    const message = err?.message || String(err);
    let friendlyError = "Không thể kết nối đến Gemini API. Vui lòng kiểm tra lại API key.";
    let errorCode = "UNKNOWN_ERROR";

    if (message.includes("API_KEY_INVALID") || message.includes("401") || message.includes("unauthenticated")) {
      friendlyError = "API key không hợp lệ hoặc đã bị vô hiệu hóa.";
      errorCode = "API_KEY_INVALID";
    } else if (message.includes("RESOURCE_EXHAUSTED") || message.includes("429") || message.includes("quota")) {
      friendlyError = "Hạn mức (Quota) của API key đã vượt quá giới hạn của Google.";
      errorCode = "QUOTA_EXCEEDED";
    } else if (message.includes("PERMISSION_DENIED") || message.includes("403")) {
      friendlyError = "API key chưa được cấp quyền truy cập tài nguyên này trên Google Cloud.";
      errorCode = "PERMISSION_DENIED";
    }

    return {
      success: false,
      models: [],
      recommendedTextModel: preferredTextModel,
      recommendedImageModel: preferredImageModel,
      isTextModelAvailable: false,
      isImageModelAvailable: false,
      error: `${friendlyError} (Chi tiết: ${message.slice(0, 150)})`,
      errorCode,
    };
  }
}

export function buildThinkingConfig(level: "off" | "low" | "medium" | "high") {
  if (level === "off") {
    return {
      thinkingBudget: 0,
    };
  }
  if (level === "low") {
    return {
      thinkingLevel: ThinkingLevel.LOW,
      thinkingBudget: 1024,
    };
  }
  if (level === "medium") {
    return {
      thinkingLevel: ThinkingLevel.MEDIUM,
      thinkingBudget: 4096,
    };
  }
  // High thinking configuration
  return {
    thinkingLevel: ThinkingLevel.HIGH,
    thinkingBudget: 8192,
  };
}
