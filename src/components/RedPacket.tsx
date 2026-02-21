import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Gift, Shuffle } from "lucide-react";

// Rich template system for random red packets
const BLESSINGS = [
  "恭喜发财，大吉大利！",
  "财源滚滚，日进斗金！",
  "马到成功，万事如意！",
  "招财进宝，年年有余！",
  "鸿运当头，步步高升！",
  "五路财神，护佑平安！",
  "金玉满堂，福寿双全！",
  "一帆风顺，财运亨通！",
  "生意兴隆，财源广进！",
  "紫气东来，好运连连！",
];

const CENTER_CHARS = ["福", "财", "旺", "发", "吉", "禄", "喜", "顺"];

const THEMES = [
  { name: "经典朱红", bg1: "#E53935", bg2: "#C62828", bg3: "#B71C1C", accent: "#FFD700", pattern: "classic" },
  { name: "紫金祥瑞", bg1: "#6A1B9A", bg2: "#4A148C", bg3: "#38006b", accent: "#FFD700", pattern: "cloud" },
  { name: "翠绿招财", bg1: "#2E7D32", bg2: "#1B5E20", bg3: "#0d3d12", accent: "#FFD700", pattern: "bamboo" },
  { name: "玄金黑虎", bg1: "#37474F", bg2: "#263238", bg3: "#1a1a2e", accent: "#FFD700", pattern: "tiger" },
  { name: "蜜橙丰收", bg1: "#EF6C00", bg2: "#E65100", bg3: "#BF360C", accent: "#FFF8E1", pattern: "harvest" },
  { name: "桃粉良缘", bg1: "#E91E63", bg2: "#C2185B", bg3: "#880E4F", accent: "#FFE0B2", pattern: "blossom" },
  { name: "宝蓝如意", bg1: "#1565C0", bg2: "#0D47A1", bg3: "#0a2f6e", accent: "#FFD700", pattern: "wave" },
  { name: "绛紫显贵", bg1: "#8E24AA", bg2: "#6A1B9A", bg3: "#4A148C", accent: "#E1BEE7", pattern: "royal" },
];

const TOP_DECORATIONS = [
  "🧧 利市红包 🧧",
  "🐴 马年大吉 🐴",
  "💰 恭喜发财 💰",
  "🏮 新春快乐 🏮",
  "🐯 黑虎送宝 🐯",
  "✨ 五路迎财 ✨",
  "🎊 开工大吉 🎊",
  "🎆 鸿运当头 🎆",
];

const CORNER_EMOJIS = [
  ["🐴", "💰", "🏮", "🧧"],
  ["🐯", "🪙", "🎋", "🎊"],
  ["🐲", "💎", "🎆", "🎇"],
  ["🦁", "🏅", "🔔", "🎐"],
];

