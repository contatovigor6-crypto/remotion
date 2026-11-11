// Synthesizes the 64s synthwave bed + risers/impacts for the video.
// 120 BPM, one bar = 2s = 60 frames. Run: node scripts/make-music.mjs <out.wav>
import { writeFileSync } from "node:fs";

const sr = 44100;
// Presets: "leonida" (64s, 16:9 video) and "nota" (42s vertical short)
const PRESET = process.argv[3] ?? "leonida";
const SHORT = PRESET === "nota";
const DUR = SHORT ? 42 : 64;
const N = sr * DUR;
const L = new Float32Array(N);
const R = new Float32Array(N);
const arpL = new Float32Array(N);
const arpR = new Float32Array(N);

let seed = 1337;
const rnd = () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const mtof = (m) => 440 * 2 ** ((m + TRANSPOSE - 69) / 12);
const BEAT = 0.5;
const BAR = 2;
const BARS = DUR / BAR;

// Section boundaries in seconds: overview, 6 regions, outro
const HITS = SHORT ? [4, 10, 18, 24, 32, 38] : [4, 8, 16, 24, 32, 40, 48, 56];
const DRUMS_FROM = SHORT ? 0 : 4;
const FULL_FROM = SHORT ? 4 : 8;
const END_RING = DUR - 2; // last bar rings out
// The short plays a fourth higher so the two videos don't sound alike
const TRANSPOSE = SHORT ? 5 : 0;

const CHORDS = [
  { bass: 33, notes: [57, 60, 64] }, // Am
  { bass: 29, notes: [53, 57, 60] }, // F
  { bass: 36, notes: [60, 64, 67] }, // C
  { bass: 31, notes: [55, 59, 62] }, // G
];

// Sidechain duck following the kick
const duck = (t) => {
  if (t < DRUMS_FROM || t >= END_RING) return 1;
  const tb = t % BEAT;
  return 1 - 0.55 * Math.exp(-tb * 11);
};

const kick = (t0, gain) => {
  let ph = 0;
  const len = Math.floor(0.4 * sr);
  const s0 = Math.floor(t0 * sr);
  for (let i = 0; i < len && s0 + i < N; i++) {
    const t = i / sr;
    ph += (2 * Math.PI * (46 + 120 * Math.exp(-t * 30))) / sr;
    const s = Math.sin(ph) * Math.exp(-t * 8) * gain;
    L[s0 + i] += s;
    R[s0 + i] += s;
  }
};

const snare = (t0, gain) => {
  const len = Math.floor(0.3 * sr);
  const s0 = Math.floor(t0 * sr);
  let lp = 0;
  for (let i = 0; i < len && s0 + i < N; i++) {
    const t = i / sr;
    const n = rnd() * 2 - 1;
    lp += 0.25 * (n - lp);
    const s =
      ((n - lp) * Math.exp(-t * 18) * 0.8 +
        Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 30) * 0.5) *
      gain;
    L[s0 + i] += s;
    R[s0 + i] += s;
  }
};

const hat = (t0, gain, pan) => {
  const len = Math.floor(0.06 * sr);
  const s0 = Math.floor(t0 * sr);
  let lp = 0;
  for (let i = 0; i < len && s0 + i < N; i++) {
    const t = i / sr;
    const n = rnd() * 2 - 1;
    lp += 0.6 * (n - lp);
    const s = (n - lp) * Math.exp(-t * 70) * gain;
    L[s0 + i] += s * (1 - pan);
    R[s0 + i] += s * (1 + pan);
  }
};

const bassNote = (t0, midi, gain) => {
  const f = mtof(midi);
  const len = Math.floor(0.24 * sr);
  const s0 = Math.floor(t0 * sr);
  let lp = 0;
  let ph = 0;
  for (let i = 0; i < len && s0 + i < N; i++) {
    const t = i / sr;
    ph += f / sr;
    const saw = 2 * (ph % 1) - 1;
    const cutoff = 220 + 1400 * Math.exp(-t * 14);
    const a = 1 - Math.exp((-2 * Math.PI * cutoff) / sr);
    lp += a * (saw - lp);
    const env =
      Math.min(1, t * 400) * Math.exp(-t * 5) * Math.min(1, (0.24 - t) * 60);
    const s =
      (lp + 0.5 * Math.sin(2 * Math.PI * f * t)) * env * gain * duck(t0 + t);
    L[s0 + i] += s;
    R[s0 + i] += s;
  }
};

const pad = (t0, dur, notes, gain, cutoff) => {
  const len = Math.floor((dur + 0.6) * sr);
  const s0 = Math.floor(t0 * sr);
  const voices = [];
  for (const m of notes) {
    for (const det of [-0.006, 0, 0.006]) {
      voices.push({ f: mtof(m) * (1 + det), ph: rnd(), pan: det * 90 });
    }
  }
  let lpL = 0;
  let lpR = 0;
  let lpL2 = 0;
  let lpR2 = 0;
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / sr);
  for (let i = 0; i < len && s0 + i < N; i++) {
    const t = i / sr;
    let l = 0;
    let r = 0;
    for (const v of voices) {
      v.ph += v.f / sr;
      const saw = 2 * (v.ph % 1) - 1;
      l += saw * (0.5 - v.pan);
      r += saw * (0.5 + v.pan);
    }
    lpL += a * (l - lpL);
    lpR += a * (r - lpR);
    lpL2 += a * (lpL - lpL2);
    lpR2 += a * (lpR - lpR2);
    const env =
      Math.min(1, t / 0.25) * Math.min(1, Math.max(0, (dur + 0.6 - t) / 0.6));
    const g = env * gain * duck(t0 + t);
    L[s0 + i] += lpL2 * g;
    R[s0 + i] += lpR2 * g;
  }
};

