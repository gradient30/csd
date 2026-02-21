import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile, LEVEL_NAMES } from "@/lib/store";
import { NPC_PLAYERS } from "@/lib/ceremony";
import { Trophy, Medal, Crown } from "lucide-react";

// Simulate NPC growth each visit — deterministic per session via sessionStorage
function getSimulatedNPCs() {
  const key = "npc_session_seed";
  let seed = Number(sessionStorage.getItem(key));
  if (!seed) {
    seed = Date.now();
    sessionStorage.setItem(key, String(seed));
  }
  // Simple seeded pseudo-random
  const rand = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  return NPC_PLAYERS.map((npc, i) => {
    const fluctuation = Math.floor(rand(seed + i * 7) * 500) - 100; // -100 ~ +400
    const newIncense = Math.max(npc.incense + fluctuation, 100);
    // Recalc level
    const thresholds = [0, 100, 300, 600, 1000, 2000, 4000, 7000, 12000, 20000];
    let level = 0;
    for (let j = thresholds.length - 1; j >= 0; j--) {
      if (newIncense >= thresholds[j]) { level = j; break; }
    }
    return { ...npc, incense: newIncense, level };
  });
}

export default function LeaderboardPage() {
  const profile = getProfile();
  const [tab, setTab] = useState("daily");

  const allPlayers = useMemo(() => {
    const npcs = getSimulatedNPCs();
    const players = [
      ...(profile
        ? [{ name: profile.nickname, zodiac: profile.zodiac, profession: profile.profession, incense: profile.incense, level: profile.level, isUser: true }]
        : []),
      ...npcs.map((n) => ({ ...n, isUser: false })),
    ];
    return players.sort((a, b) => b.incense - a.incense);
  }, [profile]);

  const getRankIcon = (idx: number) => {
    if (idx === 0) return <Crown className="h-5 w-5 text-gold" />;
    if (idx === 1) return <Medal className="h-5 w-5 text-gold-light" />;
    if (idx === 2) return <Medal className="h-5 w-5 text-gold-dark" />;
    return <span className="text-sm text-muted-foreground">{idx + 1}</span>;
  };

  const PlayerRow = ({ player, idx }: { player: typeof allPlayers[0]; idx: number }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.03 }}
      className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
        player.isUser ? "border-gold/40 bg-gold/10" : "border-border bg-card"
      }`}
    >
      <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(idx)}</div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-medium ${player.isUser ? "text-gold" : "text-foreground"}`}>
            {player.name}
            {player.isUser && <span className="ml-1 text-xs text-gold-light">（你）</span>}
          </span>
          <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
            {LEVEL_NAMES[player.level]}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{player.zodiac}年 · {player.profession}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gold">{player.incense.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">香火</p>
      </div>
    </motion.div>
  );

  return (
    <div>
      <h2 className="mb-6 text-center text-2xl font-bold text-gold">
        <Trophy className="mr-2 inline h-6 w-6" />
        封神榜
      </h2>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="daily" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">当日榜</TabsTrigger>
          <TabsTrigger value="season" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">赛季榜</TabsTrigger>
          <TabsTrigger value="legend" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">传奇榜</TabsTrigger>
        </TabsList>

        {["daily", "season", "legend"].map((t) => (
          <TabsContent key={t} value={t} className="space-y-2 pt-4">
            {allPlayers.map((p, i) => <PlayerRow key={p.name} player={p} idx={i} />)}
          </TabsContent>
        ))}
      </Tabs>

      {!profile && (
        <div className="mt-6 rounded-xl border border-gold/20 bg-card p-6 text-center">
          <p className="text-muted-foreground">完成封神仪式后即可上榜！</p>
        </div>
      )}
    </div>
  );
}