function drawPattern(ctx: CanvasRenderingContext2D, w: number, h: number, pattern: string, color: string) {
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.fillStyle = color;

  if (pattern === "cloud") {
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * w, y = Math.random() * h, r = 15 + Math.random() * 25;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + r * 0.7, y - r * 0.3, r * 0.7, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x - r * 0.5, y - r * 0.2, r * 0.6, 0, Math.PI * 2); ctx.fill();
    }
  } else if (pattern === "bamboo") {
    ctx.lineWidth = 2; ctx.strokeStyle = color; ctx.globalAlpha = 0.08;
    for (let i = 0; i < 6; i++) {
      const x = 30 + Math.random() * (w - 60);
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      for (let j = 0; j < 5; j++) {
        const y = 60 + j * 100 + Math.random() * 30;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (Math.random() > 0.5 ? 20 : -20), y - 30); ctx.stroke();
      }
    }
  } else if (pattern === "tiger") {
    ctx.globalAlpha = 0.04; ctx.font = "80px serif";
    ctx.fillText("🐯", w * 0.1, h * 0.3); ctx.fillText("🐯", w * 0.6, h * 0.7);
  } else if (pattern === "wave") {
    ctx.strokeStyle = color; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.08;
    for (let row = 0; row < 8; row++) {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 5) {
        ctx.lineTo(x, row * 70 + Math.sin(x / 30 + row) * 15 + 30);
      }
      ctx.stroke();
    }
  } else if (pattern === "harvest") {
    ctx.globalAlpha = 0.05; ctx.font = "40px serif";
    for (let i = 0; i < 8; i++) {
      ctx.fillText("🌾", Math.random() * w, Math.random() * h);
    }
  } else if (pattern === "blossom") {
    ctx.globalAlpha = 0.06; ctx.font = "30px serif";
    for (let i = 0; i < 10; i++) {
      ctx.fillText("🌸", Math.random() * w, Math.random() * h);
    }
  } else if (pattern === "royal") {
    ctx.globalAlpha = 0.05;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * w, y = Math.random() * h, s = 3 + Math.random() * 6;
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const angle = (j * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = x + Math.cos(angle) * s, py = y + Math.sin(angle) * s;
        j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.fill();
    }
  } else {
    // classic: diamond grid
    ctx.globalAlpha = 0.04;
    for (let row = 0; row < h / 40; row++) {
      for (let col = 0; col < w / 40; col++) {
        const cx = col * 40 + 20, cy = row * 40 + 20;
        ctx.beginPath();
        ctx.moveTo(cx, cy - 8); ctx.lineTo(cx + 8, cy); ctx.lineTo(cx, cy + 8); ctx.lineTo(cx - 8, cy);
        ctx.closePath(); ctx.fill();
      }
    }
  }
  ctx.restore();
}

function drawBorderStyle(ctx: CanvasRenderingContext2D, w: number, h: number, accent: string, style: number) {
  ctx.strokeStyle = accent;
  if (style === 0) {
    // Simple line border
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);
  } else if (style === 1) {
    // Double border
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.strokeRect(14, 14, w - 28, h - 28);
  } else if (style === 2) {
    // Rounded corners with dots
    ctx.lineWidth = 2;
    const r = 16, m = 12;
    ctx.beginPath();
    ctx.moveTo(m + r, m); ctx.lineTo(w - m - r, m); ctx.quadraticCurveTo(w - m, m, w - m, m + r);
    ctx.lineTo(w - m, h - m - r); ctx.quadraticCurveTo(w - m, h - m, w - m - r, h - m);
    ctx.lineTo(m + r, h - m); ctx.quadraticCurveTo(m, h - m, m, h - m - r);
    ctx.lineTo(m, m + r); ctx.quadraticCurveTo(m, m, m + r, m);
    ctx.stroke();
    // Corner dots
    ctx.fillStyle = accent;
    [{ x: m + 4, y: m + 4 }, { x: w - m - 4, y: m + 4 }, { x: m + 4, y: h - m - 4 }, { x: w - m - 4, y: h - m - 4 }]
      .forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill(); });
  } else {
    // Ornate border with inner line
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.globalAlpha = 1;
  }
}

