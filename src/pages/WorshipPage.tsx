import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { addIncense, getProfile, updateTodayRecord, getTodayRecord } from "@/lib/store";
import { playBell, playCoin, playFirecracker, playDrum, playGong } from "@/lib/audio";
import { RIDDLES } from "@/lib/ceremony";
import { Flame, Coins, Sparkles, HelpCircle, Trash2 } from "lucide-react";

// Worship altar
function WorshipAltar() {
  const [particles, setParticles] = useState<Array<{ id: number; type: string; x: number }>>([]);
  const [score, setScore] = useState(getTodayRecord()?.worshipScore || 0);
  let pid = 0;

  const addParticle = (type: string) => {
    const newP = Array.from({ length: 6 }, () => ({
      id: pid++,
      type,
      x: 40 + Math.random() * 20,
    }));
    setParticles((prev) => [...prev, ...newP]);
    setTimeout(() => setParticles((prev) => prev.filter((p) => !newP.includes(p))), 2000);
  };

  const doAction = (action: string, points: number) => {
    const newScore = score + points;
    setScore(newScore);
    addIncense(points);
    updateTodayRecord({ worshipScore: newScore });
    if (action === "incense") { playBell(); addParticle("🔥"); }
    if (action === "gold") { playCoin(); addParticle("💰"); }
    if (action === "firecracker") { playFirecracker(); addParticle("🧨"); }
  };

  return (
    <div className="space-y-6">
      {/* Altar display */}
      <div className="relative flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-gold/20 bg-gradient-to-b from-crimson-dark to-background p-8">
        {/* Floating particles */}
        <AnimatePresence>
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: 0, x: `${p.x}%` }}
              animate={{ opacity: 0, y: -80 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute text-2xl"
              style={{ left: `${p.x}%` }}
            >
              {p.type}
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="text-6xl">🏛️</div>
        <p className="mt-2 text-sm text-gold-light/70">财神祭坛</p>
        <p className="mt-1 text-lg font-bold text-gold">今日香火：{score}</p>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-3">
        <Button onClick={() => doAction("incense", 5)} className="flex-col gap-1 bg-crimson py-6 text-foreground hover:bg-crimson-light">
          <span className="text-2xl">🕯️</span>
          <span className="text-xs">上香 +5</span>
        </Button>
        <Button onClick={() => doAction("gold", 10)} className="flex-col gap-1 bg-gold-dark py-6 text-foreground hover:bg-gold">
          <span className="text-2xl">💰</span>
          <span className="text-xs">供元宝 +10</span>
        </Button>
        <Button onClick={() => doAction("firecracker", 8)} className="flex-col gap-1 bg-crimson py-6 text-foreground hover:bg-crimson-light">
          <span className="text-2xl">🧨</span>
          <span className="text-xs">放鞭炮 +8</span>
        </Button>
      </div>
    </div>
  );
}

// Riddle game
function RiddleGame() {
  const [currentIdx, setCurrentIdx] = useState(Math.floor(Math.random() * RIDDLES.length));
  const [showAnswer, setShowAnswer] = useState(false);
  const [shaking, setShaking] = useState(false);

  const riddle = RIDDLES[currentIdx];

  const shakeSign = () => {
    setShaking(true);
    playDrum();
    setShowAnswer(false);
    setTimeout(() => {
      setShaking(false);
      setCurrentIdx(Math.floor(Math.random() * RIDDLES.length));
    }, 600);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <motion.div
          animate={shaking ? { rotate: [-5, 5, -5, 5, 0] } : {}}
          className="mb-4 inline-block text-6xl"
        >
          🎋
        </motion.div>
      </div>

      <div className="rounded-xl border border-gold/20 bg-card p-6 text-center">
        <p className="mb-2 text-xs text-muted-foreground">第 {currentIdx + 1} 签</p>
        <p className="mb-4 text-lg text-foreground">{riddle.question}</p>

        {showAnswer ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="mb-1 text-sm text-muted-foreground">答案</p>
            <p className="text-xl font-bold text-gold">{riddle.answer}</p>
          </motion.div>
        ) : (
          <p className="text-sm text-muted-foreground">提示：{riddle.hint}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button onClick={shakeSign} className="flex-1 bg-gold text-background hover:bg-gold-light">
          🎋 摇签
        </Button>
        <Button onClick={() => { setShowAnswer(true); playCoin(); }} variant="outline" className="flex-1 border-gold/30 text-gold">
          揭晓答案
        </Button>
      </div>
    </div>
  );
}

// Simple horse game
function HorseGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [horseY, setHorseY] = useState(50);
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(15);
  const horseYRef = useRef(50);
  const scoreRef = useRef(0);

  const startGame = useCallback(() => {
    setPlaying(true);
    setScore(0);
    scoreRef.current = 0;
    setCoins([]);
    setTimeLeft(15);
    setHorseY(50);
    horseYRef.current = 50;
    playGong();
  }, []);

  useEffect(() => {
    if (!playing) return;
    let coinId = 0;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setPlaying(false);
          clearInterval(interval);
          addIncense(scoreRef.current);
          updateTodayRecord({ horseGameScore: scoreRef.current });
          return 0;
        }
        return t - 1;
      });

      if (Math.random() > 0.4) {
        setCoins((prev) => [...prev, { id: coinId++, x: 100, y: 20 + Math.random() * 60 }]);
      }

      setCoins((prev) =>
        prev
          .map((c) => ({ ...c, x: c.x - 6 }))
          .filter((c) => {
            if (c.x < 18 && c.x > 2 && Math.abs(c.y - horseYRef.current) < 15) {
              playCoin();
              scoreRef.current += 1;
              setScore(scoreRef.current);
              return false;
            }
            return c.x > -5;
          })
      );
    }, 300);

    return () => clearInterval(interval);
  }, [playing]);

  return (
    <div className="space-y-4">
      <div
        className="relative h-[200px] cursor-pointer overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-r from-crimson-dark to-background"
        onClick={(e) => {
          if (!playing) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setHorseY(y);
          horseYRef.current = y;
        }}
      >
        {playing && (
          <>
            <div
              className="absolute text-3xl transition-all duration-200"
              style={{ left: "10%", top: `${horseY}%`, transform: "translateY(-50%)" }}
            >
              🐴
            </div>
            {coins.map((c) => (
              <div
                key={c.id}
                className="absolute text-xl transition-all duration-200"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                💰
              </div>
            ))}
            <div className="absolute right-2 top-2 rounded bg-background/80 px-3 py-1 text-sm font-bold text-gold">
              ⏱ {timeLeft}s | 💰 {score}
            </div>
          </>
        )}
        {!playing && (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-3xl">🐴💰</p>
            <p className="mt-2 text-sm text-muted-foreground">点击屏幕上下移动马，接住元宝！</p>
            {score > 0 && <p className="mt-1 text-gold">上次得分：{score}</p>}
          </div>
        )}
      </div>
      {!playing && (
        <Button onClick={startGame} className="w-full bg-gold text-background hover:bg-gold-light">
          🐴 开始飞马接元宝
        </Button>
      )}
    </div>
  );
}

