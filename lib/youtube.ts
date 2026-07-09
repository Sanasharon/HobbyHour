import type { VideoResult } from "./types";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";
const MIN_DURATION_SECONDS = 180; // exclude Shorts / very short clips
const RESULTS_TO_RETURN = 3;

interface YTSearchItem {
  id: { videoId: string };
}

interface YTVideoDetailsItem {
  id: string;
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium?: { url: string };
      high?: { url: string };
      default?: { url: string };
    };
  };
  contentDetails: {
    duration: string; // ISO 8601, e.g. PT14M33S
  };
}

function parseIsoDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export async function searchBeginnerTutorials(
  searchQuery: string
): Promise<VideoResult[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    throw new Error("YOUTUBE_API_KEY is not set in the environment.");
  }
  if (!searchQuery) return [];

  // Step 1: search for candidate videos.
  const searchParams = new URLSearchParams({
    key: apiKey,
    q: searchQuery,
    part: "id",
    type: "video",
    maxResults: "10",
    safeSearch: "strict",
    relevanceLanguage: "en",
    videoEmbeddable: "true",
  });

  const searchRes = await fetch(`${YOUTUBE_API_BASE}/search?${searchParams}`);
  if (!searchRes.ok) {
    throw new Error(`YouTube search failed: ${searchRes.status}`);
  }
  const searchData = await searchRes.json();
  const items: YTSearchItem[] = searchData.items || [];
  const videoIds = items.map((i) => i.id.videoId).filter(Boolean);
  if (videoIds.length === 0) return [];

  // Step 2: fetch durations + full snippet in one batch call.
  const detailsParams = new URLSearchParams({
    key: apiKey,
    id: videoIds.join(","),
    part: "snippet,contentDetails",
  });

  const detailsRes = await fetch(`${YOUTUBE_API_BASE}/videos?${detailsParams}`);
  if (!detailsRes.ok) {
    throw new Error(`YouTube video details failed: ${detailsRes.status}`);
  }
  const detailsData = await detailsRes.json();
  const detailItems: YTVideoDetailsItem[] = detailsData.items || [];

  const results: VideoResult[] = detailItems
    .map((item) => {
      const durationSeconds = parseIsoDuration(item.contentDetails.duration);
      return {
        videoId: item.id,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.high?.url ||
          item.snippet.thumbnails.default?.url ||
          "",
        duration: formatDuration(durationSeconds),
        durationSeconds,
      };
    })
    .filter((v) => v.durationSeconds >= MIN_DURATION_SECONDS)
    .slice(0, RESULTS_TO_RETURN)
    .map(({ durationSeconds, ...rest }) => rest);

  return results;
}