export default function RedPacket() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blessing, setBlessing] = useState("恭喜发财，大吉大利！");
  const [generated, setGenerated] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("");

  const generate = (randomize = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 360;
    const h = 540;
    canvas.width = w;
    canvas.height = h;

    // Pick random elements
    const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const centerChar = CENTER_CHARS[Math.floor(Math.random() * CENTER_CHARS.length)];
    const topDeco = TOP_DECORATIONS[Math.floor(Math.random() * TOP_DECORATIONS.length)];
    const corners = CORNER_EMOJIS[Math.floor(Math.random() * CORNER_EMOJIS.length)];
    const borderStyle = Math.floor(Math.random() * 4);
    const usedBlessing = randomize ? BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)] : blessing;

    if (randomize) setBlessing(usedBlessing);
    setCurrentTheme(theme.name);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, theme.bg1);
    grad.addColorStop(0.4, theme.bg2);
    grad.addColorStop(1, theme.bg3);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Pattern overlay
    drawPattern(ctx, w, h, theme.pattern, theme.accent);

    // Border
    drawBorderStyle(ctx, w, h, theme.accent, borderStyle);

    // Corner emojis
    ctx.font = "22px serif";
    ctx.fillText(corners[0], 26, 42);
    ctx.fillText(corners[1], w - 40, 42);
    ctx.fillText(corners[2], 26, h - 22);
    ctx.fillText(corners[3], w - 40, h - 22);

    // Top decoration text
    ctx.fillStyle = theme.accent;
    ctx.font = "bold 24px 'PingFang SC', 'Microsoft YaHei', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(topDeco, w / 2, 70);

    // Decorative line under title
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 85); ctx.lineTo(w - 60, 85);
    ctx.stroke();
    ctx.restore();

    // Center circle with glow
    const glow = ctx.createRadialGradient(w / 2, h / 2 - 30, 10, w / 2, h / 2 - 30, 90);
    glow.addColorStop(0, theme.accent + "33");
    glow.addColorStop(0.6, theme.accent + "15");
    glow.addColorStop(1, "transparent");
    ctx.fillStyle = glow;
    ctx.fillRect(w / 2 - 100, h / 2 - 130, 200, 200);

    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 30, 65, 0, Math.PI * 2);
    ctx.fillStyle = theme.accent + "18";
    ctx.fill();
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 30, 55, 0, Math.PI * 2);
    ctx.strokeStyle = theme.accent + "60";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Center character
    ctx.fillStyle = theme.accent;
    ctx.font = "bold 56px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(centerChar, w / 2, h / 2 - 28);
    ctx.textBaseline = "alphabetic";

    // Blessing text
    ctx.font = "bold 18px 'PingFang SC', 'Microsoft YaHei', sans-serif";
    ctx.fillStyle = theme.accent;
    const lines = usedBlessing.match(/.{1,10}/g) || [usedBlessing];
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, h / 2 + 75 + i * 30);
    });

    // Small decorative elements around blessing
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.font = "14px serif";
    ctx.fillText("✦", w / 2 - 80, h / 2 + 75);
    ctx.fillText("✦", w / 2 + 80, h / 2 + 75);
    ctx.restore();

    // Bottom watermark
    ctx.fillStyle = theme.accent + "88";
    ctx.font = "11px 'PingFang SC', sans-serif";
    ctx.fillText("抢路头·丙午马年·财神封神殿", w / 2, h - 35);

    // Bottom decorative line
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, h - 50); ctx.lineTo(w - 80, h - 50);
    ctx.stroke();
    ctx.restore();

    setGenerated(true);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = "利市红包.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4 text-center">
      <div className="flex gap-2">
        <Input
          value={blessing}
          onChange={(e) => setBlessing(e.target.value)}
          placeholder="输入祝福语…"
          className="border-gold/30 text-center"
          maxLength={36}
        />
        <Button onClick={() => generate(false)} className="bg-crimson text-foreground hover:bg-crimson-light">
          <Gift className="h-4 w-4" /> 生成
        </Button>
      </div>
      <Button
        variant="outline"
        onClick={() => generate(true)}
        className="w-full border-gold/30 text-gold hover:bg-gold/10"
      >
        <Shuffle className="mr-1 h-4 w-4" /> 随机生成一个
      </Button>
      <canvas
        ref={canvasRef}
        className="mx-auto rounded-xl border border-gold/30 shadow-lg"
        style={{ maxWidth: "100%", height: "auto", display: generated ? "block" : "none" }}
      />
      {generated && (
        <div className="space-y-2">
          {currentTheme && <p className="text-xs text-gold/60">主题：{currentTheme}</p>}
          <div className="flex gap-2 justify-center">
            <Button onClick={download} className="bg-gold text-background hover:bg-gold-light">
              <Download className="h-4 w-4" /> 保存图片
            </Button>
            <Button variant="outline" onClick={() => generate(true)} className="border-gold/30 text-gold hover:bg-gold/10">
              <Shuffle className="h-4 w-4" /> 换一张
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">长按保存图片，分享给好友送祝福 🎉</p>
        </div>
      )}
    </div>
  );
}
