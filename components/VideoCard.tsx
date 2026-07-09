import type { VideoResult } from "@/lib/types";

export default function VideoCard({
  video,
  index,
}: {
  video: VideoResult;
  index: number;
}) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.videoId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col bg-paper border border-line rounded-sm overflow-hidden
                 shadow-[2px_2px_0_0_#C9BFA0] hover:shadow-[3px_3px_0_0_#8B3A2B]
                 hover:-translate-y-0.5 transition-all duration-150"
    >
      <span
        className="absolute top-2 left-2 z-10 font-mono text-[10px] tracking-wider text-paper
                   bg-rust px-1.5 py-0.5 rounded-sm rotate-[-2deg]"
      >
        SPEC. NO. {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative aspect-video w-full overflow-hidden bg-ink/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-200"
        />
        <span className="absolute bottom-1.5 right-1.5 font-mono text-[11px] bg-ink/85 text-paper px-1.5 py-0.5 rounded-sm">
          {video.duration}
        </span>
      </div>

      <div className="flex flex-col gap-1 px-3 py-3 border-t border-dashed border-line">
        <h4 className="font-display font-semibold text-[15px] leading-snug line-clamp-2 text-ink">
          {video.title}
        </h4>
        <p className="font-mono text-[11px] uppercase tracking-wide text-moss">
          {video.channelTitle}
        </p>
      </div>
    </a>
  );
}
