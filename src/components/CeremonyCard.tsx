import { useRef, useEffect, useCallback } from "react";
import { UserProfile } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Props {
  profile: UserProfile;
}

export const CeremonyCard = ({ profile }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 400;
    const h = 560;
    canvas.width = w;
    canvas.height = h;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, "#8B0000");
    grad.addColorStop(0.5, "#C8102E");
    grad.addColorStop(1, "#8B0000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Gold border
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    // Inner decorative border
    ctx.strokeStyle = "rgba(255,215,0,0.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    // Title banner
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(30, 40, w - 60, 50);
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 22px 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("丙午马年·财神封神卡", w / 2, 72);

    // Horse emoji area
    ctx.font = "60px serif";
    ctx.fillText("🐴", w / 2, 150);

    // Title (封号)
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 26px 'PingFang SC', sans-serif";
    ctx.fillText(profile.title, w / 2, 200);

    // Divider
    const divGrad = ctx.createLinearGradient(50, 0, w - 50, 0);
    divGrad.addColorStop(0, "transparent");
    divGrad.addColorStop(0.5, "#FFD700");
    divGrad.addColorStop(1, "transparent");
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 220);
    ctx.lineTo(w - 50, 220);
    ctx.stroke();

    // User info
    ctx.fillStyle = "rgba(255,215,0,0.8)";
    ctx.font = "16px 'PingFang SC', sans-serif";
    ctx.fillText(`${profile.nickname} · ${profile.zodiac}年 · ${profile.profession}`, w / 2, 255);

    // Radar stats text
    ctx.font = "14px 'PingFang SC', sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    const stats = [
      `事业 ${profile.radarStats.career}`,
      `人脉 ${profile.radarStats.network}`,
      `偏财 ${profile.radarStats.luck}`,
      `健康 ${profile.radarStats.health}`,
      `福气 ${profile.radarStats.fortune}`,
    ];
    stats.forEach((s, i) => {
      ctx.fillText(s, w / 2, 290 + i * 22);
    });

    // Poem
    ctx.fillStyle = "rgba(255,215,0,0.6)";
    ctx.font = "15px serif";
    const lines = profile.poem.split("\n");
    lines.forEach((line, i) => {
      ctx.fillText(line, w / 2, 420 + i * 24);
    });

    // Bottom wish
    ctx.fillStyle = "#FFD700";
    ctx.font = "bold 14px 'PingFang SC', sans-serif";
    ctx.fillText(`愿望：${profile.wish}`, w / 2, 530);

    // Watermark
    ctx.fillStyle = "rgba(255,215,0,0.2)";
    ctx.font = "10px sans-serif";
    ctx.fillText("抢路头·财神封神殿", w / 2, h - 18);
  }, [profile]);

  useEffect(() => {
    drawCard();
  }, [drawCard]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `财神卡-${profile.nickname}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="text-center">
      <canvas
        ref={canvasRef}
        className="mx-auto rounded-xl border border-gold/30 shadow-lg"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <Button onClick={handleDownload} className="mt-4 bg-gold text-background hover:bg-gold-light">
        <Download className="h-4 w-4" /> 保存财神卡
      </Button>
    </div>
  );
};
