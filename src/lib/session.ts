import crypto from "node:crypto";

interface SessionData {
  apiKey?: string;
  textModel: string;
  imageModel: string;
  thinkingLevel: "off" | "low" | "medium" | "high";
  maxImagesPerJob: number;
  visionQaEnabled: boolean;
  createdAt: number;
  lastActiveAt: number;
}

// In-Memory Session Store - NEVER written to disk, SQLite, logs or sent to client
const sessionStore = new Map<string, SessionData>();

// Default configuration settings
export const DEFAULT_SETTINGS = {
  textModel: "gemini-3.8-flash",
  imageModel: "gemini-3.1-flash-image",
  thinkingLevel: "high" as const,
  maxImagesPerJob: 3,
  visionQaEnabled: true,
};

export function createSession(): string {
  const sessionId = crypto.randomBytes(32).toString("hex");
  sessionStore.set(sessionId, {
    ...DEFAULT_SETTINGS,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
  });
  return sessionId;
}

export function getSession(sessionId: string | null | undefined): SessionData | null {
  if (!sessionId) return null;
  const session = sessionStore.get(sessionId);
  if (!session) return null;
  session.lastActiveAt = Date.now();
  return session;
}

export function updateSession(sessionId: string, updates: Partial<SessionData>): void {
  const session = sessionStore.get(sessionId);
  if (session) {
    Object.assign(session, updates, { lastActiveAt: Date.now() });
  }
}

export function deleteSessionKey(sessionId: string): void {
  const session = sessionStore.get(sessionId);
  if (session) {
    delete session.apiKey;
    session.lastActiveAt = Date.now();
  }
}

export function getActiveApiKey(sessionId: string | null | undefined): string | null {
  // Priority 1: Environment variable
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "") {
    return process.env.GEMINI_API_KEY.trim();
  }
  // Priority 2: In-Memory Session key
  if (sessionId) {
    const session = sessionStore.get(sessionId);
    if (session?.apiKey && session.apiKey.trim() !== "") {
      return session.apiKey.trim();
    }
  }
  return null;
}

export function hasActiveKey(sessionId: string | null | undefined): {
  hasEnvKey: boolean;
  hasSessionKey: boolean;
  activeKeySource: "env" | "session" | "none";
} {
  const hasEnv = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== "");
  const session = sessionId ? sessionStore.get(sessionId) : null;
  const hasSession = Boolean(session?.apiKey && session.apiKey.trim() !== "");

  let activeKeySource: "env" | "session" | "none" = "none";
  if (hasEnv) activeKeySource = "env";
  else if (hasSession) activeKeySource = "session";

  return {
    hasEnvKey: hasEnv,
    hasSessionKey: hasSession,
    activeKeySource,
  };
}

// Verify Origin / Host headers for local security
export function verifyLocalOrigin(request: Request): boolean {
  const host = request.headers.get("host") || "";
  const origin = request.headers.get("origin") || "";

  // Allow standard local host bindings
  const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  if (!isLocalHost) return false;

  if (origin) {
    try {
      const originUrl = new URL(origin);
      const isLocalOrigin = originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1";
      if (!isLocalOrigin) return false;
    } catch {
      return false;
    }
  }

  return true;
}
