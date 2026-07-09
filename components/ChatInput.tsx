"use client";

import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
  }, [text]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full gap-3">
      <div 
        className="flex items-center flex-1 px-5 py-2 transition-all duration-300"
        style={{
          borderRadius: "30px",
          background: "rgba(30, 27, 75, 0.5)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(251, 207, 60, 0.2)",
          boxShadow: "0 0 15px rgba(147, 51, 234, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)"
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Whisper your heart's desires..."
          className="w-full bg-transparent border-none text-purple-100 placeholder-purple-300/30 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 wisp-font italic text-base py-0.5 resize-none overflow-y-auto min-h-[24px] max-h-32 leading-6 align-middle"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        />
      </div>

      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="h-11 px-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-white font-medium text-sm transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none wisp-font flex items-center justify-center gap-1 shrink-0 active:scale-95 hover:scale-103"
        style={{
          borderRadius: "50px",
          boxShadow: "0 0 15px rgba(244, 114, 182, 0.4)"
        }}
      >
        <span>Cast</span>
        <span className="text-xs">✨</span>
      </button>
    </form>
  );
}