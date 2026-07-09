"use client";

import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface ChatWindowProps {
  onNavigate: (view: "landing" | "chat" | "wheel") => void;
}

export default function ChatWindow({ onNavigate }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Welcome to HobbyHaven, traveler. What grand passions shall we uncover tonight?", sender: "ai" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestionBubbles = [
    "✨ Low budget creative crafts",
    "🌿 Indoor botanical alchemy",
    "🎼 Digital soundscape composition"
  ];

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `The stars suggest you explore something magical matching your intent: "${text}". Perhaps try ancient potion brewing (or making gourmet loose-leaf herbal teas)!`,
        sender: "ai"
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-purple-950/10 border border-purple-500/10 rounded-2xl p-4 relative justify-between overflow-hidden">
      
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(30, 27, 75, 0.2); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(168, 85, 247, 0.3); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(244, 114, 182, 0.5); }
      `}</style>

      <div className="flex-1 overflow-y-auto pr-2 mb-2 custom-scroll space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm wisp-font italic ${msg.sender === "user" ? "bg-gradient-to-r from-pink-600/40 to-purple-600/40 border border-pink-500/30 text-pink-100 rounded-tr-none" : "bg-slate-900/60 border border-purple-500/20 text-purple-200 rounded-tl-none"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-900/40 border border-purple-500/10 text-purple-400 text-xs px-4 py-2 rounded-xl italic animate-pulse wisp-font">
              Reading cosmic signs...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {messages.length === 1 && !loading && (
        <div className="flex flex-wrap gap-2 mb-3 px-2 z-10 justify-start">
          {suggestionBubbles.map((bubble, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(bubble.replace(/✨|🌿|🎼 /g, ""))}
              className="wisp-font text-xs italic bg-purple-950/40 border border-purple-500/20 hover:border-pink-500/40 rounded-full px-3 py-1.5 text-purple-300 transition-all duration-300 hover:bg-purple-900/30 transform hover:-translate-y-0.5"
            >
              {bubble}
            </button>
          ))}
        </div>
      )}

      <div className="relative pt-12 mt-2 border-t border-purple-500/5">
        <button 
          onClick={() => onNavigate("wheel")}
          className="absolute -top-16 right-4 w-16 h-16 sm:w-20 sm:h-20 cursor-pointer select-none z-30 animate-bounce group transition-all active:scale-90 outline-none focus:outline-none"
          style={{ animationDuration: '4s' }}
          title="Teleport to Fate's Roulette!"
        >
          <img src="/cat-companion.png" alt="Chat Companion Familiar" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/60 text-[9px] tracking-wide text-yellow-200 px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap wisp-font italic">
            Spin Wheel! 🎡
          </span>
        </button>
        
        <ChatInput onSend={handleSendMessage} disabled={loading} />
      </div>

    </div>
  );
}