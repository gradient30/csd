import { memo, useMemo } from "react";

export const GoldParticles = memo(() => {
  const coins = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 12 + Math.random() * 16,
        opacity: 0.15 + Math.random() * 0.25,
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {coins.map((c) => (
        <div
          key={c.id}
          className="animate-coin-fall absolute text-gold"
          style={{
            left: `${c.left}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            fontSize: `${c.size}px`,
            opacity: c.opacity,
          }}
        >
          💰
        </div>
      ))}
    </div>
  );
});

GoldParticles.displayName = "GoldParticles";
