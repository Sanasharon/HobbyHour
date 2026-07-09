export interface VideoResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration: string; // formatted mm:ss or h:mm:ss
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  videos?: VideoResult[];
  hobbyName?: string;
}

export interface GeminiMatchResult {
  reply: string;
  hobbyName: string;
  searchQuery: string;
}