const arpNote = (t0, midi, gain, pan) => {
  const f = mtof(midi);
  const len = Math.floor(0.2 * sr);
  const s0 = Math.floor(t0 * sr);
  let lp = 0;
  let ph = 0;
  for (let i = 0; i < len && s0 + i < N; i++) {
    const t = i / sr;
    ph += f / sr;
    const pulse = ph % 1 < 0.3 ? 1 : -1;
    lp += 0.28 * (pulse - lp);
    const s = lp * Math.min(1, t * 600) * Math.exp(-t * 16) * gain;
    arpL[s0 + i] += s * (1 - pan);
    arpR[s0 + i] += s * (1 + pan);
  }
};

const riser = (tEnd, dur, gain) => {
  const len = Math.floor(dur * sr);
  const s0 = Math.floor((tEnd - dur) * sr);
  let lp = 0;
  let lp2 = 0;
  for (let i = 0; i < len && s0 + i < N; i++) {
    const p = i / len;
    const n = rnd() * 2 - 1;
    const cutoff = 300 + 9000 * p * p;
    const a = 1 - Math.exp((-2 * Math.PI * cutoff) / sr);
    lp += a * (n - lp);
    lp2 += 0.02 * (lp - lp2);
    const s = (lp - lp2) * p * p * gain;
    L[s0 + i] += s * (1 - 0.3 * Math.sin(p * 20));
    R[s0 + i] += s * (1 + 0.3 * Math.sin(p * 20));
  }
};

const impact = (t0, gain) => {
  const len = Math.floor(1.6 * sr);
  const s0 = Math.floor(t0 * sr);
  let ph = 0;
  let lp = 0;
  for (let i = 0; i < len && s0 + i < N; i++) {
    const t = i / sr;
    ph += (2 * Math.PI * (34 + 40 * Math.exp(-t * 6))) / sr;
    const n = rnd() * 2 - 1;
    lp += 0.12 * (n - lp);
    const s =
      (Math.sin(ph) * Math.exp(-t * 2.6) * 0.9 +
        lp * Math.exp(-t * 3.5) * 0.7) *
      gain;
    L[s0 + i] += s;
    R[s0 + i] += s;
  }
};

for (let bar = 0; bar < BARS; bar++) {
  const t0 = bar * BAR;
  const chord = CHORDS[bar % 4];
  const ringing = t0 >= END_RING;
  const full = t0 >= FULL_FROM;
  const drums = t0 >= DRUMS_FROM && !ringing;
  // Every second region lifts the arp an octave for variety
  const lift = full && Math.floor((t0 - FULL_FROM) / 8) % 2 === 1 ? 12 : 0;

  pad(
    t0,
    ringing ? 2.4 : BAR,
    chord.notes,
    full ? 0.05 : 0.075,
    full ? 1300 : 700 + bar * 250,
  );
  if (ringing) {
    pad(t0, 2.4, [chord.notes[0] + 12, chord.notes[2] + 12], 0.03, 2000);
    continue;
  }

  for (let b = 0; b < 4; b++) {
    const tb = t0 + b * BEAT;
    if (drums) {
      kick(tb, 0.85);
      if (b % 2 === 1 && full) snare(tb, 0.5);
      hat(tb + BEAT / 2, 0.22, 0.2);
      if (full) hat(tb + BEAT * 0.75, 0.1, -0.3);
    }
    if (t0 >= DRUMS_FROM) {
      bassNote(tb, chord.bass, 0.3);
      bassNote(tb + BEAT / 2, chord.bass + (b === 3 ? 12 : 0), 0.26);
    }
    for (let s = 0; s < 4; s++) {
      const idx = b * 4 + s;
      const pattern = [0, 1, 2, 1, 0, 2, 1, 2];
      const tone =
        chord.notes[pattern[idx % 8]] + 12 + (idx % 8 >= 4 ? 12 : 0) + lift;
      const g = t0 < DRUMS_FROM ? 0.05 + 0.03 * (t0 / 4) : full ? 0.11 : 0.09;
      arpNote(tb + s * (BEAT / 4), tone, g, idx % 2 === 0 ? -0.35 : 0.35);
    }
  }
}

// Ping-pong delay on the arp bus (dotted eighth)
const dly = Math.floor(0.375 * sr);
for (let i = dly; i < N; i++) {
  arpL[i] += arpR[i - dly] * 0.42;
  arpR[i] += arpL[i - dly] * 0.42;
}
for (let i = 0; i < N; i++) {
  L[i] += arpL[i];
  R[i] += arpR[i];
}

riser(4, SHORT ? 2 : 3.5, 0.5); // long build under the title
for (const t of HITS.slice(1)) riser(t, 1.2, 0.34);
for (const t of HITS) impact(t, t === 4 || t === 8 ? 0.9 : 0.6);
impact(0.05, 0.7);

// Master: soft clip, fade in/out, 16-bit stereo WAV
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0);
buf.writeUInt32LE(36 + N * 4, 4);
buf.write("WAVEfmt ", 8);
buf.writeUInt32LE(16, 16);
buf.writeUInt16LE(1, 20);
buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(sr, 24);
buf.writeUInt32LE(sr * 4, 28);
buf.writeUInt16LE(4, 32);
buf.writeUInt16LE(16, 34);
buf.write("data", 36);
buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const t = i / sr;
  const fade = Math.min(1, t / 0.05) * Math.min(1, (DUR - t) / 1.8);
  const l = Math.tanh(L[i] * 1.5) * 0.82 * fade;
  const r = Math.tanh(R[i] * 1.5) * 0.82 * fade;
  buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
}
writeFileSync(process.argv[2] ?? "music.wav", buf);
