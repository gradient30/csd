import { useState } from "react";
import { motion } from "framer-motion";
import { getProfile } from "@/lib/store";
import { CARD_BACKGROUNDS } from "@/lib/ceremony";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock } from "lucide-react";

const GOD_COLLECTION = [
  { id: "zhao_gongming", name: "赵公明", desc: "中路财神，骑黑虎，执铁鞭。", emoji: "🐯", unlockCards: 1 },
  { id: "zhao_bao", name: "招宝天尊", desc: "东路财神，掌管招宝。", emoji: "💎", unlockCards: 2 },
  { id: "na_zhen", name: "纳珍天尊", desc: "南路财神，掌管纳珍。", emoji: "🏺", unlockCards: 3 },
  { id: "zhao_cai", name: "招财使者", desc: "西路财神，掌管招财。", emoji: "💰", unlockCards: 4 },
  { id: "li_shi", name: "利市仙官", desc: "北路财神，掌管利市。", emoji: "🧧", unlockCards: 5 },
  { id: "guan_di", name: "关帝圣君", desc: "武财神关羽，义薄云天。", emoji: "⚔️", unlockCards: 3 },
  { id: "bi_gan", name: "比干丞相", desc: "文财神比干，公正无私。", emoji: "📖", unlockCards: 4 },
  { id: "liu_hai", name: "刘海蟾仙", desc: "戏金蟾，散财人间。", emoji: "🐸", unlockCards: 5 },
];

const LEGENDS = [
  { id: "origin", title: "抢路头的由来", content: "相传明清时期，正月初五子时，商家争先开门，燃放鞭炮，称为抢路头，意在先于他人接到路神（五路财神），以求新年大发财运...", unlockAll: false },
  { id: "five_gods", title: "五路财神传说", content: "五路财神以赵公明为首，四位辅神分守东南西北。赵公明骑黑虎，手持铁鞭和元宝，威风凛凛，是民间最受敬仰的财神...", unlockAll: false },
  { id: "horse_year", title: "马年财运秘笈", content: "丙午马年，火马临世。马属火，午也属火，双火相聚，意味着这一年财运如火如荼。适合大胆投资、勇敢开拓...", unlockAll: true },
];

export default function CollectionPage() {
  const profile = getProfile();
  const userCardCount = profile?.cards?.length || 0;

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold text-gold">
        <BookOpen className="mr-2 inline h-6 w-6" />
        财神图鉴
      </h2>

      {/* Card collection */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          财神卡收集 ({userCardCount}/{CARD_BACKGROUNDS.length})
        </p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {CARD_BACKGROUNDS.map((card) => {
            const unlocked = profile?.cards?.includes(card.id);
            return (
              <motion.div
                key={card.id}
                whileHover={unlocked ? { scale: 1.05 } : {}}
                className={`aspect-[3/4] rounded-lg border p-3 text-center ${
                  unlocked
                    ? "border-gold/40 bg-gradient-to-b from-crimson-dark to-background"
                    : "border-border bg-muted opacity-50"
                }`}
              >
                {unlocked ? (
                  <>
                    <div className="text-2xl">🎴</div>
                    <p className="mt-1 text-xs text-gold">{card.name}</p>
                  </>
                ) : (
                  <>
                    <Lock className="mx-auto h-5 w-5 text-muted-foreground" />
                    <p className="mt-1 text-xs text-muted-foreground">???</p>
                  </>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Gods collection */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">财神档案</p>
        <div className="space-y-2">
          {GOD_COLLECTION.map((god) => {
            const unlocked = userCardCount >= god.unlockCards;
            return (
              <div
                key={god.id}
                className={`flex items-center gap-3 rounded-lg border p-4 ${
                  unlocked ? "border-gold/20 bg-card" : "border-border bg-muted opacity-60"
                }`}
              >
                <div className="text-3xl">{unlocked ? god.emoji : "❓"}</div>
                <div className="flex-1">
                  <p className={`font-medium ${unlocked ? "text-foreground" : "text-muted-foreground"}`}>
                    {unlocked ? god.name : "???"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {unlocked ? god.desc : `收集${god.unlockCards}张卡解锁`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legends */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">传说故事</p>
        <div className="space-y-3">
          {LEGENDS.map((legend) => {
            const unlocked = !legend.unlockAll || userCardCount >= CARD_BACKGROUNDS.length;
            return (
              <div key={legend.id} className={`rounded-lg border p-4 ${unlocked ? "border-gold/20 bg-card" : "border-border bg-muted opacity-60"}`}>
                <p className={`mb-2 font-medium ${unlocked ? "text-gold" : "text-muted-foreground"}`}>
                  {unlocked ? legend.title : "🔒 " + legend.title}
                </p>
                {unlocked ? (
                  <p className="text-sm leading-relaxed text-foreground/80">{legend.content}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">集齐所有财神卡解锁</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
