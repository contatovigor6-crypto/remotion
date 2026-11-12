// Trilha original "Cloud Drip" (trap/hip-hop instrumental, 140 BPM half-time), gerada em código.
// Sem samples de terceiros => livre para monetização.
import {writeFileSync} from 'node:fs';
const SR = 44100, BPM = 140, beat = 60 / BPM;
const DURATION = Number(process.argv[2] ?? 72);
const N = Math.floor(SR * DURATION);
const L = new Float32Array(N), R = new Float32Array(N);
let seed = 11;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const add = (t0, dur, fn, gl = 1, gr = 1) => {
	const s0 = Math.floor(t0 * SR), len = Math.floor(dur * SR);
	for (let i = 0; i < len && s0 + i < N; i++) { const v = fn(i / SR); L[s0 + i] += v * gl; R[s0 + i] += v * gr; }
};
const k808 = (t, m, d) => add(t, d, (x) => {
	const f = hz(m) * (1 + 1.5 * Math.exp(-x * 40));
	return Math.tanh(Math.sin(2 * Math.PI * f * x) * 2.2) * Math.exp(-x * (1.6 / d)) * 0.5;
});
const clap = (t) => add(t, 0.3, (x) => rnd() * (Math.exp(-x * 25) + (x > 0.012 ? 0.6 * Math.exp(-(x - 0.012) * 30) : 0)) * 0.32);
const hat = (t, v = 1) => add(t, 0.04, (x) => rnd() * Math.exp(-x * 90) * 0.1 * v, 0.6, 1);
const pluck = (t, m, d) => add(t, d, (x) => {
	const f = hz(m);
	return (Math.sin(2 * Math.PI * f * x) + 0.3 * Math.sin(4 * Math.PI * f * x)) * Math.exp(-x * 6) * 0.08;
}, 1, 0.8);
const pad = (t, notes, d) => add(t, d, (x) => {
	const env = Math.min(1, x / 0.8) * Math.min(1, (d - x) / 0.6);
	return notes.reduce((a, m) => a + Math.sin(2 * Math.PI * hz(m) * x) + 0.5 * Math.sin(2 * Math.PI * hz(m) * 1.005 * x), 0) * env * 0.02;
}, 0.8, 1.2);
// F#m - D - A - E (vibe sombria/curiosa)
const prog = [[54, 57, 61], [50, 54, 57], [57, 61, 64], [52, 56, 59]];
const bassN = [30, 26, 33, 28];
const melody = [73, 76, 78, 76, 73, 71, 73, 69];
const bar = beat * 4, bars = Math.ceil(DURATION / bar);
for (let b = 0; b < bars; b++) {
	const t = b * bar, c = b % 4;
	pad(t, prog[c], bar);
	const intro = b < 2;
	melody.forEach((m, i) => (i % 2 === 0 || !intro) && pluck(t + i * beat / 2, m - (c === 1 ? 2 : 0), beat));
	if (intro) continue;
	k808(t, bassN[c], beat * 1.5);
	k808(t + beat * 1.75, bassN[c], beat);
	k808(t + beat * 2.5, bassN[c] + (b % 2 ? 7 : 0), beat * 1.2);
	clap(t + beat * 2);
	for (let s = 0; s < 8; s++) hat(t + s * beat / 2, s % 2 ? 0.6 : 1);
	if (b % 2 === 1) for (let r = 0; r < 6; r++) hat(t + beat * 3.5 + r * beat / 12, 0.4 + r * 0.1); // roll
}
let peak = 0; for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const out = Buffer.alloc(44 + N * 4);
out.write('RIFF', 0); out.writeUInt32LE(36 + N * 4, 4); out.write('WAVEfmt ', 8); out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20); out.writeUInt16LE(2, 22); out.writeUInt32LE(SR, 24); out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32); out.writeUInt16LE(16, 34); out.write('data', 36); out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
	const fade = Math.min(1, (N - i) / (SR * 2));
	out.writeInt16LE(Math.round(Math.tanh((L[i] / peak) * 1.3) * 0.8 * fade * 32767), 44 + i * 4);
	out.writeInt16LE(Math.round(Math.tanh((R[i] / peak) * 1.3) * 0.8 * fade * 32767), 46 + i * 4);
}
writeFileSync(process.argv[3], out);
console.log('ok');
