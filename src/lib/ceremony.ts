// Ceremony algorithm: generates title, radar, poem from user input

const TITLE_PREFIXES: Record<string, string[]> = {
  "鼠": ["灵鼠", "金鼠", "玉鼠"],
  "牛": ["金牛", "铁牛", "神牛"],
  "虎": ["猛虎", "白虎", "黑虎"],
  "兔": ["玉兔", "灵兔", "月兔"],
  "龙": ["金龙", "神龙", "青龙"],
  "蛇": ["灵蛇", "金蛇", "玄蛇"],
  "马": ["午马", "飞马", "神驹"],
  "羊": ["金羊", "祥羊", "瑞羊"],
  "猴": ["金猴", "灵猴", "神猴"],
  "鸡": ["金鸡", "凤鸡", "神鸡"],
  "狗": ["金犬", "神犬", "灵犬"],
  "猪": ["金猪", "福猪", "瑞猪"],
};

const TITLE_MIDDLES = ["黑虎", "招财", "纳珍", "利市", "聚宝"];
const TITLE_SUFFIXES = ["招财护法", "进宝天尊", "纳珍使者", "利市仙官", "聚宝真人", "财运星君"];

export function generateTitle(zodiac: string, profession: string): string {
  const prefixes = TITLE_PREFIXES[zodiac] || ["瑞兽"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const middle = TITLE_MIDDLES[Math.floor(Math.random() * TITLE_MIDDLES.length)];
  const suffix = TITLE_SUFFIXES[Math.floor(Math.random() * TITLE_SUFFIXES.length)];
  return `${prefix}${middle}${suffix}`;
}

export function generateRadar(profession: string, zodiac: string): { career: number; network: number; luck: number; health: number; fortune: number } {
  const seed = (profession + zodiac).split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const rand = (offset: number) => 40 + ((seed * (offset + 1) * 7 + 13) % 55);
  return {
    career: rand(1),
    network: rand(2),
    luck: rand(3),
    health: rand(4),
    fortune: rand(5),
  };
}

const POEM_TEMPLATES = [
  (name: string) => `${name[0] || "福"}星高照财源广，\n马到成功万事兴。\n黑虎送宝迎春至，\n五路财神护此生。`,
  (name: string) => `${name[0] || "瑞"}气东来紫金殿，\n招财进宝满乾坤。\n丙午马年开新运，\n一帆风顺达三江。`,
  (name: string) => `${name[0] || "吉"}祥如意财运旺，\n金玉满堂喜盈门。\n初五抢头路通达，\n年年有余福自来。`,
  (name: string) => `${name[0] || "祥"}云瑞彩绕金殿，\n财神驾到送吉祥。\n马年大吉行好运，\n五福临门百事昌。`,
  (name: string) => `${name[0] || "财"}源滚滚如潮涌，\n福泽绵延万代昌。\n正月初五迎神至，\n鸿运当头耀四方。`,
];

export function generatePoem(nickname: string): string {
  const idx = nickname.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % POEM_TEMPLATES.length;
  return POEM_TEMPLATES[idx](nickname);
}

// NPC data for leaderboard simulation
export const NPC_PLAYERS = [
  { name: "赵公明", zodiac: "虎", profession: "商人", incense: 18500, level: 9 },
  { name: "关帝圣君", zodiac: "龙", profession: "公务员", incense: 15200, level: 8 },
  { name: "比干丞相", zodiac: "牛", profession: "教师", incense: 12800, level: 7 },
  { name: "范蠡陶朱", zodiac: "蛇", profession: "商人", incense: 11000, level: 7 },
  { name: "刘海蟾仙", zodiac: "鸡", profession: "自由职业", incense: 9500, level: 6 },
  { name: "沈万三", zodiac: "猪", profession: "商人", incense: 8200, level: 6 },
  { name: "和合二仙", zodiac: "兔", profession: "设计师", incense: 6800, level: 5 },
  { name: "福禄寿星", zodiac: "马", profession: "医生", incense: 5500, level: 5 },
  { name: "金蟾大仙", zodiac: "鼠", profession: "程序员", incense: 4200, level: 4 },
  { name: "招财猫童", zodiac: "猴", profession: "学生", incense: 3000, level: 3 },
  { name: "元宝小将", zodiac: "羊", profession: "创业者", incense: 2100, level: 2 },
  { name: "铜钱新手", zodiac: "狗", profession: "其他", incense: 800, level: 1 },
];

// Riddles data
export const RIDDLES = [
  { question: "左边一个金，右边一个金，合在一起重千斤。", answer: "鑫", hint: "三个金" },
  { question: "一人一口一把刀。", answer: "合", hint: "和气生财" },
  { question: "千里送鹅毛。", answer: "礼轻情意重", hint: "成语" },
  { question: "财神骑什么坐骑？", answer: "黑虎", hint: "赵公明的坐骑" },
  { question: "正月初五又叫什么？", answer: "破五", hint: "送穷迎富" },
  { question: "五路财神的中路是谁？", answer: "赵公明", hint: "武财神" },
  { question: "招财的蟾蜍有几只脚？", answer: "三只", hint: "金蟾" },
  { question: "福字倒贴寓意什么？", answer: "福到了", hint: "谐音" },
  { question: "关公的坐骑叫什么？", answer: "赤兔马", hint: "三国名马" },
  { question: "丙午年的生肖是？", answer: "马", hint: "天干地支" },
  { question: "传说中招宝天尊的法宝是什么？", answer: "招宝幡", hint: "一面旗帜" },
  { question: "金元宝的形状像什么？", answer: "小船", hint: "两头翘" },
  { question: "年年有余的余指什么动物？", answer: "鱼", hint: "谐音" },
  { question: "聚宝盆的传说与谁有关？", answer: "沈万三", hint: "明代首富" },
  { question: "压岁钱最早叫什么？", answer: "压祟钱", hint: "驱邪用" },
  { question: "财神爷的生日是哪天？", answer: "七月二十二", hint: "农历" },
  { question: "利市是什么意思？", answer: "红包/利润", hint: "粤语常用" },
  { question: "比干是哪个朝代的人？", answer: "商朝", hint: "纣王时期" },
  { question: "范蠡辅佐的是谁？", answer: "勾践", hint: "卧薪尝胆" },
  { question: "刘海戏金蟾中金蟾口衔什么？", answer: "铜钱", hint: "招财象征" },
  // 文财神 vs 武财神
  { question: "文财神通常指哪两位？", answer: "比干和范蠡", hint: "一忠一商" },
  { question: "武财神除了赵公明，还有谁？", answer: "关公", hint: "义薄云天" },
  { question: "赵公明的全称是什么？", answer: "金龙如意正一龙虎玄坛真君", hint: "道教封号" },
  { question: "比干被称为文财神是因为什么？", answer: "无心偏私", hint: "被挖心后公正无私" },
  { question: "范蠡经商成功后人称他什么？", answer: "陶朱公", hint: "隐居陶地" },
  // 传统节俗
  { question: "元宵节又叫什么节？", answer: "上元节", hint: "道教三元" },
  { question: "春联最早叫什么？", answer: "桃符", hint: "挂在门上的桃木板" },
  { question: "门神最常见的两位是谁？", answer: "秦叔宝和尉迟恭", hint: "唐代名将" },
  { question: "除夕夜为什么要守岁？", answer: "驱赶年兽", hint: "传说怪兽" },
  { question: "正月十五吃什么传统食物？", answer: "汤圆/元宵", hint: "团圆之意" },
  { question: "腊月二十三祭的是哪位神？", answer: "灶王爷", hint: "上天言好事" },
  { question: "贴春联时上联贴在哪边？", answer: "右边", hint: "面对大门的右手边" },
  // 成语与财富
  { question: "'日进斗金'中'斗'是什么？", answer: "量器", hint: "古代量粮食的工具" },
  { question: "'招财进宝'四字合写成一个字像什么？", answer: "一个合体字", hint: "民间创造的吉祥字" },
  { question: "成语'腰缠万贯'的'贯'指什么？", answer: "一千文铜钱", hint: "古代货币单位" },
  { question: "'财源广进'通常和哪四个字对仗？", answer: "生意兴隆", hint: "商铺春联" },
  { question: "'一本万利'最早出自哪里？", answer: "战国策", hint: "古代典籍" },
  // 生肖知识
  { question: "十二生肖中排第一的是？", answer: "鼠", hint: "子鼠" },
  { question: "生肖中唯一的虚构动物是？", answer: "龙", hint: "辰龙" },
  { question: "为什么猫不在十二生肖中？", answer: "传说被鼠骗了没赶上", hint: "民间故事" },
  { question: "午时对应的生肖是什么？", answer: "马", hint: "午马" },
  { question: "本命年要穿什么颜色？", answer: "红色", hint: "辟邪" },
  // 更多财神文化
  { question: "五路财神的'五路'指什么？", answer: "东南西北中", hint: "五个方位" },
  { question: "初五接财神要放鞭炮是为什么？", answer: "抢路头，越早越好", hint: "争先恐后" },
  { question: "供品中为什么要用鲤鱼？", answer: "鲤鱼跳龙门，寓意飞黄腾达", hint: "吉祥寓意" },
  { question: "哪种植物被称为'摇钱树'？", answer: "金钱树", hint: "常绿植物" },
  { question: "貔貅为什么被视为招财瑞兽？", answer: "只进不出", hint: "有口无肛" },
  { question: "古代商铺开业要做的第一件事是？", answer: "放鞭炮", hint: "开门大吉" },
  { question: "财神庙中常见的对联上联是？", answer: "生意兴隆通四海", hint: "经典对联" },
];

// Card templates
export const CARD_BACKGROUNDS = [
  { id: "dragon_gold", name: "金龙献瑞", color: "#FFD700" },
  { id: "tiger_power", name: "黑虎啸天", color: "#2D2D2D" },
  { id: "horse_fortune", name: "骏马奔腾", color: "#C8102E" },
  { id: "cloud_blessing", name: "祥云瑞彩", color: "#8B0000" },
  { id: "coin_rain", name: "金币满堂", color: "#B8860B" },
];
