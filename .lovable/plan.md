

# PRD vs 当前实现 —— 差距分析与优化计划

## 一、已完成且基本达标的部分

- 首页英雄区（标题、副标题、CTA、粒子、祥云）
- 迎财神渊源卡片（4张横滑卡）
- 过渡特效（粒子爆炸 + 中心文字）
- 封神仪式3步流程（问卷 -> 确认 -> 结果展示）
- 五行雷达图（Recharts）
- Canvas财神卡生成与下载
- 4个小游戏基础框架（祭拜台、摇签、飞马、送穷）
- 封神榜（NPC模拟 + 三个Tab）
- 道场（等级、黑虎宠物、装饰商店）
- 图鉴（卡片收集、财神档案、传说故事）
- 音效系统（Web Audio合成 + 全局开关）
- localStorage全套数据管理

## 二、缺失或明显不足的功能点

### 2.1 过渡特效太单一
- **PRD要求**：8种随机过渡效果（金元宝雨、鞭炮绽放、五路神驾临、祥云马队、黑虎啸天等）
- **当前**：只有1种（混合emoji爆炸），每次都一样

### 2.2 封神榜缺少分类榜
- **PRD要求**：当日榜 / 赛季榜 / 传奇总榜 + 职业榜 / 生肖榜
- **当前**：三个Tab展示完全相同的数据，没有任何区分逻辑；缺少职业/生肖垂直分榜

### 2.3 连续登录 / 每日任务系统缺失
- **PRD要求**：连续登录奖励、每日任务钩子（上香/摇签/飞马）、每周新灯谜
- **当前**：`consecutiveDays` 和 `lastLoginDate` 字段存在但从未被检测或更新；无任务列表UI

### 2.4 社交传播功能缺失
- **PRD要求**：一键分享封神卡（带水印）、虚拟利市红包生成
- **当前**：仅有Canvas下载，无分享引导、无水印、无红包功能

### 2.5 徽章系统空壳
- **PRD要求**：里程碑徽章（动态解锁）、赛季徽章、连续年数徽章
- **当前**：`badges` 数组存在但从未写入，无徽章展示UI

### 2.6 卡片收集机制不完整
- **PRD要求**：通过不同活动收集不同卡片
- **当前**：初始化时硬编码给1张卡 `horse_fortune`，之后再无获取途径

### 2.7 财运档案缺失
- **PRD要求**：雷达图历史轨迹、历年封神卡合集、同比增长百分比
- **当前**：完全没有实现

### 2.8 智能双模式切换缺失
- **PRD要求**：初五前后自动切换"狂欢/日常"模式
- **当前**：无模式概念

### 2.9 无障碍支持不足
- **PRD要求**：屏幕阅读器支持、字体可调
- **当前**：缺少 aria-label、无字体大小调节

---

## 三、实施计划（按优先级排序）

### P0：核心体验修复

**1. 封神榜数据差异化**
- 当日榜：仅显示今日获得的香火值排名
- 赛季榜：累计总香火排名（当前逻辑）
- 传奇榜：额外加入"连续天数"加权
- 新增职业筛选和生肖筛选功能
- 文件：`src/pages/LeaderboardPage.tsx`，`src/lib/store.ts`（新增 `getTodayIncense()` 辅助函数）

**2. 连续登录检测与每日任务**
- 在 `TempleLayout` 挂载时检测 `lastLoginDate`，更新连续天数并给予奖励
- 新建 `src/components/DailyTasks.tsx`，显示在道场页顶部
- 任务列表：今日上香、今日摇签、今日飞马、今日送穷（读取 `getTodayRecord()`）
- 文件：`src/lib/store.ts`，`src/components/TempleLayout.tsx`，`src/pages/SanctuaryPage.tsx`

**3. 卡片获取机制**
- 每日首次祭拜满50分 -> 随机获得一张新卡
- 摇签答对5题 -> 获得一张卡
- 飞马得分超过10 -> 获得一张卡
- 在各游戏结算处加入 `unlockCard()` 逻辑
- 文件：`src/lib/store.ts`（新增 `unlockRandomCard()`），`src/pages/WorshipPage.tsx`

### P1：丰富度提升

**4. 过渡特效多样化**
- 扩展 `TransitionOverlay` 为8种主题，每次随机选一种
- 主题包括：金元宝雨、鞭炮漫天、五路神驾到、祥云马队、黑虎啸天、铜钱飞舞、灯笼高挂、福字翻转
- 文件：`src/components/TransitionOverlay.tsx`

**5. 徽章系统**
- 定义徽章常量：首次封神、连续7天、连续30天、集齐3卡、集齐全卡、香火破千/万、飞马高手等
- 在关键动作后检测并授予徽章
- 道场页展示已获得徽章
- 文件：`src/lib/store.ts`（新增徽章常量和 `checkBadges()`），`src/pages/SanctuaryPage.tsx`

**6. 社交传播**
- 封神卡Canvas加水印（"抢路头·丙午马年"）
- 新增"生成利市红包"按钮（Canvas绘制红包图 + 用户祝福语 + 下载）
- 分享引导弹窗（提示保存图片分享到微信/朋友圈）
- 文件：`src/components/CeremonyCard.tsx`，新建 `src/components/RedPacket.tsx`

### P2：长期价值

**7. 财运档案页**
- 新建 `src/pages/ArchivePage.tsx`（或集成到道场页）
- 展示：雷达图当前值、历史封神卡列表、香火增长趋势折线图、连续登录天数
- 路由新增或作为道场子模块
- 文件：新建 `src/components/FortuneArchive.tsx`，修改 `src/pages/SanctuaryPage.tsx`

**8. 双模式切换**
- 根据当前日期判断是否在"狂欢期"（正月初四-十五）
- 狂欢模式：首页更热烈的动画、双倍香火、限时榜单高亮
- 日常模式：柔和配色、常规奖励
- 文件：`src/lib/store.ts`（新增 `getMode()`），影响 `Index.tsx` 和 `WorshipPage.tsx`

---

## 四、技术细节

### 需要修改的文件清单

| 文件 | 改动类型 |
|------|----------|
| `src/lib/store.ts` | 新增辅助函数：`checkLogin()`、`unlockRandomCard()`、`checkBadges()`、`getMode()`、`getTodayIncense()` |
| `src/pages/LeaderboardPage.tsx` | 重写三个Tab逻辑，新增职业/生肖筛选 |
| `src/components/TempleLayout.tsx` | 挂载时调用 `checkLogin()` |
| `src/pages/WorshipPage.tsx` | 各游戏结算处加入卡片解锁和徽章检测 |
| `src/components/TransitionOverlay.tsx` | 扩展为8种随机主题 |
| `src/pages/SanctuaryPage.tsx` | 新增每日任务区和徽章展示区 |
| `src/components/CeremonyCard.tsx` | Canvas加水印 |
| `src/components/RedPacket.tsx` | 新建，利市红包Canvas生成 |
| `src/components/FortuneArchive.tsx` | 新建，财运档案展示 |
| `src/pages/CollectionPage.tsx` | 无大改，卡片获取机制完善后自然生效 |

### 不新增依赖
所有功能均可用现有技术栈实现（React + Framer Motion + Recharts + Canvas + localStorage）。

