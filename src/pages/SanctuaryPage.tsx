import { useState } from "react";
import { motion } from "framer-motion";
import { getProfile, saveProfile, addIncense, LEVEL_NAMES } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { playCoin, playBell } from "@/lib/audio";
import { Home, Heart, Sparkles } from "lucide-react";

const SANCTUARY_ITEMS = [
  { id: "incense_burner", name: "香炉", emoji: "🏺", cost: 50 },
  { id: "gold_ingot", name: "金元宝", emoji: "🥇", cost: 100 },
  { id: "lantern", name: "红灯笼", emoji: "🏮", cost: 80 },
  { id: "scroll", name: "对联", emoji: "📜", cost: 60 },
  { id: "fish", name: "锦鲤", emoji: "🐟", cost: 120 },
  { id: "tree", name: "摇钱树", emoji: "🌳", cost: 200 },
];

export default function SanctuaryPage() {
  const [profile, setProfileState] = useState(getProfile());

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-2xl">🏛️</p>
        <p className="mt-4 text-muted-foreground">请先完成封神仪式</p>
        <Button onClick={() => (window.location.href = "/temple/ceremony")} className="mt-4 bg-gold text-background">
          去封神
        </Button>
      </div>
    );
  }

  const thresholds = [0, 100, 300, 600, 1000, 2000, 4000, 7000, 12000, 20000];
  const nextThreshold = thresholds[Math.min(profile.level + 1, thresholds.length - 1)];
  const currentThreshold = thresholds[profile.level];
  const progress = ((profile.incense - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

  const feedTiger = () => {
    if (profile.incense < 10) return;
    playBell();
    profile.incense -= 10;
    profile.tigerFood += 1;
    if (profile.tigerFood >= 10 * (profile.tigerLevel + 1)) {
      profile.tigerLevel = Math.min(profile.tigerLevel + 1, 5);
      profile.tigerFood = 0;
    }
    saveProfile(profile);
    setProfileState({ ...profile });
  };

  const buyItem = (item: typeof SANCTUARY_ITEMS[0]) => {
    if (profile.incense < item.cost) return;
    if (profile.sanctuaryItems.includes(item.id)) return;
    playCoin();
    profile.incense -= item.cost;
    profile.sanctuaryItems.push(item.id);
    saveProfile(profile);
    setProfileState({ ...profile });
  };

  const tigerEmojis = ["🐱", "🐈", "🐅", "🐯", "🐅", "🐯"];

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-gold">
        <Home className="mr-2 inline h-6 w-6" />
        我的道场
      </h2>

      {/* Level & Progress */}
      <div className="rounded-xl border border-gold/20 bg-card p-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">等级</span>
          <span className="font-bold text-gold">{LEVEL_NAMES[profile.level]}</span>
        </div>
        <Progress value={Math.min(progress, 100)} className="h-2 bg-muted" />
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>香火 {profile.incense}</span>
          <span>下一级 {nextThreshold}</span>
        </div>
      </div>

      {/* Tiger pet */}
      <div className="rounded-xl border border-gold/20 bg-card p-6 text-center">
        <p className="mb-2 text-sm text-muted-foreground">虚拟黑虎宠物</p>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-5xl"
        >
          {tigerEmojis[profile.tigerLevel]}
        </motion.div>
        <p className="mt-2 text-sm text-gold">
          Lv.{profile.tigerLevel} {profile.tigerLevel >= 3 ? "黑虎" : "小猫"}
        </p>
        <p className="text-xs text-muted-foreground">
          喂食进度：{profile.tigerFood}/{10 * (profile.tigerLevel + 1)}
        </p>
        <Button
          onClick={feedTiger}
          disabled={profile.incense < 10}
          size="sm"
          className="mt-3 bg-gold text-background hover:bg-gold-light"
        >
          <Heart className="h-3 w-3" /> 喂食（-10香火）
        </Button>
      </div>

      {/* Sanctuary items */}
      <div className="rounded-xl border border-gold/20 bg-card p-6">
        <p className="mb-4 text-sm font-medium text-gold">道场装饰</p>

        {/* Owned items display */}
        {profile.sanctuaryItems.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-3 rounded-lg bg-muted p-4">
            {profile.sanctuaryItems.map((id) => {
              const item = SANCTUARY_ITEMS.find((i) => i.id === id);
              return item ? (
                <div key={id} className="text-center">
                  <div className="text-2xl">{item.emoji}</div>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* Shop */}
        <div className="grid grid-cols-3 gap-2">
          {SANCTUARY_ITEMS.map((item) => {
            const owned = profile.sanctuaryItems.includes(item.id);
            return (
              <button
                key={item.id}
                onClick={() => buyItem(item)}
                disabled={owned || profile.incense < item.cost}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  owned
                    ? "border-gold/30 bg-gold/10"
                    : profile.incense >= item.cost
                    ? "border-border bg-card hover:border-gold/50"
                    : "border-border bg-card opacity-50"
                }`}
              >
                <div className="text-2xl">{item.emoji}</div>
                <p className="mt-1 text-xs text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{owned ? "已拥有" : `${item.cost}香火`}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
