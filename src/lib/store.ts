// localStorage-based state management for 抢路头

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
