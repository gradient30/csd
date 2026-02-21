import { getProfile, getRecords, LEVEL_NAMES } from "@/lib/store";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function FortuneArchive() {
  const profile = getProfile();
  if (!profile) return null;

  const radarData = [
    { stat: "事业", value: profile.radarStats.career },
    { stat: "人脉", value: profile.radarStats.network },
    { stat: "偏财", value: profile.radarStats.luck },
    { stat: "健康", value: profile.radarStats.health },
    { stat: "福气", value: profile.radarStats.fortune },
  ];

  // Build incense growth from records
  const records = getRecords();
  const trendData = records.slice(-14).map((r) => ({
    date: r.date.slice(5), // MM-DD
    incense: r.worshipScore + r.horseGameScore * 2 + r.riddlesSolved * 15 + r.sweepScore,
  }));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gold/20 bg-card p-4">
        <p className="mb-2 text-sm font-medium text-gold">📊 五行财运雷达</p>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--gold) / 0.2)" />
              <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(var(--gold))", fontSize: 12 }} />
              <Radar dataKey="value" stroke="hsl(var(--gold))" fill="hsl(var(--gold))" fillOpacity={0.2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {trendData.length > 1 && (
        <div className="rounded-xl border border-gold/20 bg-card p-4">
          <p className="mb-2 text-sm font-medium text-gold">📈 近期香火趋势</p>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="incense" stroke="hsl(var(--gold))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gold/20 bg-card p-4">
        <p className="mb-2 text-sm font-medium text-gold">📜 个人档案</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground">封号</p>
            <p className="font-bold text-gold">{profile.title}</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground">等级</p>
            <p className="font-bold text-gold">{LEVEL_NAMES[profile.level]}</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground">连续登录</p>
            <p className="font-bold text-gold">{profile.consecutiveDays} 天</p>
          </div>
          <div className="rounded-lg bg-muted p-3 text-center">
            <p className="text-xs text-muted-foreground">收集卡片</p>
            <p className="font-bold text-gold">{profile.cards.length} 张</p>
          </div>
        </div>
      </div>
    </div>
  );
}
