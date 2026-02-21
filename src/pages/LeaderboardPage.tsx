import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProfile, LEVEL_NAMES, getTodayIncense, ZODIAC_LIST, PROFESSIONS } from "@/lib/store";
import { NPC_PLAYERS } from "@/lib/ceremony";
import { Trophy, Medal, Crown, Filter } from "lucide-react";

function getSimulatedNPCs() {
  const key = "npc_session_seed";
  let seed = Number(sessionStorage.getItem(key));
  if (!seed) {
    seed = Date.now();
    sessionStorage.setItem(key, String(seed));
  }
  const rand = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  return NPC_PLAYERS.map((npc, i) => {
    const fluctuation = Math.floor(rand(seed + i * 7) * 500) - 100;
    const newIncense = Math.max(npc.incense + fluctuation, 100);
    const thresholds = [0, 100, 300, 600, 1000, 2000, 4000, 7000, 12000, 20000];
    let level = 0;
    for (let j = thresholds.length - 1; j >= 0; j--) {
      if (newIncense >= thresholds[j]) { level = j; break; }
    }
    // Simulate daily incense for NPCs
    const dailyIncense = Math.floor(rand(seed + i * 13) * 200);
    // Simulate consecutive days
    const consecutiveDays = Math.floor(rand(seed + i * 17) * 30) + 1;
    return { ...npc, incense: newIncense, level, dailyIncense, consecutiveDays };
  });
}

type Player = {
  name: string;
  zodiac: string;
  profession: string;
  incense: number;
  level: number;
  isUser: boolean;
  dailyIncense: number;
  consecutiveDays: number;
  legendScore: number;
};

export default function LeaderboardPage() {
  const profile = getProfile();
  const [tab, setTab] = useState("daily");
  const [zodiacFilter, setZodiacFilter] = useState("all");
  const [profFilter, setProfFilter] = useState("all");

  const allPlayers: Player[] = useMemo(() => {
    const npcs = getSimulatedNPCs();
    const userDailyIncense = getTodayIncense();
    const players: Player[] = [
      ...(profile
        ? [{
            name: profile.nickname,
            zodiac: profile.zodiac,
            profession: profile.profession,
            incense: profile.incense,
            level: profile.level,
            isUser: true,
            dailyIncense: userDailyIncense,
            consecutiveDays: profile.consecutiveDays,
            legendScore: profile.incense + profile.consecutiveDays * 50,
          }]
        : []),
      ...npcs.map((n) => ({
        ...n,
        isUser: false,
        legendScore: n.incense + n.consecutiveDays * 50,
      })),
    ];
    return players;
  }, [profile]);

  const filteredPlayers = useMemo(() => {
    return allPlayers.filter((p) => {
      if (zodiacFilter !== "all" && p.zodiac !== zodiacFilter) return false;
      if (profFilter !== "all" && p.profession !== profFilter) return false;
      return true;
    });
  }, [allPlayers, zodiacFilter, profFilter]);

  const sortedPlayers = useMemo(() => {
    const sorted = [...filteredPlayers];
    if (tab === "daily") sorted.sort((a, b) => b.dailyIncense - a.dailyIncense);
    else if (tab === "season") sorted.sort((a, b) => b.incense - a.incense);
    else sorted.sort((a, b) => b.legendScore - a.legendScore);
    return sorted;
  }, [filteredPlayers, tab]);

  const getRankIcon = (idx: number) => {
    if (idx === 0) return <Crown className="h-5 w-5 text-gold" />;
    if (idx === 1) return <Medal className="h-5 w-5 text-gold-light" />;
    if (idx === 2) return <Medal className="h-5 w-5 text-gold-dark" />;
    return <span className="text-sm text-muted-foreground">{idx + 1}</span>;
  };

  const getScoreLabel = (player: Player) => {
    if (tab === "daily") return { value: player.dailyIncense, label: "今日香火" };
    if (tab === "season") return { value: player.incense, label: "总香火" };
    return { value: player.legendScore, label: "传奇分" };
  };

  const PlayerRow = ({ player, idx }: { player: Player; idx: number }) => {
    const score = getScoreLabel(player);
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.03 }}
        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
          player.isUser ? "border-gold/40 bg-gold/10" : "border-border bg-card"
        }`}
      >
        <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(idx)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium truncate ${player.isUser ? "text-gold" : "text-foreground"}`}>
              {player.name}
              {player.isUser && <span className="ml-1 text-xs text-gold-light">（你）</span>}
            </span>
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
              {LEVEL_NAMES[player.level]}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">{player.zodiac}年 · {player.profession}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-gold">{score.value.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">{score.label}</p>
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      <h2 className="mb-4 text-center text-2xl font-bold text-gold">
        <Trophy className="mr-2 inline h-6 w-6" />
        封神榜
      </h2>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Filter className="h-3 w-3" />
        </div>
        <Select value={zodiacFilter} onValueChange={setZodiacFilter}>
          <SelectTrigger className="h-8 w-auto min-w-[80px] border-gold/20 text-xs">
            <SelectValue placeholder="生肖" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部生肖</SelectItem>
            {ZODIAC_LIST.map((z) => (
              <SelectItem key={z} value={z}>{z}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={profFilter} onValueChange={setProfFilter}>
          <SelectTrigger className="h-8 w-auto min-w-[80px] border-gold/20 text-xs">
            <SelectValue placeholder="职业" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部职业</SelectItem>
            {PROFESSIONS.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="daily" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">当日榜</TabsTrigger>
          <TabsTrigger value="season" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">赛季榜</TabsTrigger>
          <TabsTrigger value="legend" className="data-[state=active]:bg-gold/20 data-[state=active]:text-gold">传奇榜</TabsTrigger>
        </TabsList>

        {["daily", "season", "legend"].map((t) => (
          <TabsContent key={t} value={t} className="space-y-2 pt-4">
            {sortedPlayers.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">暂无数据</p>
            ) : (
              sortedPlayers.map((p, i) => <PlayerRow key={p.name} player={p} idx={i} />)
            )}
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
