import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const cards = [
  {
    title: "破五送穷",
    emoji: "🧹",
    desc: "唐代起源，正月初五送穷鬼出门，扫除霉运，迎接新运！",
    tips: [
      "初五大扫除，把垃圾送出门口象征送穷。",
      "初五不串门，怕把穷气带给别人，这是北方普遍习俗。",
      "韩愈写过《送穷文》，是破五习俗最早的文学记录之一。",
      "民间传说穷神是姜子牙之妻，好吃懒做被封为穷神。",
      "破五当天要打碎一个旧碗，寓意'破旧立新'。",
      "南方部分地区初五吃饺子，形似元宝，寓意招财。",
    ],
  },
  {
    title: "五路财神",
    emoji: "🐯",
    desc: "赵公明居中骑黑虎，招宝、纳珍、招财、利市四方护持。",
    tips: [
      "拜财神先敬中路赵公明，再拜四路偏财神。",
      "五路指东南西北中，分管不同方位财运。",
      "赵公明全称'金龙如意正一龙虎玄坛真君'。",
      "招宝天尊萧升、纳珍天尊曹宝，原为赵公明部将。",
      "民间供奉文财神多在家中，武财神多在店铺。",
      "比干被封为文财神，因被剖心而公正无偏。",
    ],
  },
  {
    title: "抢路头传统",
    emoji: "🧨",
    desc: "初五子时争先放鞭炮、供羊头鲤鱼，谁先谁财运最旺！",
    tips: [
      "'抢路头'要趁早，寓意新年抢先发财。",
      "旧时商家初五开市称'接路头'，是一年中最重要的开业日。",
      "供品中羊头寓意'吉祥'，因'羊'与'祥'谐音。",
      "鲤鱼跳龙门的供品寓意飞黄腾达、步步高升。",
      "子时（23点-1点）放的第一挂鞭炮叫'抢头炮'。",
      "初五开市时掌柜会给伙计发'开工利市'，即红包。",
    ],
  },
  {
    title: "马年加持",
    emoji: "🐴",
    desc: "丙午马年，骏马奔腾，财运马不停蹄，一马当先！",
    tips: [
      "马年佩戴马形吉祥物，寓意马到成功。",
      "午时（11-13点）拜财神被认为最灵验，午属马。",
      "'马上封侯'是传统吉祥图案，猴骑在马背上。",
      "'一马当先'出自《庄子》，寓意领先众人。",
      "古代驿站以马传信，马象征'好消息快速到来'。",
      "马年本命年系红绳可佩于手腕或脚踝，寓意辟邪转运。",
    ],
  },
];

export const OriginCards = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [tipIndices, setTipIndices] = useState<number[]>(cards.map(() => 0));

  const nextTip = (cardIdx: number) => {
    setTipIndices((prev) => {
      const next = [...prev];
      let newIdx = next[cardIdx];
      // Ensure we get a different tip
      const maxTips = cards[cardIdx].tips.length;
      do {
        newIdx = Math.floor(Math.random() * maxTips);
      } while (newIdx === next[cardIdx] && maxTips > 1);
      next[cardIdx] = newIdx;
      return next;
    });
  };

  return (
    <section className="relative z-10 px-4 py-16">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-8 text-center text-2xl font-bold text-gold sm:text-3xl"
      >
        迎财神渊源
      </motion.h2>

      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible lg:grid-cols-4"
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="min-w-[280px] snap-center rounded-xl border border-gold/20 bg-background/60 p-6 backdrop-blur-sm sm:min-w-0"
          >
            <div className="mb-3 text-4xl">{card.emoji}</div>
            <h3 className="mb-2 text-xl font-bold text-gold">{card.title}</h3>
            <p className="mb-4 text-sm leading-relaxed text-foreground/80">{card.desc}</p>
            <div className="rounded-lg bg-gold/10 p-3">
              <AnimatePresence mode="wait">
                <motion.p
                  key={tipIndices[i]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-gold-light"
                >
                  💡 {card.tips[tipIndices[i]]}
                </motion.p>
              </AnimatePresence>
              <button
                onClick={() => nextTip(i)}
                className="mt-2 flex items-center gap-1 text-xs text-gold/60 transition-colors hover:text-gold"
              >
                <RefreshCw className="h-3 w-3" /> 再学一招
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
