import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addIncense, getProfile, updateTodayRecord, getTodayRecord, unlockRandomCard, checkBadges } from "@/lib/store";
import { playBell, playCoin, playFirecracker, playDrum, playGong, playSuccess } from "@/lib/audio";
import { RIDDLES, CARD_BACKGROUNDS } from "@/lib/ceremony";
import { toast } from "sonner";

function notifyCardUnlock(cardId: string | null) {
  if (!cardId) return;
  const card = CARD_BACKGROUNDS.find((c) => c.id === cardId);
  if (card) toast.success(`🃏 解锁新卡：${card.name}！`, { duration: 3000 });
}

function notifyBadges(newBadges: string[]) {
  if (newBadges.length === 0) return;
  // checkBadges already imported BADGE_DEFS but we keep it simple
  newBadges.forEach((id) => toast.success(`🏅 获得新徽章！`, { duration: 2500 }));
}

// Worship altar
function WorshipAltar() {
  const [particles, setParticles] = useState<Array<{ id: number; type: string; x: number }>>([]);
  const [score, setScore] = useState(getTodayRecord()?.worshipScore || 0);
  let pid = 0;

  const addParticle = (type: string) => {
    const newP = Array.from({ length: 3 }, () => ({
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

    // Card unlock: first time worship >= 50
    if (newScore >= 50 && score < 50) {
      notifyCardUnlock(unlockRandomCard());
    }
    notifyBadges(checkBadges());
  };

  return (
    <div className="space-y-6">
      <div className="relative flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-gold/20 bg-gradient-to-b from-crimson-dark to-background p-8">
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

// Hint system helpers
function getHintState(): { date: string; count: number } {
  const date = localStorage.getItem("caishen_hint_date") || "";
  const count = parseInt(localStorage.getItem("caishen_hint_count") || "3");
  const today = new Date().toISOString().split("T")[0];
  if (date !== today) {
    localStorage.setItem("caishen_hint_date", today);
    localStorage.setItem("caishen_hint_count", "3");
    return { date: today, count: 3 };
  }
  return { date, count };
}

function useHintCount() {
  const hintState = getHintState();
  return parseInt(localStorage.getItem("caishen_hint_count") || String(hintState.count));
}

// Riddle game
function RiddleGame() {
  const [currentIdx, setCurrentIdx] = useState(Math.floor(Math.random() * RIDDLES.length));
  const [showAnswer, setShowAnswer] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [riddleScore, setRiddleScore] = useState(getTodayRecord()?.riddlesSolved || 0);
  const [hintRemaining, setHintRemaining] = useState(useHintCount);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [peekedAnswer, setPeekedAnswer] = useState(false);

  const riddle = RIDDLES[currentIdx];

  const shakeSign = () => {
    setShaking(true);
    playDrum();
    setShowAnswer(false);
    setUserAnswer("");
    setResult(null);
    setPeekedAnswer(false);
    setTimeout(() => {
      setShaking(false);
      setCurrentIdx(Math.floor(Math.random() * RIDDLES.length));
    }, 600);
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) return;
    const correct = userAnswer.trim() === riddle.answer.trim();
    setResult(correct ? "correct" : "wrong");
    setShowAnswer(true);
    if (correct && !peekedAnswer) {
      playSuccess();
      const newScore = riddleScore + 1;
      setRiddleScore(newScore);
      addIncense(15);
      updateTodayRecord({ riddlesSolved: newScore });
      if (newScore >= 5 && riddleScore < 5) {
        notifyCardUnlock(unlockRandomCard());
      }
      notifyBadges(checkBadges());
    } else if (correct && peekedAnswer) {
      playSuccess();
      toast.info("看过答案不计分哦～", { duration: 2000 });
    } else {
      playBell();
    }
  };

  const peekAnswer = () => {
    if (hintRemaining <= 0) return;
    const newCount = hintRemaining - 1;
    setHintRemaining(newCount);
    localStorage.setItem("caishen_hint_count", String(newCount));
    setPeekedAnswer(true);
    setShowAnswer(true);
    setResult(null);
  };

  const handleShare = () => {
    const newCount = hintRemaining + 10;
    setHintRemaining(newCount);
    localStorage.setItem("caishen_hint_count", String(newCount));
    setShowShareDialog(false);
    toast.success("🎉 分享成功！+10次看答案机会", { duration: 2500 });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">已答对：{riddleScore} 题</p>
        <p className="text-sm font-bold text-gold">累计香火 +{riddleScore * 15}</p>
      </div>
      <div className="text-center">
        <motion.div animate={shaking ? { rotate: [-5, 5, -5, 5, 0] } : {}} className="mb-4 inline-block text-6xl">
          🎋
        </motion.div>
      </div>
      <div className="rounded-xl border border-gold/20 bg-card p-6 text-center">
        <p className="mb-2 text-xs text-muted-foreground">第 {currentIdx + 1} 签（共 {RIDDLES.length} 签）</p>
        <p className="mb-4 text-lg text-foreground">{riddle.question}</p>
        <p className="mb-4 text-sm text-muted-foreground">提示：{riddle.hint}</p>
        {!showAnswer ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                placeholder="输入你的答案…"
                className="border-gold/30 bg-background text-center"
              />
              <Button onClick={submitAnswer} className="bg-gold text-background hover:bg-gold-light">提交</Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={peekAnswer}
                disabled={hintRemaining <= 0}
                className="text-xs text-muted-foreground hover:text-gold"
              >
                👁️ 看答案（剩余 {hintRemaining} 次）
              </Button>
              {hintRemaining <= 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareDialog(true)}
                  className="text-xs text-gold hover:text-gold-light"
                >
                  📤 分享 +10次
                </Button>
              )}
            </div>
          </div>
        ) : peekedAnswer && result === null ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="rounded-lg bg-gold/10 p-3">
              <p className="text-sm text-muted-foreground">👁️ 答案是：</p>
              <p className="mt-1 text-xl font-bold text-gold">{riddle.answer}</p>
              <p className="mt-2 text-xs text-muted-foreground">（看过答案不计分）</p>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {result === "correct" ? (
              <div className="rounded-lg bg-green-900/30 p-3">
                <p className="text-lg font-bold text-green-400">🎉 答对了！{peekedAnswer ? "（不计分）" : "+15 香火"}</p>
                <p className="mt-1 text-gold">{riddle.answer}</p>
              </div>
            ) : (
              <div className="rounded-lg bg-crimson/20 p-3">
                <p className="text-sm text-crimson-light">❌ 不对哦～正确答案是：</p>
                <p className="mt-1 text-xl font-bold text-gold">{riddle.answer}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
      <Button onClick={shakeSign} className="w-full bg-gold text-background hover:bg-gold-light">🎋 摇下一签</Button>

      {/* Share dialog */}
      {showShareDialog && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl border border-gold/30 bg-card p-5 text-center"
        >
          <p className="text-lg font-bold text-gold">📤 分享到朋友圈</p>
          <p className="mt-2 text-sm text-muted-foreground">
            分享后可获得额外10次看答案机会！
          </p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => setShowShareDialog(false)} className="flex-1 border-border">取消</Button>
            <Button onClick={handleShare} className="flex-1 bg-gold text-background hover:bg-gold-light">✅ 我已分享</Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Horse game
function HorseGame() {
  const [playing, setPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [horseY, setHorseY] = useState(50);
  const [coins, setCoins] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const horseYRef = useRef(50);
  const scoreRef = useRef(0);
  const playingRef = useRef(false);

  const startGame = useCallback(() => {
    setPlaying(true);
    playingRef.current = true;
    setScore(0);
    scoreRef.current = 0;
    setCoins([]);
    setTimeLeft(20);
    setHorseY(50);
    horseYRef.current = 50;
    playGong();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          playingRef.current = false;
          setPlaying(false);
          const finalScore = scoreRef.current;
          addIncense(finalScore * 2);
          updateTodayRecord({ horseGameScore: finalScore });
          // Card unlock at 10+
          if (finalScore >= 10) {
            notifyCardUnlock(unlockRandomCard());
          }
          notifyBadges(checkBadges({ horseScore: finalScore }));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    let coinId = 0;
    const gameLoop = setInterval(() => {
      if (!playingRef.current) return;
      if (Math.random() > 0.5) {
        setCoins((prev) => [...prev, { id: coinId++, x: 100, y: 10 + Math.random() * 75 }]);
      }
      setCoins((prev) =>
        prev
          .map((c) => ({ ...c, x: c.x - 4 }))
          .filter((c) => {
            if (c.x < 18 && c.x > 2 && Math.abs(c.y - horseYRef.current) < 14) {
              playCoin();
              scoreRef.current += 1;
              setScore(scoreRef.current);
              return false;
            }
            return c.x > -5;
          })
      );
    }, 250);
    return () => clearInterval(gameLoop);
  }, [playing]);

  return (
    <div className="space-y-4">
      <div
        className="relative h-[220px] cursor-pointer overflow-hidden rounded-xl border border-gold/20 bg-gradient-to-r from-crimson-dark to-background"
        onClick={(e) => {
          if (!playing) return;
          const rect = e.currentTarget.getBoundingClientRect();
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setHorseY(Math.max(5, Math.min(90, y)));
          horseYRef.current = Math.max(5, Math.min(90, y));
        }}
      >
        {playing && (
          <>
            <div className="absolute text-3xl transition-all duration-150" style={{ left: "10%", top: `${horseY}%`, transform: "translateY(-50%)" }}>🐴</div>
            {coins.map((c) => (
              <div key={c.id} className="absolute text-xl" style={{ left: `${c.x}%`, top: `${c.y}%` }}>💰</div>
            ))}
            <div className="absolute left-1/2 top-2 -translate-x-1/2 rounded-lg bg-background/90 px-4 py-1.5 text-sm font-bold">
              <span className="text-crimson">⏱ {timeLeft}s</span>
              <span className="mx-2 text-muted-foreground">|</span>
              <span className="text-gold">💰 {score} 枚</span>
            </div>
          </>
        )}
        {!playing && (
          <div className="flex h-full flex-col items-center justify-center">
            <p className="text-4xl">🐴💰</p>
            <p className="mt-2 text-sm text-muted-foreground">点击屏幕上下移动马，接住元宝！</p>
            <p className="mt-1 text-xs text-muted-foreground">每局 20 秒，每个元宝 +2 香火</p>
            {score > 0 && <p className="mt-1 font-bold text-gold">上次得分：{score} 枚</p>}
          </div>
        )}
      </div>
      {!playing && (
        <Button onClick={startGame} className="w-full bg-gold text-background hover:bg-gold-light">🐴 开始飞马接元宝</Button>
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
  const [totalIncense, setTotalIncense] = useState(0);
  const [rounds, setRounds] = useState(0);

  const sweepItem = (id: number) => {
    playFirecracker();
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, swept: true } : it)));
    const newScore = score + 10;
    setScore(newScore);
    setTotalIncense((t) => t + 10);
    addIncense(10);
    updateTodayRecord({ sweepScore: newScore });
  };

  const allSwept = items.every((i) => i.swept);

  useEffect(() => {
    if (allSwept && score > 0) {
      const newRounds = rounds + 1;
      setRounds(newRounds);
      notifyBadges(checkBadges({ sweepRounds: 1 }));
    }
  }, [allSwept]);

  const reset = () => {
    setItems((prev) => prev.map((it) => ({ ...it, swept: false, x: 20 + Math.random() * 60, y: 20 + Math.random() * 60 })));
    setScore(0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg bg-gold/10 px-4 py-2">
        <p className="text-sm text-foreground">本轮得分：<span className="font-bold text-gold">{score}</span></p>
        <p className="text-sm text-foreground">累计香火：<span className="font-bold text-gold">+{totalIncense}</span></p>
      </div>
      <div className="relative h-[250px] overflow-hidden rounded-xl border border-gold/20 bg-card">
        <div className="absolute right-0 top-0 flex h-full w-12 items-center justify-center border-l border-dashed border-gold/20 bg-gold/5 text-xs text-gold/50">🚪出门</div>
        <AnimatePresence>
          {items.map((item) =>
            !item.swept ? (
              <motion.button
                key={item.id}
                initial={{ scale: 1 }}
                exit={{ x: 200, opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
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
            <p className="text-4xl">🎉</p>
            <p className="mt-2 text-lg font-bold text-gold">穷运已除！福运来！</p>
            <p className="mt-1 text-sm text-muted-foreground">获得 {score} 香火值</p>
          </motion.div>
        )}
      </div>
      <div className="flex gap-3">
        <p className="flex-1 self-center text-sm text-muted-foreground">👆 点击扫除穷字，每个 +10 香火</p>
        <Button onClick={reset} variant="outline" size="sm" className="border-gold/30 text-gold">🔄 重新来</Button>
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
        <Button onClick={() => window.location.href = "/temple/ceremony"} className="mt-4 bg-gold text-background">去封神</Button>
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
