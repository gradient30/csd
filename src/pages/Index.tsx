import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { playDrum, playFirecracker, playGong } from "@/lib/audio";
import { Sparkles, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { isMuted, setMuted } from "@/lib/audio";
import { GoldParticles } from "@/components/GoldParticles";
import { OriginCards } from "@/components/OriginCards";
import { TransitionOverlay } from "@/components/TransitionOverlay";

const Index = () => {
  const navigate = useNavigate();
  const [showTransition, setShowTransition] = useState(false);
  const [muted, setMutedState] = useState(isMuted());

  const handleCTA = useCallback(() => {
    playDrum();
    setTimeout(() => playFirecracker(), 200);
    setTimeout(() => playGong(), 500);
    setShowTransition(true);
    setTimeout(() => {
      navigate("/temple/ceremony");
    }, 1800);
  }, [navigate]);

  const toggleMute = () => {
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-crimson-dark via-crimson to-crimson-dark">
      {/* Gold particles background */}
      <GoldParticles />

      {/* Floating clouds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-cloud-drift absolute opacity-10"
            style={{
              top: `${15 + i * 25}%`,
              animationDuration: `${25 + i * 10}s`,
              animationDelay: `${i * 5}s`,
            }}
          >
            <svg width="200" height="80" viewBox="0 0 200 80" fill="currentColor" className="text-gold">
              <ellipse cx="60" cy="50" rx="60" ry="25" />
              <ellipse cx="100" cy="40" rx="50" ry="30" />
              <ellipse cx="140" cy="50" rx="55" ry="22" />
            </svg>
          </div>
        ))}
      </div>

      {/* Sound toggle */}
      <button
        onClick={toggleMute}
        className="fixed right-4 top-4 z-50 rounded-full bg-background/30 p-3 backdrop-blur-sm transition-colors hover:bg-background/50"
        aria-label={muted ? "开启音效" : "关闭音效"}
      >
        {muted ? <VolumeX className="h-5 w-5 text-gold" /> : <Volume2 className="h-5 w-5 text-gold" />}
      </button>

      {/* Hero Section */}
      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Decorative top border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-8 h-[2px] w-64 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        {/* Horse emoji decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="animate-horse-gallop mb-4 text-5xl"
        >
          🐴
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-3 text-4xl font-black tracking-wider text-gold sm:text-5xl md:text-6xl"
          style={{ textShadow: "0 0 30px hsl(45 100% 50% / 0.4), 0 2px 4px rgba(0,0,0,0.5)" }}
        >
          丙午马年·抢路头！
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-8 text-lg text-gold-light/80 sm:text-xl"
        >
          正月初五，接五路财神，马到成功！
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCTA}
          className="animate-glow-pulse group relative overflow-hidden rounded-xl border-2 border-gold/60 bg-gradient-to-r from-gold-dark via-gold to-gold-dark px-8 py-4 text-lg font-bold text-background transition-all sm:text-xl"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            马上去抢路头！叩拜封神
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </span>
          <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </motion.button>

        {/* Decorative bottom border */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="mt-8 h-[2px] w-64 bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="animate-float absolute bottom-8 text-gold/50"
        >
          <p className="mb-2 text-sm">下滑了解渊源</p>
          <div className="mx-auto h-8 w-5 rounded-full border-2 border-gold/30 p-1">
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-2 w-1.5 rounded-full bg-gold/50"
            />
          </div>
        </motion.div>
      </section>

      {/* Origin Cards Section */}
      <OriginCards />

      {/* Second CTA at bottom */}
      <section className="relative z-10 pb-20 pt-10 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCTA}
          className="animate-glow-pulse rounded-xl border-2 border-gold/60 bg-gradient-to-r from-gold-dark via-gold to-gold-dark px-8 py-4 text-lg font-bold text-background"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            即刻封神，马到成功！
          </span>
        </motion.button>
      </section>

      {/* Transition overlay */}
      <AnimatePresence>
        {showTransition && <TransitionOverlay />}
      </AnimatePresence>
    </div>
  );
};

export default Index;
