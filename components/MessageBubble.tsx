"use client";

import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} my-2 relative`}>
      <style jsx>{`
        .cloud-bubble {
          border-radius: 50px 50px 50px 50px / 40px 40px 40px 40px;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .user-cloud {
          border-radius: 40px 40px 4px 40px / 40px 40px 4px 40px;
          background: linear-gradient(135deg, #e0e7ff 0%, #f472b6 50%, #e8f0fe 100%);
          background-size: 200% 200%;
          color: #1e1b4b;
          border: 1px solid rgba(255, 255, 255, 0.4);
          box-shadow: 0 0 15px rgba(216, 180, 254, 0.4), 0 0 30px rgba(244, 114, 182, 0.2), inset 0 -4px 8px rgba(0, 0, 0, 0.05);
          animation: auroraGlow 6s infinite ease-in-out;
        }

        .ai-cloud {
          border-radius: 40px 40px 40px 4px / 40px 40px 40px 4px;
          background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%);
          color: #fae8ff;
          border: 1px solid rgba(251, 207, 60, 0.2);
          box-shadow: 0 0 20px rgba(251, 207, 60, 0.25), 0 0 40px rgba(245, 158, 11, 0.15);
          animation: goldSparkle 4s infinite ease-in-out;
        }

        @keyframes auroraGlow {
          0%, 100% { background-position: 0% 50%; box-shadow: 0 0 15px rgba(216, 180, 254, 0.4), 0 0 30px rgba(244, 114, 182, 0.2); }
          50% { background-position: 100% 50%; box-shadow: 0 0 25px rgba(216, 180, 254, 0.7), 0 0 40px rgba(244, 114, 182, 0.4); }
        }

        @keyframes goldSparkle {
          0%, 100% { box-shadow: 0 0 15px rgba(251, 207, 60, 0.25), 0 0 30px rgba(245, 158, 11, 0.1); filter: brightness(1); }
          50% { box-shadow: 0 0 25px rgba(251, 207, 60, 0.55), 0 0 45px rgba(245, 158, 11, 0.3); filter: brightness(1.05); }
        }
      `}</style>

      <div className={`max-w-[85%] px-6 py-4 wisp-font text-base cloud-bubble ${isUser ? "user-cloud" : "ai-cloud"}`}>
        {isUser && <span className="absolute -top-1 -left-1 text-xs animate-pulse">✨</span>}
        {!isUser && <span className="absolute -top-1 -right-1 text-xs animate-bounce">✨</span>}
        {!isUser && <span className="absolute -bottom-1 -left-1 text-[10px] opacity-70">✨</span>}
        
        <p className="leading-relaxed whitespace-pre-wrap font-medium">{message.content}</p>

        {message.videos && message.videos.length > 0 && (
          <div className="mt-4 pt-3 border-t border-yellow-500/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-yellow-300 mb-2 magic-glow">
              📜 Attached Grimoires:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {message.videos.map((vid: any, index: number) => {
                const videoId = vid?.id?.videoId || vid?.videoId || vid?.external_video_id;
                if (!videoId) return null;

                const videoTitle = vid?.snippet?.title || vid?.title || "Watch Tutorial";
                const thumbnailUrl = vid?.snippet?.thumbnails?.medium?.url || vid?.url || vid?.thumbnailUrl;

                return (
                  <a
                    key={videoId || index}
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-black/40 rounded-xl overflow-hidden hover:scale-105 border border-yellow-500/10 hover:border-yellow-400/40 transition-all duration-200"
                  >
                    {thumbnailUrl && (
                      <img src={thumbnailUrl} alt={videoTitle} className="w-full h-20 object-cover" />
                    )}
                    <p className="p-1.5 text-[11px] line-clamp-2 text-purple-200/90 leading-tight">
                      {videoTitle}
                    </p>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}