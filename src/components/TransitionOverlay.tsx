import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Theme {
  name: string;
  emojis: string[];
  title: string;
  subtitle: string;
  bgClass: string;
}

const THEMES: Theme[] = [
  { name: "金元宝雨", emojis: ["💰", "🥇", "💎", "💰", "🪙"], title: "金元宝雨！", subtitle: "财源滚滚来...", bgClass: "bg-gold-dark/95" },
  { name: "鞭炮漫天", emojis: ["🧨", "🎆", "🎇", "💥", "✨"], title: "炮竹齐鸣！", subtitle: "爆竹声中辞旧岁...", bgClass: "bg-crimson-dark/95" },
  { name: "五路神驾到", emojis: ["👑", "⭐", "🌟", "✨", "💫"], title: "五路财神驾到！", subtitle: "恭迎五路财神...", bgClass: "bg-crimson-dark/95" },
  { name: "祥云马队", emojis: ["🐴", "☁️", "🐎", "🏇", "☁️"], title: "骏马奔腾！", subtitle: "马到成功...", bgClass: "bg-ink/95" },
  { name: "黑虎啸天", emojis: ["🐯", "🐅", "⚡", "🌙", "💨"], title: "黑虎啸天！", subtitle: "虎啸财来...", bgClass: "bg-ink-dark/95" },
  { name: "铜钱飞舞", emojis: ["🪙", "🪙", "💫", "🪙", "✨"], title: "铜钱飞舞！", subtitle: "财运亨通...", bgClass: "bg-gold-dark/95" },
  { name: "灯笼高挂", emojis: ["🏮", "🏮", "🎊", "🏮", "🎉"], title: "灯笼高挂！", subtitle: "红红火火...", bgClass: "bg-crimson/95" },
  { name: "福字翻转", emojis: ["🧧", "福", "🧧", "福", "🎊"], title: "福运到！", subtitle: "福到运到财到...", bgClass: "bg-crimson-dark/95" },
];

export const TransitionOverlay = () => {
  const theme = useMemo(() => THEMES[Math.floor(Math.random() * THEMES.length)], []);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string; delay: number }>>([]);

  useEffect(() => {
    const p = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      emoji: theme.emojis[Math.floor(Math.random() * theme.emojis.length)],
      delay: Math.random() * 0.5,
    }));
    setParticles(p);
  }, [theme]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center ${theme.bgClass}`}
    >
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

      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        className="text-center"
      >
        <p className="text-4xl font-black text-gold sm:text-5xl" style={{ textShadow: "0 0 40px hsl(45 100% 50% / 0.6)" }}>
          {theme.title}
        </p>
        <p className="mt-2 text-lg text-gold-light/70">{theme.subtitle}</p>
      </motion.div>
    </motion.div>
  );
};
