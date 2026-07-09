import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import type { GeminiMatchResult, ChatMessage } from "./types";

const SYSTEM_INSTRUCTION = `You are HobbyScout, a warm and encouraging hobby-matching guide.

The user will describe constraints such as budget, free time, living situation, or interests,
across one or more messages. Your job:

1. Recommend exactly ONE specific, somewhat niche hobby that genuinely fits their constraints.
   Avoid generic answers like "painting" or "reading" unless truly the best fit — prefer specific,
   memorable niches (e.g. "kinetic sand terrariums" rather than "gardening").
2. Write a short, friendly reply (2-4 sentences) explaining the recommendation and why it fits
   their specific constraints. Speak directly to the user, second person, encouraging tone.
3. Produce a concise YouTube search query (3-6 words) that would surface a *beginner tutorial*
   for this exact hobby. Include a word like "beginner" or "tutorial" in the query.

If the user's message so far is too vague to recommend anything (e.g. just "hi"), ask ONE
clarifying question in the reply, and set hobbyName and searchQuery to empty strings.

Always respond ONLY through the structured output fields. Never include markdown or extra text.`;

let client: GoogleGenerativeAI | null = null;

function getClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in the environment.");
    }
    client = new GoogleGenerativeAI(apiKey);
  }
  return client;
}

export async function getHobbyMatch(
  history: ChatMessage[],
  latestUserMessage: string
): Promise<GeminiMatchResult> {
  const genAI = getClient();

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          reply: {
            type: SchemaType.STRING,
            description: "Friendly reply shown directly to the user.",
          },
          hobbyName: {
            type: SchemaType.STRING,
            description: "Short name of the recommended hobby, or empty string if none yet.",
          },
          searchQuery: {
            type: SchemaType.STRING,
            description: "YouTube search query for a beginner tutorial, or empty string if none yet.",
          },
        },
        required: ["reply", "hobbyName", "searchQuery"],
      },
    },
  });

  // Convert prior chat history into Gemini's chat format (skip video-only assistant turns' extra data).
  const chatHistory = history.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(latestUserMessage);
  const text = result.response.text();

  try {
    const parsed = JSON.parse(text) as GeminiMatchResult;
    return parsed;
  } catch (err) {
    throw new Error("Gemini returned malformed JSON: " + text);
  }
}
