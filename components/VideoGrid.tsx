import type { VideoResult } from "@/lib/types";
import VideoCard from "./VideoCard";

export default function VideoGrid({
  videos,
  hobbyName,
}: {
  videos: VideoResult[];
  hobbyName?: string;
}) {
  if (!videos || videos.length === 0) return null;

  return (
    <div className="mt-3 ml-0 sm:ml-11">
      <p className="font-mono text-[11px] uppercase tracking-wider text-ink/60 mb-2">
        Field guide{hobbyName ? ` — ${hobbyName}` : ""}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {videos.map((v, i) => (
          <VideoCard key={v.videoId} video={v} index={i} />
        ))}
      </div>
    </div>
  );
}