// Sweep poverty game
function SweepGame() {
  const [items, setItems] = useState([
    { id: 1, text: "穷", x: 30, y: 40, swept: false },
    { id: 2, text: "霉", x: 50, y: 60, swept: false },
    { id: 3, text: "衰", x: 70, y: 30, swept: false },
    { id: 4, text: "厄", x: 40, y: 70, swept: false },
    { id: 5, text: "灾", x: 60, y: 50, swept: false },
  ]);
  const [score, setScore] = useState(0);

  const sweepItem = (id: number) => {
    playFirecracker();
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, swept: true } : it)));
    setScore((s) => s + 10);
    addIncense(10);
    updateTodayRecord({ sweepScore: score + 10 });
  };

  const allSwept = items.every((i) => i.swept);

  const reset = () => {
    setItems((prev) => prev.map((it) => ({ ...it, swept: false, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 })));
  };

  return (
    <div className="space-y-4">
      <div className="relative h-[250px] overflow-hidden rounded-xl border border-gold/20 bg-card">
        {/* Door exit indicator */}
        <div className="absolute right-0 top-0 flex h-full w-12 items-center justify-center border-l border-dashed border-gold/20 bg-gold/5 text-xs text-gold/50">
          🚪出门
        </div>

        <AnimatePresence>
          {items.map((item) =>
            !item.swept ? (
              <motion.button
                key={item.id}
                initial={{ scale: 1 }}
                exit={{ x: 200, opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.2 }}
                onClick={() => sweepItem(item.id)}
                className="absolute flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted text-lg font-bold text-crimson"
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
              >
                {item.text}
              </motion.button>
            ) : null
          )}
        </AnimatePresence>

        {allSwept && (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="flex h-full flex-col items-center justify-center">
            <p className="text-3xl">🎉</p>
            <p className="mt-2 font-bold text-gold">穷运已除！福运来！</p>
          </motion.div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">点击扫除穷字 | 得分：{score}</p>
        <Button onClick={reset} variant="outline" size="sm" className="border-gold/30 text-gold">
          重新来
        </Button>
      </div>
    </div>
  );
}

export default function WorshipPage() {
  const profile = getProfile();

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-2xl">🏛️</p>
        <p className="mt-4 text-muted-foreground">请先完成封神仪式</p>
        <Button onClick={() => window.location.href = "/temple/ceremony"} className="mt-4 bg-gold text-background">
          去封神
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gold">每日祭拜</h2>
      <Tabs defaultValue="worship" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-muted">
          <TabsTrigger value="worship" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">祭拜台</TabsTrigger>
          <TabsTrigger value="riddle" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">摇签</TabsTrigger>
          <TabsTrigger value="horse" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">飞马</TabsTrigger>
          <TabsTrigger value="sweep" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">送穷</TabsTrigger>
        </TabsList>
        <TabsContent value="worship"><WorshipAltar /></TabsContent>
        <TabsContent value="riddle"><RiddleGame /></TabsContent>
        <TabsContent value="horse"><HorseGame /></TabsContent>
        <TabsContent value="sweep"><SweepGame /></TabsContent>
      </Tabs>
    </div>
  );
}
