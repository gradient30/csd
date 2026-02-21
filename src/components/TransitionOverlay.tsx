import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const effects = ["💰", "🧨", "☁️", "🐴", "🎆"];

export const TransitionOverlay = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: effects[Math.floor(Math.random() * effects.length)],
      delay: Math.random() * 0.5,
    }));
    setParticles(p);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-crimson-dark/95"
    >
      {/* Burst particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0, x: "50vw", y: "50vh" }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0.5],
            x: `${p.x}vw`,
            y: `${p.y}vh`,
          }}
          transition={{ duration: 1.2, delay: p.delay, ease: "easeOut" }}
          className="absolute text-2xl sm:text-3xl"
        >
          {p.emoji}
        </motion.div>
      ))}

      {/* Center text */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="text-center"
      >
        <p className="text-4xl font-black text-gold sm:text-5xl" style={{ textShadow: "0 0 40px hsl(45 100% 50% / 0.6)" }}>
          财神驾到！
        </p>
        <p className="mt-2 text-lg text-gold-light/70">恭迎五路财神...</p>
      </motion.div>
    </motion.div>
  );
};
