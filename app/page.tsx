"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "chat" | "wheel">("landing");
  const [previousView, setPreviousView] = useState<"landing" | "chat" | "wheel">("landing");
  
  const [isGlittering, setIsGlittering] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [transforms, setTransforms] = useState({
    moon: { x: 0, y: 0 },
    cat: { x: 0, y: 0 },
    buttons: { x: 0, y: 0 },
    title: { x: 0, y: 0 }
  });

  useEffect(() => {
    audioRef.current = new Audio("/cosmic-music.mp3");
    audioRef.current.loop = true;
    return () => { audioRef.current?.pause(); };
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (currentView !== "landing") return;

    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    const offsetX = (clientX - innerWidth / 2) / (innerWidth / 2);
    const offsetY = (clientY - innerHeight / 2) / (innerHeight / 2);

    const moonPower = 15; 
    const catPower = 8;
    const buttonPower = 6;
    const titlePower = 3; 

    setTransforms({
      moon: { x: offsetX * moonPower, y: offsetY * moonPower },
      cat: { x: offsetX * catPower, y: offsetY * catPower },
      buttons: { x: offsetX * buttonPower, y: offsetY * buttonPower },
      title: { x: offsetX * titlePower, y: offsetY * titlePower },
    });
  };

  const resetTransforms = () => {
    setTransforms({ moon: { x: 0, y: 0 }, cat: { x: 0, y: 0 }, buttons: { x: 0, y: 0 }, title: { x: 0, y: 0 } });
  };

  const toggleMoonMagic = () => {
    if (!audioRef.current) return;
    if (isGlittering) {
      audioRef.current.pause();
      setIsGlittering(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsGlittering(true);
    }
  };

  const spinFatesWheel = () => {
    if (wheelSpinning) return;
    resetTransforms(); 
    setWheelSpinning(true);
    setWheelResult(null);

    const cosmicOutcomes = [
      "🌌 Low Budget Starry Room Crafting",
      "🎨 Astral Canvas Painting & Tea Rituals",
      "🌿 Ancient Bonsai & Herb Alchemy",
      "✍️ Mythic Lore Writing & Calligraphy",
      "🎼 Ambient Synthesis & Synth Soundscapes"
    ];

    setTimeout(() => {
      setWheelResult(cosmicOutcomes[Math.floor(Math.random() * cosmicOutcomes.length)]);
      setWheelSpinning(false);
    }, 3500);
  };

  const navigateTo = (view: "landing" | "chat" | "wheel") => {
    resetTransforms();
    setPreviousView(currentView); 
    setCurrentView(view);
  };

  const handleBackAction = () => {
    resetTransforms();
    if (currentView === "wheel" && previousView === "chat") {
      setCurrentView("chat");
      setPreviousView("landing");
    } else if (currentView === "chat" && previousView === "wheel") {
      setCurrentView("wheel");
      setPreviousView("landing");
    } else {
      setCurrentView("landing");
    }
  };

  const getYouTubeLink = (text: string) => {
    const cleanSearchQuery = encodeURIComponent(text.replace(/🌌|🎨|🌿|✍️|🎼 /g, "") + " tutorial guide");
    return `https://www.youtube.com/results?search_query=${cleanSearchQuery}`;
  };

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-purple-100 flex flex-col items-center px-4 py-6 sm:py-10 relative overflow-hidden selection:bg-purple-500 selection:text-white"
      onMouseMove={handleMouseMove} 
    >
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');
        
        .wisp-font { font-family: 'Playfair Display', serif; }
        .magic-glow { text-shadow: 0 0 10px rgba(216, 180, 254, 0.5); }
        
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .moon-button {
          transition: transform 0.1s ease-out, filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 15px rgba(244, 114, 182, 0.2));
        }
        .moon-button.active { filter: drop-shadow(0 0 35px rgba(244, 114, 182, 0.6)); }

        .glitter-particle {
          position: absolute;
          background: radial-gradient(circle, #fff 0%, rgba(244,114,182,0.8) 50%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
          animation: fallingGlitter linear infinite;
        }
        @keyframes fallingGlitter {
          0% { transform: translateY(-20px) scale(0); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(105vh) scale(1); opacity: 0; }
        }

        .animated-title {
          background-image: linear-gradient(to right, #f472b6, #d8b4fe, #818cf8, #f472b6);
          background-size: 300% auto;
          animation: shine 6s linear infinite;
        }
        @keyframes shine { to { background-position: 300% center; } }

        .glowing-portal-btn {
          position: relative;
          background: rgba(30, 27, 75, 0.25);
          border: 1px solid rgba(251, 191, 36, 0.1);
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.15), 0 0 5px rgba(245, 158, 11, 0.1);
          transition: transform 0.1s ease-out, scale 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, box-shadow 0.4s ease;
          animation: goldenPulse 6s infinite ease-in-out;
        }
        @keyframes goldenPulse {
          0%, 100% { box-shadow: 0 0 15px rgba(251, 191, 36, 0.15), 0 0 5px rgba(245, 158, 11, 0.1); }
          50% { box-shadow: 0 0 25px rgba(251, 191, 36, 0.35), 0 0 10px rgba(245, 158, 11, 0.2); }
        }
        .glowing-portal-btn:hover {
          scale: 1.04; 
          background: rgba(49, 46, 129, 0.5);
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.4), 0 0 30px rgba(251, 191, 36, 0.5);
          border-color: rgba(251, 191, 36, 0.4);
        }

        .spinning-wheel { animation: spin 0.6s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .translate-smooth { will-change: transform; }

        .pretty-back-btn {
          background: rgba(30, 27, 75, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(251, 207, 60, 0.2);
          box-shadow: 0 0 10px rgba(251, 207, 60, 0.05);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .pretty-back-btn:hover {
          background: rgba(244, 114, 182, 0.15);
          border-color: rgba(244, 114, 182, 0.5);
          box-shadow: 0 0 15px rgba(244, 114, 182, 0.3);
          color: #fff;
        }
      `}</style>

      {isGlittering && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {[...Array(45)].map((_, i) => (
            <div key={i} className="glitter-particle" style={{ left: `${Math.random() * 100}%`, width: `${2 + Math.random() * 5}px`, height: `${2 + Math.random() * 5}px`, animationDuration: `${2.5 + Math.random() * 3.5}s`, animationDelay: `${Math.random() * -5}s` }} />
          ))}
        </div>
      )}

      <div className="w-full max-w-4xl flex flex-col z-10 h-full flex-1">
        <header 
          className="mb-4 border-b border-purple-500/10 pb-4 flex items-center justify-between relative translate-smooth select-none"
          style={{ transform: `translate(${transforms.title.x}px, ${transforms.title.y}px)` }}
        >
          <div>
            <p className="wisp-font text-[10px] uppercase tracking-[0.25em] text-pink-300 magic-glow mb-0.5">
              ✨ HobbyHour ✨
            </p>
            <h1 className="wisp-font text-3xl font-semibold bg-clip-text text-transparent animated-title magic-glow italic">
              HobbyHour
            </h1>
          </div>

          <div className="flex items-center">
            {currentView !== "landing" ? (
              <button 
                onClick={handleBackAction}
                className="pretty-back-btn wisp-font flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-medium text-purple-200 active:scale-95 outline-none focus:outline-none"
              >
                <span>✨</span> <span>Go Back</span>
              </button>
            ) : (
              <button 
                onClick={toggleMoonMagic}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 moon-button translate-smooth ${isGlittering ? 'active' : ''}`}
                style={{ transform: `translate(${transforms.moon.x}px, ${transforms.moon.y}px) rotate(${transforms.moon.x * 0.2}deg)` }}
              >
                <img src="/moon.png" alt="Magic Moon" className="w-full h-full object-contain" />
              </button>
            )}
          </div>
        </header>

        <div className="fade-in flex-1 flex flex-col">
          {currentView === "landing" && (
            <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 py-4">
              <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center pointer-events-none translate-smooth" style={{ transform: `translate(${transforms.cat.x}px, ${transforms.cat.y}px)` }}>
                <img src="/cat-landing.png" alt="Cat Mage" className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_20px_rgba(147,51,234,0.2)]" />
              </div>
              <div className="flex flex-col gap-4 w-full max-w-sm translate-smooth" style={{ transform: `translate(${transforms.buttons.x}px, ${transforms.buttons.y}px)` }}>
                <button onClick={() => navigateTo("chat")} className="w-full text-center py-4 rounded-xl glowing-portal-btn shadow-md">
                  <h3 className="wisp-font text-base font-semibold text-pink-200 tracking-wide">Chat</h3>
                </button>
                <button onClick={() => navigateTo("wheel")} className="w-full text-center py-4 rounded-xl glowing-portal-btn shadow-md">
                  <h3 className="wisp-font text-base font-semibold text-yellow-200 tracking-wide">Fate's Roulette</h3>
                </button>
              </div>
            </div>
          )}

          {currentView === "chat" && <div className="h-[74vh]"><ChatWindow onNavigate={navigateTo} /></div>}

          {currentView === "wheel" && (
            <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto text-center py-6 gap-6 bg-purple-950/20 border border-purple-500/20 rounded-2xl shadow-xl p-8 min-h-[65vh] my-auto relative">
              <button onClick={() => navigateTo("chat")} className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 cursor-pointer select-none z-30 animate-bounce group transition-all active:scale-95 outline-none focus:outline-none">
                <img src="/cat-companion.png" alt="Companion Cat" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(168,85,247,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(244,114,182,0.8)]" />
              </button>

              <h2 className="wisp-font text-3xl font-semibold text-pink-200 mb-2">Fate's Roulette</h2>
              
              <div 
                className={`w-48 h-48 sm:w-64 sm:h-64 rounded-full border-8 border-purple-900 flex items-center justify-center relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.3)] ${wheelSpinning ? 'spinning-wheel' : ''}`}
                style={{ 
                  background: `conic-gradient(
                    #7e22ce 0deg 72deg, 
                    #c026d3 72deg 144deg, 
                    #8b5cf6 144deg 216deg, 
                    #4f46e5 216deg 288deg, 
                    #a855f7 288deg 360deg
                  )` 
                }}
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full border-4 border-purple-950 z-10 shadow-lg"></div>
                <div className="absolute inset-0 border-8 border-purple-900 rounded-full opacity-30"></div>
              </div>

              <button 
                onClick={spinFatesWheel}
                disabled={wheelSpinning}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-semibold transition-all disabled:opacity-50"
              >
                {wheelSpinning ? "Spinning..." : "Spin the Wheel"}
              </button>

              {wheelResult && (
                <div className="mt-4 p-4 bg-purple-900/40 rounded-xl border border-purple-400/30 animate-pulse">
                  <p className="text-lg font-medium text-white mb-3">{wheelResult}</p>
                  <a 
                    href={getYouTubeLink(wheelResult)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-pink-300 underline hover:text-pink-100"
                  >
                    Watch Tutorial
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}