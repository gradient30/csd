import { getTodayRecord } from "@/lib/store";
import { CheckCircle, Circle } from "lucide-react";

const TASKS = [
  { key: "worshipScore" as const, label: "今日上香", threshold: 5, emoji: "🕯️" },
  { key: "riddlesSolved" as const, label: "今日摇签", threshold: 1, emoji: "🎋" },
  { key: "horseGameScore" as const, label: "今日飞马", threshold: 1, emoji: "🐴" },
  { key: "sweepScore" as const, label: "今日送穷", threshold: 10, emoji: "🧹" },
];

export default function DailyTasks() {
  const rec = getTodayRecord();

  return (
    <div className="rounded-xl border border-gold/20 bg-card p-4">
      <p className="mb-3 text-sm font-medium text-gold">📋 每日任务</p>
      <div className="grid grid-cols-2 gap-2">
        {TASKS.map((t) => {
          const val = rec ? rec[t.key] : 0;
          const done = val >= t.threshold;
          return (
            <div
              key={t.key}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                done ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <CheckCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span>{t.emoji} {t.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
