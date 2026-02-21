import { motion } from "framer-motion";
import { useRef } from "react";

const cards = [
  {
    title: "破五送穷",
    emoji: "🧹",
    desc: "唐代起源，正月初五送穷鬼出门，扫除霉运，迎接新运！",
    tip: "学一招：初五大扫除，把垃圾送出门口象征送穷。",
  },
  {
    title: "五路财神",
    emoji: "🐯",
    desc: "赵公明居中骑黑虎，招宝、纳珍、招财、利市四方护持。",
    tip: "学一招：拜财神先敬中路赵公明，再拜四路偏财神。",
  },
  {
    title: "抢路头传统",
    emoji: "🧨",
    desc: "初五子时争先放鞭炮、供羊头鲤鱼，谁先谁财运最旺！",
    tip: "学一招：\"抢路头\"要趁早，寓意新年抢先发财。",
  },
  {
    title: "马年加持",
    emoji: "🐴",
    desc: "丙午马年，骏马奔腾，财运马不停蹄，一马当先！",
    tip: "学一招：马年佩戴马形吉祥物，寓意马到成功。",
  },
];

export const OriginCards = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

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
              <p className="text-xs text-gold-light">{card.tip}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
