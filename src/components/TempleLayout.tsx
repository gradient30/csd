import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Flame, Trophy, Home, BookOpen, Volume2, VolumeX, ArrowLeft } from "lucide-react";
import { isMuted, setMuted } from "@/lib/audio";
import { useState } from "react";
import { GoldParticles } from "@/components/GoldParticles";

const tabs = [
  { path: "/temple/ceremony", label: "封神仪式", icon: Sparkles },
  { path: "/temple/worship", label: "每日祭拜", icon: Flame },
  { path: "/temple/leaderboard", label: "封神榜", icon: Trophy },
  { path: "/temple/sanctuary", label: "我的道场", icon: Home },
  { path: "/temple/collection", label: "图鉴", icon: BookOpen },
];

export default function TempleLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [muted, setMutedState] = useState(isMuted());

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-ink-light to-background">
      <GoldParticles />

      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> 首页
          </button>
          <h1 className="text-lg font-bold text-gold">财神封神殿</h1>
          <button onClick={toggleMute} className="p-2 text-gold/70 hover:text-gold">
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* Tab navigation */}
        <nav className="mx-auto max-w-5xl overflow-x-auto">
          <div className="flex min-w-max px-2 pb-1">
            {tabs.map((tab) => {
              const active = location.pathname === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-gold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {active && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
