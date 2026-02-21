import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ZODIAC_LIST, PROFESSIONS, getProfile, saveProfile, UserProfile } from "@/lib/store";
import { generateTitle, generateRadar, generatePoem } from "@/lib/ceremony";
import { playSuccess, playBell, playGong } from "@/lib/audio";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";
import { Sparkles, Download, ChevronRight, ChevronLeft, Zap } from "lucide-react";
import { CeremonyCard } from "@/components/CeremonyCard";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WISHES = ["升职加薪", "生意兴隆", "学业有成", "健康平安", "桃花旺旺", "六六大顺"];

export default function CeremonyPage() {
  const existingProfile = getProfile();
  const [step, setStep] = useState(existingProfile ? 3 : 1);
  const [form, setForm] = useState({
    nickname: existingProfile?.nickname || "",
    age: existingProfile?.age?.toString() || "",
    zodiac: existingProfile?.zodiac || "",
    profession: existingProfile?.profession || "",
    hobby: "",
    wish: existingProfile?.wish || "",
  });
  const [profile, setProfile] = useState<UserProfile | null>(existingProfile);
  const [showQuickConfirm, setShowQuickConfirm] = useState(false);

  const canProceed = form.nickname && form.zodiac && form.profession && form.wish;

  const handleQuickGenerate = () => {
    const randomZodiac = ZODIAC_LIST[Math.floor(Math.random() * ZODIAC_LIST.length)];
    const randomProfession = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
    const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];
    const quickForm = { nickname: "有缘人", age: "25", zodiac: randomZodiac, profession: randomProfession, hobby: "", wish: randomWish };
    setForm(quickForm);

    playBell();
    const title = generateTitle(randomZodiac, randomProfession);
    const radarStats = generateRadar(randomProfession, randomZodiac);
    const poem = generatePoem("有缘人");

    const newProfile: UserProfile = {
      nickname: "有缘人", age: 25, zodiac: randomZodiac, profession: randomProfession,
      hobby: "", wish: randomWish, title, radarStats, poem,
      createdAt: new Date().toISOString(), level: 0, incense: 0,
      consecutiveDays: 1, lastLoginDate: new Date().toISOString().split("T")[0],
      cards: ["horse_fortune"], badges: [], sanctuaryItems: [],
      tigerFood: 0, tigerLevel: 0,
    };
    saveProfile(newProfile);
    setProfile(newProfile);
    setTimeout(() => { playSuccess(); setStep(3); }, 500);
  };

  const handleGenerate = () => {
    playBell();
    const title = generateTitle(form.zodiac, form.profession);
    const radarStats = generateRadar(form.profession, form.zodiac);
    const poem = generatePoem(form.nickname);

    const newProfile: UserProfile = {
      nickname: form.nickname,
      age: parseInt(form.age) || 25,
      zodiac: form.zodiac,
      profession: form.profession,
      hobby: form.hobby,
      wish: form.wish,
      title,
      radarStats,
      poem,
      createdAt: new Date().toISOString(),
      level: 0,
      incense: 0,
      consecutiveDays: 1,
      lastLoginDate: new Date().toISOString().split("T")[0],
      cards: ["horse_fortune"],
      badges: [],
      sanctuaryItems: [],
      tigerFood: 0,
      tigerLevel: 0,
    };

    saveProfile(newProfile);
    setProfile(newProfile);
    setTimeout(() => {
      playSuccess();
      setStep(3);
    }, 500);
  };

  const radarData = profile
    ? [
        { stat: "事业", value: profile.radarStats.career },
        { stat: "人脉", value: profile.radarStats.network },
        { stat: "偏财", value: profile.radarStats.luck },
        { stat: "健康", value: profile.radarStats.health },
        { stat: "福气", value: profile.radarStats.fortune },
      ]
    : [];

  return (
    <div className="mx-auto max-w-2xl">
      {/* Step indicator */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-colors ${
                step >= s ? "border-gold bg-gold text-background" : "border-border text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 3 && <div className={`h-0.5 w-8 ${step > s ? "bg-gold" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="mb-6 text-center text-2xl font-bold text-gold">趣味问卷</h2>
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">你的昵称</label>
                <Input
                  value={form.nickname}
                  onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                  placeholder="输入你的名字或昵称"
                  className="border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">年龄</label>
                <Input
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder="你的年龄"
                  type="number"
                  className="border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">生肖</label>
                <Select value={form.zodiac} onValueChange={(v) => setForm({ ...form, zodiac: v })}>
                  <SelectTrigger className="border-border bg-background"><SelectValue placeholder="选择生肖" /></SelectTrigger>
                  <SelectContent>
                    {ZODIAC_LIST.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">职业</label>
                <Select value={form.profession} onValueChange={(v) => setForm({ ...form, profession: v })}>
                  <SelectTrigger className="border-border bg-background"><SelectValue placeholder="选择职业" /></SelectTrigger>
                  <SelectContent>
                    {PROFESSIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">爱好</label>
                <Input
                  value={form.hobby}
                  onChange={(e) => setForm({ ...form, hobby: e.target.value })}
                  placeholder="你的兴趣爱好"
                  className="border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-muted-foreground">今年最大的愿望</label>
                <div className="flex flex-wrap gap-2">
                  {WISHES.map((w) => (
                    <button
                      key={w}
                      onClick={() => setForm({ ...form, wish: w })}
                      className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                        form.wish === w ? "border-gold bg-gold/20 text-gold" : "border-border text-muted-foreground hover:border-gold/50"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => { playBell(); setStep(2); }}
                disabled={!canProceed}
                className="w-full bg-gold text-background hover:bg-gold-light"
              >
                下一步 <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowQuickConfirm(true)}
                className="w-full border-gold/30 text-gold hover:bg-gold/10"
              >
                <Zap className="mr-1 h-4 w-4" /> 一键封神
              </Button>
            </div>

            <AlertDialog open={showQuickConfirm} onOpenChange={setShowQuickConfirm}>
              <AlertDialogContent className="border-gold/30 bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gold">🙏 心诚则灵</AlertDialogTitle>
                  <AlertDialogDescription className="text-foreground/80">
                    亲手填写信息，财神更知你心意。一键封神将使用随机信息为你生成封号，确定要跳过吗？
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-border">我再想想</AlertDialogCancel>
                  <AlertDialogAction onClick={handleQuickGenerate} className="bg-gold text-background hover:bg-gold-light">
                    直接封神！
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <h2 className="mb-6 text-center text-2xl font-bold text-gold">确认信息</h2>
            <div className="space-y-4 rounded-xl border border-border bg-card p-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">昵称：</span><span className="text-foreground">{form.nickname}</span></div>
                <div><span className="text-muted-foreground">生肖：</span><span className="text-foreground">{form.zodiac}</span></div>
                <div><span className="text-muted-foreground">职业：</span><span className="text-foreground">{form.profession}</span></div>
                <div><span className="text-muted-foreground">愿望：</span><span className="text-foreground">{form.wish}</span></div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 border-border">
                  <ChevronLeft className="h-4 w-4" /> 返回修改
                </Button>
                <Button onClick={handleGenerate} className="flex-1 bg-gold text-background hover:bg-gold-light">
                  <Sparkles className="h-4 w-4" /> 开始封神！
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && profile && (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h2 className="mb-2 text-center text-2xl font-bold text-gold">恭喜封神！</h2>
            <p className="mb-6 text-center text-muted-foreground">你的专属财神身份已生成</p>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 rounded-xl border border-gold/30 bg-gradient-to-r from-crimson-dark via-crimson to-crimson-dark p-6 text-center"
            >
              <p className="mb-1 text-sm text-gold-light/70">封号</p>
              <p className="text-2xl font-black text-gold" style={{ textShadow: "0 0 20px hsl(45 100% 50% / 0.4)" }}>
                {profile.title}
              </p>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-6 rounded-xl border border-border bg-card p-4"
            >
              <p className="mb-2 text-center text-sm font-medium text-gold">五行财运</p>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(45 100% 50% / 0.2)" />
                  <PolarAngleAxis dataKey="stat" tick={{ fill: "hsl(45 100% 70%)", fontSize: 12 }} />
                  <Radar dataKey="value" stroke="hsl(45 100% 50%)" fill="hsl(45 100% 50% / 0.3)" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Poem */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6 rounded-xl border border-gold/20 bg-card p-6 text-center"
            >
              <p className="mb-3 text-sm text-gold-light/70">运势诗词</p>
              <p className="whitespace-pre-line font-serif text-lg leading-relaxed text-foreground">{profile.poem}</p>
            </motion.div>

            {/* Canvas card */}
            <CeremonyCard profile={profile} />

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setStep(1); setProfile(null); }}
                className="flex-1 border-border"
              >
                重新封神
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
