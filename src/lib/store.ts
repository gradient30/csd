// localStorage-based state management for 抢路头

import { CARD_BACKGROUNDS } from "@/lib/ceremony";

export interface UserProfile {
  nickname: string;
  age: number;
  zodiac: string;
  profession: string;
  hobby: string;
  wish: string;
  title: string; // 封号
  radarStats: { career: number; network: number; luck: number; health: number; fortune: number };
  poem: string;
  createdAt: string;
  level: number; // 0-9
  incense: number; // 香火值
  consecutiveDays: number;
  lastLoginDate: string;
  cards: string[]; // collected card IDs
  badges: string[];
  sanctuaryItems: string[];
  tigerFood: number;
  tigerLevel: number;
}

export interface GameRecord {
  date: string;
  worshipScore: number;
  horseGameScore: number;
  riddlesSolved: number;
  sweepScore: number;
}

const PROFILE_KEY = "caishen_profile";
const RECORDS_KEY = "caishen_records";

export function getProfile(): UserProfile | null {
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getRecords(): GameRecord[] {
  const raw = localStorage.getItem(RECORDS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveRecord(record: GameRecord): void {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getTodayRecord(): GameRecord | null {
  const today = new Date().toISOString().split("T")[0];
  return getRecords().find((r) => r.date === today) || null;
}

export function updateTodayRecord(partial: Partial<GameRecord>): void {
  const today = new Date().toISOString().split("T")[0];
  const records = getRecords();
  const idx = records.findIndex((r) => r.date === today);
  if (idx >= 0) {
    records[idx] = { ...records[idx], ...partial };
  } else {
    records.push({ date: today, worshipScore: 0, horseGameScore: 0, riddlesSolved: 0, sweepScore: 0, ...partial });
  }
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function addIncense(amount: number): void {
  const profile = getProfile();
  if (profile) {
    profile.incense += amount;
    // Level up check
    const thresholds = [0, 100, 300, 600, 1000, 2000, 4000, 7000, 12000, 20000];
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (profile.incense >= thresholds[i]) {
        profile.level = i;
        break;
      }
    }
    saveProfile(profile);
  }
}

export const LEVEL_NAMES = [
  "香火童子", "招财使者", "纳珍护卫", "利市仙官",
  "偏财星君", "正财星君", "黑虎护法", "招宝天尊",
  "五路财使", "五路总管"
];

export const ZODIAC_LIST = [
  "鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"
];

export const PROFESSIONS = [
  "程序员", "设计师", "教师", "医生", "自由职业", "学生",
  "商人", "公务员", "创业者", "其他"
];

// ===== NEW: Login check & consecutive days =====
export function checkLogin(): { isNewDay: boolean; consecutiveDays: number; reward: number } {
  const profile = getProfile();
  if (!profile) return { isNewDay: false, consecutiveDays: 0, reward: 0 };

  const today = new Date().toISOString().split("T")[0];
  if (profile.lastLoginDate === today) {
    return { isNewDay: false, consecutiveDays: profile.consecutiveDays, reward: 0 };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const isConsecutive = profile.lastLoginDate === yesterday;
  profile.consecutiveDays = isConsecutive ? profile.consecutiveDays + 1 : 1;
  profile.lastLoginDate = today;

  // Consecutive reward: base 10 + 5 per streak day, max 50
  const reward = Math.min(10 + (profile.consecutiveDays - 1) * 5, 50);
  profile.incense += reward;

  // Level recalc
  const thresholds = [0, 100, 300, 600, 1000, 2000, 4000, 7000, 12000, 20000];
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (profile.incense >= thresholds[i]) { profile.level = i; break; }
  }

  saveProfile(profile);
  return { isNewDay: true, consecutiveDays: profile.consecutiveDays, reward };
}

// ===== NEW: Today's incense (for daily leaderboard) =====
export function getTodayIncense(): number {
  const rec = getTodayRecord();
  if (!rec) return 0;
  return rec.worshipScore + rec.horseGameScore * 2 + rec.riddlesSolved * 15 + rec.sweepScore;
}

// ===== NEW: Unlock random card =====
export function unlockRandomCard(): string | null {
  const profile = getProfile();
  if (!profile) return null;
  const allIds = CARD_BACKGROUNDS.map((c) => c.id);
  const unowned = allIds.filter((id) => !profile.cards.includes(id));
  if (unowned.length === 0) return null;
  const newCard = unowned[Math.floor(Math.random() * unowned.length)];
  profile.cards.push(newCard);
  saveProfile(profile);
  return newCard;
}

// ===== NEW: Badge system =====
export const BADGE_DEFS: { id: string; name: string; emoji: string; desc: string }[] = [
  { id: "first_seal", name: "初次封神", emoji: "⭐", desc: "完成第一次封神仪式" },
  { id: "streak_7", name: "七日香火", emoji: "🔥", desc: "连续登录7天" },
  { id: "streak_30", name: "月度虔诚", emoji: "🌟", desc: "连续登录30天" },
  { id: "cards_3", name: "初级收藏", emoji: "🃏", desc: "收集3张财神卡" },
  { id: "cards_all", name: "全卡大师", emoji: "👑", desc: "收集全部财神卡" },
  { id: "incense_1k", name: "千香信徒", emoji: "🕯️", desc: "香火值突破1000" },
  { id: "incense_10k", name: "万香大师", emoji: "🏆", desc: "香火值突破10000" },
  { id: "horse_master", name: "飞马高手", emoji: "🐴", desc: "飞马接元宝单次超过15枚" },
  { id: "riddle_10", name: "灯谜达人", emoji: "🎋", desc: "累计答对10道灯谜" },
  { id: "sweep_clean", name: "扫穷先锋", emoji: "🧹", desc: "完成5轮送穷" },
];

export function checkBadges(extraContext?: { horseScore?: number; sweepRounds?: number }): string[] {
  const profile = getProfile();
  if (!profile) return [];
  const newBadges: string[] = [];

  const tryAdd = (id: string) => {
    if (!profile.badges.includes(id)) {
      profile.badges.push(id);
      newBadges.push(id);
    }
  };

  // Always check these
  tryAdd("first_seal");
  if (profile.consecutiveDays >= 7) tryAdd("streak_7");
  if (profile.consecutiveDays >= 30) tryAdd("streak_30");
  if (profile.cards.length >= 3) tryAdd("cards_3");
  if (profile.cards.length >= CARD_BACKGROUNDS.length) tryAdd("cards_all");
  if (profile.incense >= 1000) tryAdd("incense_1k");
  if (profile.incense >= 10000) tryAdd("incense_10k");

  // Context-specific
  if (extraContext?.horseScore && extraContext.horseScore >= 15) tryAdd("horse_master");

  const rec = getTodayRecord();
  if (rec && rec.riddlesSolved >= 10) tryAdd("riddle_10");

  // sweepRounds stored in localStorage
  const sweepKey = "caishen_sweep_rounds";
  const sweepRounds = Number(localStorage.getItem(sweepKey) || "0") + (extraContext?.sweepRounds || 0);
  if (extraContext?.sweepRounds) localStorage.setItem(sweepKey, String(sweepRounds));
  if (sweepRounds >= 5) tryAdd("sweep_clean");

  if (newBadges.length > 0) saveProfile(profile);
  return newBadges;
}

// ===== NEW: Dual mode =====
export type GameMode = "festival" | "daily";

export function getMode(): GameMode {
  // Lunar New Year approximation for 2026: Jan 27 is Lunar Jan 1
  // So Lunar Jan 4 = Jan 30, Lunar Jan 15 = Feb 10
  const now = new Date();
  const year = now.getFullYear();
  if (year === 2026) {
    const start = new Date("2026-01-30");
    const end = new Date("2026-02-11");
    if (now >= start && now <= end) return "festival";
  }
  // For demo/testing: also check localStorage override
  if (localStorage.getItem("caishen_mode") === "festival") return "festival";
  return "daily";
}

export function getIncenseMultiplier(): number {
  return getMode() === "festival" ? 2 : 1;
}
