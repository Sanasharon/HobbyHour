import { NextRequest, NextResponse } from "next/server";
import { getHobbyMatch } from "@/lib/gemini";
import { searchBeginnerTutorials } from "@/lib/youtube";
import type { ChatMessage } from "@/lib/types";

export const runtime = "edge";

// Very small in-memory rate limiter (per-instance, best-effort only).
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a bit and try again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    let history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
    const message: string = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }
    if (message.length > 1000) {
      return NextResponse.json({ error: "Message is too long." }, { status: 400 });
    }

    // 🔥 ULTIMATE FIX: Find the first index where the role is actually 'user'
    // This strips out any stray initial welcome greetings/system logs completely.
    const firstUserIndex = history.findIndex(msg => msg.role === "user");
    
    if (firstUserIndex !== -1) {
      // Slice history to start exactly from the first user message
      history = history.slice(firstUserIndex);
    } else {
      // If there are no user messages in history at all, clear it completely
      history = [];
    }

    const match = await getHobbyMatch(history, message);

    let videos: Awaited<ReturnType<typeof searchBeginnerTutorials>> = [];
    if (match.searchQuery) {
      try {
        videos = await searchBeginnerTutorials(match.searchQuery);
      } catch (err) {
        console.error("YouTube lookup failed:", err);
      }
    }

    return NextResponse.json({
      reply: match.reply,
      hobbyName: match.hobbyName,
      videos,
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}