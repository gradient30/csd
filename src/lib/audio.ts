// Audio system using Web Audio API for synthesized sound effects

let audioCtx: AudioContext | null = null;
let globalMuted = false;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

export function setMuted(muted: boolean) {
  globalMuted = muted;
  localStorage.setItem("caishen_muted", muted ? "1" : "0");
}

export function isMuted(): boolean {
  const stored = localStorage.getItem("caishen_muted");
  if (stored !== null) globalMuted = stored === "1";
  return globalMuted;
}

// Drum hit sound
export function playDrum() {
  if (isMuted()) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
  gain.gain.setValueAtTime(0.8, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

// Gong sound
export function playGong() {
  if (isMuted()) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 1);
  gain.gain.setValueAtTime(0.6, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1.5);
}

// Firecracker burst - layered pops with tonal resonance for festive feel
export function playFirecracker() {
  if (isMuted()) return;
  const ctx = getCtx();
  const count = 6 + Math.floor(Math.random() * 4);
  for (let i = 0; i < count; i++) {
    const delay = i * (40 + Math.random() * 30);
    setTimeout(() => {
      const t = ctx.currentTime;
      // Sharp pop noise
      const bufferSize = Math.floor(ctx.sampleRate * (0.03 + Math.random() * 0.03));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) {
        const env = Math.pow(1 - j / bufferSize, 3);
        data[j] = (Math.random() * 2 - 1) * env;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const popGain = ctx.createGain();
      popGain.gain.setValueAtTime(0.25 + Math.random() * 0.15, t);
      // Bandpass for crackle character
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 2000 + Math.random() * 3000;
      bp.Q.value = 1.5;
      source.connect(bp).connect(popGain).connect(ctx.destination);
      source.start();

      // Tonal ping for festive brightness
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800 + Math.random() * 1200, t);
      osc.frequency.exponentialRampToValueAtTime(200 + Math.random() * 200, t + 0.08);
      oscGain.gain.setValueAtTime(0.12, t);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.connect(oscGain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    }, delay);
  }
}

// Coin clink
export function playCoin() {
  if (isMuted()) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(2000, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.2);
}

// Bell chime
export function playBell() {
  if (isMuted()) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(1200, ctx.currentTime);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
  osc.connect(gain).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.8);
}

// Success fanfare
export function playSuccess() {
  if (isMuted()) return;
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    }, i * 150);
  });
}
