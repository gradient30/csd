import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Gift } from "lucide-react";

export default function RedPacket() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [blessing, setBlessing] = useState("恭喜发财，大吉大利！");
  const [generated, setGenerated] = useState(false);

  const generate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 360;
    const h = 540;
    canvas.width = w;
    canvas.height = h;

    // Red packet background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#E53935");
    grad.addColorStop(0.4, "#C62828");
    grad.addColorStop(1, "#B71C1C");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Gold border
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Top decoration
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 28px 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🧧 利市红包 🧧", w / 2, 60);

    // Center circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 - 30, 70, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,215,0,0.15)";
    ctx.fill();
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 福 character
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 60px serif";
    ctx.fillText("福", w / 2, h / 2 - 10);

    // Blessing text
    ctx.font = "18px 'PingFang SC', sans-serif";
    ctx.fillStyle = "#FFD700";
    const lines = blessing.match(/.{1,12}/g) || [blessing];
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, h / 2 + 80 + i * 28);
    });

    // Bottom
    ctx.fillStyle = "rgba(255,215,0,0.4)";
    ctx.font = "12px sans-serif";
    ctx.fillText("抢路头·丙午马年·财神封神殿", w / 2, h - 30);

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
        <Button onClick={generate} className="bg-crimson text-foreground hover:bg-crimson-light">
          <Gift className="h-4 w-4" /> 生成
        </Button>
      </div>
      <canvas
        ref={canvasRef}
        className="mx-auto rounded-xl border border-gold/30 shadow-lg"
        style={{ maxWidth: "100%", height: "auto", display: generated ? "block" : "none" }}
      />
      {generated && (
        <div className="space-y-2">
          <Button onClick={download} className="bg-gold text-background hover:bg-gold-light">
            <Download className="h-4 w-4" /> 保存红包图片
          </Button>
          <p className="text-xs text-muted-foreground">长按保存图片，分享给好友送祝福 🎉</p>
        </div>
      )}
    </div>
  );
}
